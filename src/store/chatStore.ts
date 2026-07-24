import { create } from 'zustand';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Conversation = Database['public']['Tables']['conversations']['Row'];
type ConversationMember = Database['public']['Tables']['conversation_members']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type MessageReaction = Database['public']['Tables']['message_reactions']['Row'];
type ReadReceipt = Database['public']['Tables']['read_receipts']['Row'];

export interface ConversationWithMeta extends Conversation {
  members: (ConversationMember & { profile: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url' | 'is_online' | 'last_seen'> })[];
  lastMessage?: Message;
  unreadCount: number;
  otherUser?: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url' | 'is_online' | 'last_seen'>;
}

export interface MessageWithDetails extends Message {
  sender: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>;
  reactions: (MessageReaction & { user: Pick<Profile, 'id' | 'username'> })[];
  receipts: ReadReceipt[];
  replyTo?: MessageWithDetails | null;
}

interface ChatState {
  conversations: ConversationWithMeta[];
  activeConversationId: string | null;
  messages: Record<string, MessageWithDetails[]>;
  typingUsers: Record<string, string[]>; // conversationId -> userId[]
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;

  setConversations: (conversations: ConversationWithMeta[]) => void;
  addConversation: (conversation: ConversationWithMeta) => void;
  updateConversation: (id: string, updates: Partial<ConversationWithMeta>) => void;
  removeConversation: (id: string) => void;

  setActiveConversationId: (id: string | null) => void;
  setMessages: (conversationId: string, messages: MessageWithDetails[]) => void;
  addMessage: (conversationId: string, message: MessageWithDetails) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<MessageWithDetails>) => void;
  removeMessage: (conversationId: string, messageId: string) => void;

  addReaction: (conversationId: string, messageId: string, reaction: MessageReaction & { user: Pick<Profile, 'id' | 'username'> }) => void;
  removeReaction: (conversationId: string, messageId: string, reactionId: string) => void;

  addReceipt: (conversationId: string, messageId: string, receipt: ReadReceipt) => void;

  setTypingUsers: (conversationId: string, userIds: string[]) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;

  setLoadingConversations: (loading: boolean) => void;
  setLoadingMessages: (loading: boolean) => void;

  reset: () => void;
}

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  isLoadingConversations: true,
  isLoadingMessages: false,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  setConversations: (conversations) => set({ conversations, isLoadingConversations: false }),

  addConversation: (conversation) =>
    set((state) => {
      const exists = state.conversations.find((c) => c.id === conversation.id);
      if (exists) {
        return {
          conversations: state.conversations.map((c) =>
            c.id === conversation.id ? conversation : c
          ),
        };
      }
      return { conversations: [conversation, ...state.conversations] };
    }),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
    })),

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
      isLoadingMessages: false,
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] || [];
      const exists = existing.find((m) => m.id === message.id);
      if (exists) {
        return {
          messages: {
            ...state.messages,
            [conversationId]: existing.map((m) => (m.id === message.id ? message : m)),
          },
        };
      }
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    }),

  updateMessage: (conversationId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m.id === messageId ? { ...m, ...updates } : m
        ),
      },
    })),

  removeMessage: (conversationId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).filter((m) => m.id !== messageId),
      },
    })),

  addReaction: (conversationId, messageId, reaction) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m.id === messageId
            ? {
                ...m,
                reactions: m.reactions.some((r) => r.id === reaction.id)
                  ? m.reactions
                  : [...m.reactions, reaction],
              }
            : m
        ),
      },
    })),

  removeReaction: (conversationId, messageId, reactionId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m.id === messageId
            ? { ...m, reactions: m.reactions.filter((r) => r.id !== reactionId) }
            : m
        ),
      },
    })),

  addReceipt: (conversationId, messageId, receipt) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m.id === messageId
            ? {
                ...m,
                receipts: m.receipts.some((r) => r.id === receipt.id)
                  ? m.receipts
                  : [...m.receipts, receipt],
              }
            : m
        ),
      },
    })),

  setTypingUsers: (conversationId, userIds) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: userIds },
    })),

  addTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      if (current.includes(userId)) return state;
      return {
        typingUsers: { ...state.typingUsers, [conversationId]: [...current, userId] },
      };
    }),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter((id) => id !== userId),
      },
    })),

  setLoadingConversations: (loading) => set({ isLoadingConversations: loading }),
  setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),

  reset: () => set(initialState),
}));

