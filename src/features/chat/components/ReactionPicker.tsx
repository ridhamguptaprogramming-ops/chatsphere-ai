import { useRef, useEffect } from 'react';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface ReactionPickerProps {
  conversationId: string;
  messageId: string;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function ReactionPicker({ conversationId, messageId, isOpen, onClose, anchorRef }: ReactionPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const addReaction = useChatStore((s) => s.addReaction);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    // Delay to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const handleReact = async (emoji: string) => {
    try {
      const reaction = await chatService.addReaction(messageId, emoji);
      addReaction(conversationId, messageId, reaction);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
    onClose();
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 z-50 mb-2 rounded-xl border border-white/10 bg-ink-900 p-2 shadow-xl"
    >
      <div className="flex gap-1">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className="rounded-lg p-2 text-lg transition-colors hover:bg-white/10"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

