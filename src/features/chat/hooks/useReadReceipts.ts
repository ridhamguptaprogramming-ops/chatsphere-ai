import { useEffect, useRef, useCallback } from 'react';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Hook that marks messages as read when they come into view.
 * Tracks the latest message visible and updates the read receipt.
 * Respects the readReceipts setting.
 */
export function useReadReceipts(conversationId: string | null) {
  const messages = useChatStore((s) => (conversationId ? s.messages[conversationId] : undefined));
  const currentUserId = useAuthStore((s) => s.user?.id);
  const readReceipts = useSettingsStore((s) => s.readReceipts);
  const lastMarkedRef = useRef<string | null>(null);

  const markAsRead = useCallback(
    (messageId: string) => {
      if (!conversationId || !messageId || messageId === lastMarkedRef.current || !readReceipts) return;

      lastMarkedRef.current = messageId;
      chatService.markAsRead(conversationId, messageId).catch(() => {
        // Silently fail — read receipts are non-critical
      });
    },
    [conversationId, readReceipts]
  );

  // When messages load, auto-mark the latest message as read
  useEffect(() => {
    if (!messages?.length || !currentUserId || !conversationId) return;

    // Find the latest message not sent by current user
    const latestOtherMessage = [...messages]
      .reverse()
      .find((m) => m.sender_id !== currentUserId && !m.is_deleted);

    if (latestOtherMessage && latestOtherMessage.id !== lastMarkedRef.current) {
      markAsRead(latestOtherMessage.id);
    }
  }, [messages, currentUserId, conversationId, markAsRead]);

  // Cleanup
  useEffect(() => {
    return () => {
      lastMarkedRef.current = null;
    };
  }, [conversationId]);

  return { markAsRead };
}

