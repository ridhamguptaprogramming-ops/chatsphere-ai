import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import type { ConversationWithMeta, MessageWithDetails } from '@/store/chatStore';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type MessageReaction = Database['public']['Tables']['message_reactions']['Row'];
type ReadReceipt = Database['public']['Tables']['read_receipts']['Row'];

function mapMessageWithDetails(message: Message): MessageWithDetails {
  return {
    ...message,
    sender: { id: '', username: '', full_name: null, avatar_url: null },
    reactions: [],
    receipts: [],
    replyTo: null,
  };
}

export const chatService = {
  /**
   * Fetch all conversations for the current user, ordered by last_message_at desc.
   * Each conversation includes the other user's profile (for direct chats) and unread count.
   */
  async fetchConversations(): Promise<ConversationWithMeta[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get all conversation memberships for the current user
    const { data: memberships, error: mErr } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (mErr) throw mErr;
    if (!memberships?.length) return [];

    const conversationIds = memberships.map((m) => m.conversation_id);

    // Fetch conversations
    const { data: conversations, error: cErr } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (cErr) throw cErr;
    if (!conversations) return [];

    const results: ConversationWithMeta[] = [];

    for (const conv of conversations) {
      // Fetch members with profiles for this conversation
      const { data: members } = await supabase
        .from('conversation_members')
        .select(`
          *,
          profile:profiles!inner(id, username, full_name, avatar_url, is_online, last_seen)
        `)
        .eq('conversation_id', conv.id);

      const typedMembers = (members || []).map((m: Record<string, unknown>) => ({
        ...(m as Omit<typeof m, 'profile'>),
        profile: (m as unknown as { profile: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url' | 'is_online' | 'last_seen'> }).profile,
      })) as ConversationWithMeta['members'];

      // Get the other user (for direct conversations)
      const otherUser = conv.type === 'direct'
        ? typedMembers.find((m) => m.user_id !== user.id)?.profile ?? null
        : null;

      // Fetch the last message
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Count unread messages since last_read_message_id
      const myMember = typedMembers.find((m) => m.user_id === user.id);
      let unreadCount = 0;
      if (myMember?.last_read_message_id) {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_deleted', false)
          .neq('sender_id', user.id)
          .gt('created_at', myMember.last_read_message_id);

        unreadCount = count ?? 0;
      } else if (myMember) {
        // No last_read_message_id set — count all messages not from self
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_deleted', false)
          .neq('sender_id', user.id);

        unreadCount = count ?? 0;
      }

      results.push({
        ...conv,
        members: typedMembers,
        lastMessage: lastMsg ?? undefined,
        unreadCount,
        otherUser: otherUser ?? undefined,
      });
    }

    // Sort by last_message_at descending
    results.sort((a, b) => {
      const aTime = a.lastMessage?.created_at || a.created_at;
      const bTime = b.lastMessage?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return results;
  },

  /**
   * Fetch messages for a conversation with pagination.
   */
  async fetchMessages(
    conversationId: string,
    { pageSize = 50, before }: { pageSize?: number; before?: string } = {}
  ): Promise<MessageWithDetails[]> {
    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(pageSize);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data: messages, error } = await query;
    if (error) throw error;

    if (!messages?.length) return [];

    const messageIds = messages.map((m) => m.id);

    // Fetch reactions
    const { data: reactions } = await supabase
      .from('message_reactions')
      .select('*, user:profiles!inner(id, username)')
      .in('message_id', messageIds);

    const reactionsByMessage: Record<string, (MessageReaction & { user: Pick<Profile, 'id' | 'username'> })[]> = {};
    (reactions || []).forEach((r: Record<string, unknown>) => {
      const reaction = {
        ...(r as Omit<typeof r, 'user'>),
        user: (r as unknown as { user: Pick<Profile, 'id' | 'username'> }).user,
      } as MessageReaction & { user: Pick<Profile, 'id' | 'username'> };
      
      const mid = reaction.message_id;
      if (!reactionsByMessage[mid]) reactionsByMessage[mid] = [];
      reactionsByMessage[mid].push(reaction);
    });

    // Fetch read receipts
    const { data: receipts } = await supabase
      .from('read_receipts')
      .select('*')
      .in('message_id', messageIds);

    const receiptsByMessage: Record<string, ReadReceipt[]> = {};
    (receipts || []).forEach((r) => {
      if (!receiptsByMessage[r.message_id]) receiptsByMessage[r.message_id] = [];
      receiptsByMessage[r.message_id].push(r);
    });

    // Fetch sender profiles
    const senderIds = [...new Set(messages.map((m) => m.sender_id))];
    const { data: senders } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', senderIds);

    const senderMap: Record<string, Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>> = {};
    (senders || []).forEach((s) => {
      senderMap[s.id] = s;
    });

    // Build the enriched messages (oldest first)
    return messages
      .reverse()
      .map((msg) => ({
        ...msg,
        sender: senderMap[msg.sender_id] || { id: msg.sender_id, username: 'Unknown', full_name: null, avatar_url: null },
        reactions: reactionsByMessage[msg.id] || [],
        receipts: receiptsByMessage[msg.id] || [],
        replyTo: null, // Simplified: could fetch reply_to in a follow-up
      }));
  },

  /**
   * Send a text message in a conversation.
   */
  async sendMessage(conversationId: string, content: string, replyToId?: string): Promise<MessageWithDetails> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        type: 'text',
        reply_to_id: replyToId || null,
      })
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to send message');

    return mapMessageWithDetails(data);
  },

  /**
   * Delete a message (soft delete — sets is_deleted = true).
   */
  async deleteMessage(messageId: string, forEveryone = false): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = { is_deleted: true };
    if (forEveryone) {
      updates.deleted_for_everyone = true;
    }
    const { error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', messageId);

    if (error) throw error;
  },

  /**
   * Add an emoji reaction to a message.
   */
  async addReaction(messageId: string, emoji: string): Promise<MessageReaction & { user: Pick<Profile, 'id' | 'username'> }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user.id,
        emoji,
      })
      .select('*, user:profiles!inner(id, username)')
      .single();

    if (error) {
      // If unique constraint fails (already reacted), just return existing
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('message_reactions')
          .select('*, user:profiles!inner(id, username)')
          .eq('message_id', messageId)
          .eq('user_id', user.id)
          .eq('emoji', emoji)
          .single();

        return existing as unknown as MessageReaction & { user: Pick<Profile, 'id' | 'username'> };
      }
      throw error;
    }

    const reaction = data as unknown as MessageReaction & { user: Pick<Profile, 'id' | 'username'> };
    return reaction;
  },

  /**
   * Remove an emoji reaction.
   */
  async removeReaction(reactionId: string): Promise<void> {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('id', reactionId);

    if (error) throw error;
  },

  /**
   * Set typing status for a conversation.
   */
  async setTyping(conversationId: string, isTyping: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upsert typing status
    const { error } = await supabase
      .from('typing_status')
      .upsert(
        {
          conversation_id: conversationId,
          user_id: user.id,
          is_typing: isTyping,
        },
        { onConflict: 'conversation_id, user_id' }
      );

    if (error) throw error;
  },

  /**
   * Mark a message as read (upsert read receipt).
   */
  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update last_read_message_id on conversation_members
    const { error: memberErr } = await supabase
      .from('conversation_members')
      .update({ last_read_message_id: messageId })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);

    if (memberErr) throw memberErr;

    // Upsert read receipt
    const { error: receiptErr } = await supabase
      .from('read_receipts')
      .upsert(
        {
          message_id: messageId,
          user_id: user.id,
          status: 'read',
        },
        { onConflict: 'message_id, user_id' }
      );

    if (receiptErr) throw receiptErr;
  },

  /**
   * Find or create a direct conversation with another user.
   * @param otherUserId - the user to start a conversation with
   * @param currentUserId - (optional) the authenticated user's ID, to avoid an extra auth fetch
   */
  async findOrCreateDirectConversation(otherUserId: string, currentUserId?: string): Promise<string> {
    let userId = currentUserId;
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      userId = user.id;
    }

    // Check if a direct conversation already exists between these two users
    // First, get all conversations where the current user is a member
    const { data: myConvs } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId);

    if (myConvs?.length) {
      const myConvIds = myConvs.map((c) => c.conversation_id);

      // Check if the other user is a member of any of these conversations (direct only)
      const { data: sharedMemberships } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .in('conversation_id', myConvIds)
        .eq('user_id', otherUserId);

      if (sharedMemberships?.length) {
        // Use maybeSingle() instead of single() to avoid errors when no match found
        const { data: conv } = await supabase
          .from('conversations')
          .select('id, type')
          .eq('id', sharedMemberships[0].conversation_id)
          .eq('type', 'direct')
          .maybeSingle();

        if (conv) return conv.id;
      }
    }

    // Create a new direct conversation
    const { data: conversation, error: convErr } = await supabase
      .from('conversations')
      .insert({
        type: 'direct',
        created_by: userId,
      })
      .select('id')
      .single();

    if (convErr) throw convErr;
    if (!conversation) throw new Error('Failed to create conversation');

    // Add members sequentially to satisfy RLS:
    // 1. Insert current user first (passes user_id = auth.uid())
    // 2. Then insert the other user (passes is_conversation_member() since we're now a member)
    const { error: member1Err } = await supabase
      .from('conversation_members')
      .insert({ conversation_id: conversation.id, user_id: userId, role: 'member' });

    if (member1Err) throw member1Err;

    const { error: member2Err } = await supabase
      .from('conversation_members')
      .insert({ conversation_id: conversation.id, user_id: otherUserId, role: 'member' });

    if (member2Err) throw member2Err;

    return conversation.id;
  },
};

