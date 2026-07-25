import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { useRealtimeMessages } from '@/features/chat/hooks/useRealtimeMessages';
import { useReadReceipts } from '@/features/chat/hooks/useReadReceipts';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import type { MessageWithDetails } from '@/store/chatStore';
import { FaArrowLeft, FaPhone, FaVideo, FaEllipsisV } from 'react-icons/fa';

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
        <p className="text-sm text-white/40">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-ink-950 px-4 py-3">
        <button
          onClick={() => navigate('/chat')}
          className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80 lg:hidden"
        >
          <FaArrowLeft size={14} />
        </button>

        {/* Avatar */}
        <div className="relative h-9 w-9 flex-shrink-0">
          {otherUser?.avatar_url ? (
            <img
              src={otherUser.avatar_url}
              alt={displayName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-sphere-600/40 text-sm font-medium text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {conversation.type === 'direct' && (
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-950 ${
                otherUser?.is_online ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">{displayName}</h2>
          {conversation.type === 'direct' && (
            <p className="truncate text-xs text-white/40">
              {otherUser?.is_online ? 'Online' : 'Offline'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80">
            <FaPhone size={14} />
          </button>
          <button className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80">
            <FaVideo size={14} />
          </button>
          <button className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80">
            <FaEllipsisV size={14} />
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

