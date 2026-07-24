import { useRef, useCallback } from 'react';
import { chatService } from '@/features/chat/chat.service';

/**
 * Hook to manage typing indicator broadcasting.
 * Uses a debounce approach — fires is_typing = true immediately on keystroke,
 * then sets is_typing = false after a period of inactivity.
 */
export function useTyping(conversationId: string | null) {
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCurrentlyTyping = useRef(false);

  const startTyping = useCallback(() => {
    if (!conversationId) return;

    if (!isCurrentlyTyping.current) {
      isCurrentlyTyping.current = true;
      chatService.setTyping(conversationId, true).catch(() => {
        // Silently fail — typing indicator is non-critical
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout — stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isCurrentlyTyping.current) {
        isCurrentlyTyping.current = false;
        chatService.setTyping(conversationId, false).catch(() => {});
      }
    }, 3000);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isCurrentlyTyping.current && conversationId) {
      isCurrentlyTyping.current = false;
      chatService.setTyping(conversationId, false).catch(() => {});
    }
  }, [conversationId]);

  return { startTyping, stopTyping };
}

