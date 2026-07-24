import { useState, useRef, useCallback } from 'react';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useTyping } from '@/features/chat/hooks/useTyping';
import { EmojiPickerWrapper } from './EmojiPickerWrapper';
import type { MessageWithDetails } from '@/store/chatStore';
import { FaPaperPlane } from 'react-icons/fa';

interface MessageComposerProps {
  conversationId: string;
  replyTo?: MessageWithDetails | null;
  onCancelReply: () => void;
}

export function MessageComposer({ conversationId, replyTo, onCancelReply }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { startTyping, stopTyping } = useTyping(conversationId);

  const handleSend = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    stopTyping();

    try {
      const message = await chatService.sendMessage(conversationId, trimmed, replyTo?.id);
      const messageWithDetails: MessageWithDetails = {
        ...message,
        sender: {
          id: currentUserId || '',
          username: '',
          full_name: null,
          avatar_url: null,
        },
        reactions: [],
        receipts: [],
        replyTo: replyTo || null,
      };
      addMessage(conversationId, messageWithDetails);
      setContent('');
      onCancelReply();

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  }, [content, conversationId, replyTo, isSending, stopTyping, currentUserId, addMessage, onCancelReply]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    startTyping();

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="border-t border-white/10 bg-ink-950 px-4 py-3">
      {/* Reply preview */}
      {replyTo && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border-l-2 border-sphere-400 bg-white/5 px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sphere-300">
              Replying to {replyTo.sender.full_name || replyTo.sender.username}
            </p>
            <p className="truncate text-xs text-white/50">
              {replyTo.content || 'Media message'}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-white/40 hover:text-white/80"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <EmojiPickerWrapper
          isOpen={isEmojiOpen}
          onToggle={() => setIsEmojiOpen(!isEmojiOpen)}
          onEmojiSelect={handleEmojiSelect}
        />

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:bg-white/10 focus:ring-1 focus:ring-sphere-400"
            style={{ maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sphere-500 text-white transition-all hover:bg-sphere-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaPaperPlane size={14} />
        </button>
      </div>
    </div>
  );
}

