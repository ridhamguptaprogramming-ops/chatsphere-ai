import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useChatStore } from '@/store/chatStore';
import type { Database } from '@/types/database.types';
import type { MessageWithDetails } from '@/store/chatStore';

type Message = Database['public']['Tables']['messages']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function useRealtimeMessages(conversationId: string | null) {
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const addReaction = useChatStore((s) => s.addReaction);
  const removeReaction = useChatStore((s) => s.removeReaction);
  const addReceipt = useChatStore((s) => s.addReceipt);
  const addTypingUser = useChatStore((s) => s.addTypingUser);
  const removeTypingUser = useChatStore((s) => s.removeTypingUser);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const currentConvRef = useRef(conversationId);

  useEffect(() => {
    currentConvRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    // Clean up previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`conversation:${conversationId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: '' },
      },
    });

    // Listen for new messages
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Fetch sender profile and reactions
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithDetails: MessageWithDetails = {
            ...newMessage,
            sender: sender || { id: newMessage.sender_id, username: 'Unknown', full_name: null, avatar_url: null },
            reactions: [],
            receipts: [],
            replyTo: null,
          };

          addMessage(conversationId, messageWithDetails);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as Message;
          if (updated.is_deleted) {
            // Message was deleted — we still show it but mark it
            updateMessage(conversationId, updated.id, {
              is_deleted: true,
              content: updated.content,
              is_edited: updated.is_edited,
              deleted_for_everyone: updated.deleted_for_everyone,
            });
          } else {
            updateMessage(conversationId, updated.id, {
              content: updated.content,
              is_edited: updated.is_edited,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reactions',
        },
        (payload) => {
          const reaction = payload.new as Database['public']['Tables']['message_reactions']['Row'] & { user?: Pick<Profile, 'id' | 'username'> };
          
          // Fetch the user info if not present
          if (!reaction.user) {
            supabase
              .from('profiles')
              .select('id, username')
              .eq('id', reaction.user_id)
              .single()
              .then(({ data }) => {
                if (data) {
                  addReaction(conversationId, reaction.message_id, {
                    ...reaction,
                    user: data,
                  });
                }
              });
          } else {
            addReaction(conversationId, reaction.message_id, reaction as typeof reaction & { user: Pick<Profile, 'id' | 'username'> });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'message_reactions',
        },
        (payload) => {
          const old = payload.old as { id: string; message_id: string };
          removeReaction(conversationId, old.message_id, old.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'read_receipts',
        },
        (payload) => {
          const receipt = payload.new as Database['public']['Tables']['read_receipts']['Row'];
          addReceipt(conversationId, receipt.message_id, receipt);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'typing_status',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const typing = payload.new as Database['public']['Tables']['typing_status']['Row'];
          if (typing.is_typing) {
            addTypingUser(conversationId, typing.user_id);
          } else {
            removeTypingUser(conversationId, typing.user_id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'typing_status',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const typing = payload.new as Database['public']['Tables']['typing_status']['Row'];
          if (typing.is_typing) {
            addTypingUser(conversationId, typing.user_id);
          } else {
            removeTypingUser(conversationId, typing.user_id);
          }
        }
      );

    channel.subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, addMessage, updateMessage, addReaction, removeReaction, addReceipt, addTypingUser, removeTypingUser]);
}

