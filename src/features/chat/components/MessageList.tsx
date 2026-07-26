import { useRef, useEffect, useCallback } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { MessageWithDetails } from '@/store/chatStore';
import { MessageCircle } from 'lucide-react';

interface MessageListProps {
  conversationId: string;
  messages: MessageWithDetails[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onReply?: (message: MessageWithDetails) => void;
}

export function MessageList({
  conversationId,
  messages,
  isLoading,
  onLoadMore,
  hasMore,
  onReply,
}: MessageListProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const prevMessageCountRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive (if already near bottom)
  const handleNewMessage = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      handleNewMessage();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, handleNewMessage]);

  if (isLoading && !messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-sphere-400" />
          <p className="text-sm text-white/40">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-xs px-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <MessageCircle size={24} className="text-white/30" />
          </div>
          <p className="text-sm font-medium text-white/50 mb-1">
            No messages yet
          </p>
          <p className="text-xs text-white/30 leading-relaxed">
            Send a message to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1">
        <Virtuoso
          ref={virtuosoRef}
          className="h-full"
          data={messages}
          followOutput="smooth"
          initialTopMostItemIndex={messages.length - 1}
          startReached={() => {
            if (hasMore && onLoadMore) {
              onLoadMore();
            }
          }}
          itemContent={(_index, message) => (
            <div className="px-4 py-0.5">
              <MessageBubble
                message={message}
                conversationId={conversationId}
                onReply={onReply}
              />
            </div>
          )}
          components={{
            Header: () =>
              hasMore ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sphere-400" />
                </div>
              ) : null,
          }}
        />
      </div>

      <TypingIndicator conversationId={conversationId} />
    </div>
  );
}

