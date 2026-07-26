import { useState, useRef, useCallback } from 'react';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useTyping } from '@/features/chat/hooks/useTyping';
import { useSettingsStore } from '@/store/settingsStore';
import { EmojiPickerWrapper } from './EmojiPickerWrapper';
import type { MessageWithDetails } from '@/store/chatStore';
import { Send, Paperclip, X } from 'lucide-react';

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
  const enterToSend = useSettingsStore((s) => s.enterToSend);

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
    if (enterToSend) {
      // Enter sends, Shift+Enter adds new line
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    } else {
      // Enter adds new line, Ctrl+Enter sends
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSend();
      }
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
    <div className="composer-glass flex-shrink-0">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-3 border-b border-white/[0.04] px-4 py-2">
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
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 px-4 py-3">
        <EmojiPickerWrapper
          isOpen={isEmojiOpen}
          onToggle={() => setIsEmojiOpen(!isEmojiOpen)}
          onEmojiSelect={handleEmojiSelect}
        />

        <div className="flex flex-1 items-end gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 transition-all duration-200 focus-within:border-sphere-400/40 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_3px_rgba(139,114,255,0.06),0_0_16px_rgba(139,114,255,0.04)]">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
            style={{ maxHeight: '120px' }}
          />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
            title="Attach file"
          >
            <Paperclip size={16} />
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sphere-500 to-sphere-600 text-white shadow-sm shadow-sphere-500/30 transition-all duration-200 hover:from-sphere-400 hover:to-sphere-500 hover:shadow-md hover:shadow-sphere-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

