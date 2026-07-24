import type { Database } from '@/types/database.types';
import { useAuthStore } from '@/store/authStore';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';

type Profile = Database['public']['Tables']['profiles']['Row'];
type MessageReaction = Database['public']['Tables']['message_reactions']['Row'];

interface MessageReactionsProps {
  conversationId: string;
  messageId: string;
  reactions: (MessageReaction & { user: Pick<Profile, 'id' | 'username'> })[];
}

export function MessageReactions({ conversationId, messageId, reactions }: MessageReactionsProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const removeReaction = useChatStore((s) => s.removeReaction);

  if (!reactions.length) return null;

  // Group reactions by emoji
  const grouped = reactions.reduce<
    Record<string, (MessageReaction & { user: Pick<Profile, 'id' | 'username'> })[]>
  >((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r);
    return acc;
  }, {});

  const handleToggleReaction = async (emoji: string) => {
    const myReaction = reactions.find((r) => r.user_id === currentUserId && r.emoji === emoji);
    if (myReaction) {
      try {
        await chatService.removeReaction(myReaction.id);
        removeReaction(conversationId, messageId, myReaction.id);
      } catch (err) {
        console.error('Failed to remove reaction:', err);
      }
    } else {
      try {
        const newReaction = await chatService.addReaction(messageId, emoji);
        useChatStore.getState().addReaction(conversationId, messageId, newReaction);
      } catch (err) {
        console.error('Failed to add reaction:', err);
      }
    }
  };

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {Object.entries(grouped).map(([emoji, emojiReactions]) => {
        const hasMine = emojiReactions.some((r) => r.user_id === currentUserId);
        return (
          <button
            key={emoji}
            onClick={() => handleToggleReaction(emoji)}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
              hasMine
                ? 'bg-sphere-500/20 text-sphere-300 ring-1 ring-sphere-500/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span>{emoji}</span>
            <span>{emojiReactions.length}</span>
          </button>
        );
      })}
    </div>
  );
}

