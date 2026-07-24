import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';

interface TypingIndicatorProps {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const typingUserIds = useChatStore((s) => s.typingUsers[conversationId] || []);
  const currentUserId = useAuthStore((s) => s.user?.id);

  // Filter out current user
  const othersTyping = typingUserIds.filter((id) => id !== currentUserId);
  const conversations = useChatStore((s) => s.conversations);
  const conversation = conversations.find((c) => c.id === conversationId);
  const members = conversation?.members || [];

  if (othersTyping.length === 0) return null;

  const names = othersTyping.map((id) => {
    const member = members.find((m) => m.user_id === id);
    return member?.profile?.full_name || member?.profile?.username || 'Someone';
  });

  let text = '';
  if (names.length === 1) {
    text = `${names[0]} is typing...`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`;
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing...`;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-white/50">
      <span className="flex gap-0.5">
        <span className="h-1 w-1 animate-bounce rounded-full bg-sphere-400" style={{ animationDelay: '0ms' }} />
        <span className="h-1 w-1 animate-bounce rounded-full bg-sphere-400" style={{ animationDelay: '150ms' }} />
        <span className="h-1 w-1 animate-bounce rounded-full bg-sphere-400" style={{ animationDelay: '300ms' }} />
      </span>
      <span>{text}</span>
    </div>
  );
}

