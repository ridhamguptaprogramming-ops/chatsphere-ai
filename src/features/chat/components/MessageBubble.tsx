import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ReactionPicker } from './ReactionPicker';
import { MessageReactions } from './MessageReactions';
import type { MessageWithDetails } from '@/store/chatStore';

interface MessageBubbleProps {
  message: MessageWithDetails;
  conversationId: string;
  onReply?: (message: MessageWithDetails) => void;
}

export function MessageBubble({ message, conversationId, onReply }: MessageBubbleProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isMine = message.sender_id === currentUserId;
  const [showReactions, setShowReactions] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getReceiptIcon = () => {
    if (!isMine) return null;
    const receipts = message.receipts;
    if (receipts.some((r) => r.status === 'read')) return '👁️';
    if (receipts.some((r) => r.status === 'delivered')) return '✓✓';
    return '✓';
  };

  const getReceiptColor = () => {
    if (message.receipts.some((r) => r.status === 'read')) return 'text-blue-400';
    if (message.receipts.some((r) => r.status === 'delivered')) return 'text-white/60';
    return 'text-white/40';
  };

  // Truncate deleted messages
  if (message.is_deleted) {
    return (
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isMine ? 'bg-white/5' : 'bg-white/5'
        }`}>
          <p className="text-sm italic text-white/40">
            {message.deleted_for_everyone ? 'Message deleted' : 'Message deleted'}
          </p>
        </div>
      </div>
    );
  }

  // System messages
  if (message.type === 'system') {
    return (
      <div className="flex justify-center py-1">
        <p className="text-center text-xs text-white/40">{message.content}</p>
      </div>
    );
  }

  return (
    <div className={`group relative flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] ${isMine ? 'order-1' : 'order-1'}`}>
        {/* Sender name (for group chats) */}
        {!isMine && (
          <p className="mb-0.5 px-1 text-xs font-medium text-white/50">
            {message.sender.full_name || message.sender.username}
          </p>
        )}

        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isMine
              ? 'rounded-br-md bg-sphere-600/40'
              : 'rounded-bl-md bg-white/5'
          }`}
        >
          {/* Reply indicator */}
          {message.replyTo && (
            <div className="mb-1 rounded-lg border-l-2 border-sphere-400 bg-white/5 px-2 py-1">
              <p className="text-xs text-white/40">
                {message.replyTo.sender.full_name || message.replyTo.sender.username}
              </p>
              <p className="truncate text-xs text-white/60">
                {message.replyTo.content || 'Media message'}
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-white/90">{message.content}</p>

          {/* Reactions */}
          <MessageReactions
            conversationId={conversationId}
            messageId={message.id}
            reactions={message.reactions}
          />

          {/* Time + receipt */}
          <div className={`mt-1 flex items-center gap-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-white/30">{time}</span>
            {isMine && (
              <span className={`text-[10px] ${getReceiptColor()}`}>
                {getReceiptIcon()}
              </span>
            )}
          </div>
        </div>

        {/* Hover actions */}
        <div
          className={`absolute top-0 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 ${
            isMine ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'
          }`}
        >
          <button
            ref={moreRef}
            onClick={() => setShowReactions(!showReactions)}
            className="rounded-lg bg-ink-800 p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            title="React"
          >
            😊
          </button>
          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="rounded-lg bg-ink-800 p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              title="Reply"
            >
              ↩️
            </button>
          )}
        </div>

        <ReactionPicker
          conversationId={conversationId}
          messageId={message.id}
          isOpen={showReactions}
          onClose={() => setShowReactions(false)}
          anchorRef={moreRef as React.RefObject<HTMLButtonElement>}
        />
      </div>
    </div>
  );
}

