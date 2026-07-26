import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { useRealtimeMessages } from '@/features/chat/hooks/useRealtimeMessages';
import { useReadReceipts } from '@/features/chat/hooks/useReadReceipts';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import type { MessageWithDetails } from '@/store/chatStore';
import { ArrowLeft, Phone, Video, MoreHorizontal } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const navigate = useNavigate();
  const conversations = useChatStore((s) => s.conversations);
  const messages = useChatStore((s) => s.messages[conversationId] || []);
  const setMessages = useChatStore((s) => s.setMessages);
  const isLoading = useChatStore((s) => s.isLoadingMessages);
  const [replyTo, setReplyTo] = useState<MessageWithDetails | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherUser = conversation?.otherUser;
  const displayName =
    conversation?.type === 'direct'
      ? otherUser?.full_name || otherUser?.username || 'Unknown User'
      : conversation?.title || 'Group Chat';

  // Subscribe to realtime updates
  useRealtimeMessages(conversationId);
  useReadReceipts(conversationId);

  // Fetch messages on mount
  useEffect(() => {
    if (!messages.length) {
      useChatStore.getState().setLoadingMessages(true);
      chatService
        .fetchMessages(conversationId)
        .then((msgs) => {
          setMessages(conversationId, msgs);
          setHasMore(msgs.length >= 50);
        })
        .catch((err) => {
          console.error('Failed to fetch messages:', err);
          useChatStore.getState().setLoadingMessages(false);
        });
    }
  }, [conversationId, setMessages, messages.length]);

  const handleLoadMore = useCallback(async () => {
    const oldestMessage = messages[0];
    if (!oldestMessage || !hasMore) return;

    try {
      const olderMessages = await chatService.fetchMessages(conversationId, {
        before: oldestMessage.created_at,
      });
      if (olderMessages.length < 50) {
        setHasMore(false);
      }
      // Prepend older messages
      useChatStore.setState((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [...olderMessages, ...(state.messages[conversationId] || [])],
        },
      }));
    } catch (err) {
      console.error('Failed to load older messages:', err);
    }
  }, [conversationId, messages, hasMore]);

  const handleReply = useCallback((message: MessageWithDetails) => {
    setReplyTo(message);
  }, []);

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <MoreHorizontal size={20} className="text-white/30" />
          </div>
          <p className="text-sm text-white/40">Conversation not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header — glassmorphism style */}
      <div className="chat-header-glass flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <button
          onClick={() => navigate('/chat')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95 lg:hidden"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Avatar */}
        <div className="relative h-9 w-9 flex-shrink-0">
          {otherUser?.avatar_url ? (
            <img
              src={otherUser.avatar_url}
              alt={displayName}
              className="h-full w-full rounded-full object-cover ring-1 ring-white/[0.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-sphere-500/40 to-indigo-500/40 text-sm font-medium text-white ring-1 ring-white/[0.06]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {conversation.type === 'direct' && (
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-950 transition-colors duration-300 ${
                otherUser?.is_online ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-gray-600'
              }`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">{displayName}</h2>
          {conversation.type === 'direct' && (
            <p className="truncate text-xs font-medium transition-colors duration-300">
              {otherUser?.is_online ? (
                <span className="text-emerald-400/80">Online</span>
              ) : (
                <span className="text-white/40">Offline</span>
              )}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95" title="Voice call">
            <Phone size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95" title="Video call">
            <Video size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95" title="More">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        conversationId={conversationId}
        messages={messages}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        onReply={handleReply}
      />

      {/* Composer */}
      <MessageComposer
        conversationId={conversationId}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}

