import type { ConversationWithMeta } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';

interface ConversationItemProps {
  conversation: ConversationWithMeta;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const displayName =
    conversation.type === 'direct' && conversation.otherUser
      ? conversation.otherUser.full_name || conversation.otherUser.username
      : conversation.title || 'Group Chat';

  const displayAvatar = conversation.type === 'direct' && conversation.otherUser
    ? conversation.otherUser.avatar_url
    : null;

  const isOtherOnline = conversation.type === 'direct' && conversation.otherUser?.is_online;
  const lastMessage = conversation.lastMessage;
  const isLastMessageMine = lastMessage?.sender_id === currentUserId;

  const time = lastMessage
    ? new Date(lastMessage.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left transition-colors hover:bg-white/5 ${
        isActive ? 'bg-white/10' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative h-10 w-10 flex-shrink-0">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-sphere-600/40 text-sm font-medium text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Online indicator */}
          {conversation.type === 'direct' && (
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-950 ${
                isOtherOnline ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-white/90">{displayName}</p>
            {time && <span className="flex-shrink-0 text-[11px] text-white/40">{time}</span>}
          </div>
          <div className="flex items-center gap-1">
            {lastMessage ? (
              <>
                {isLastMessageMine && (
                  <span className="text-xs text-white/40">You: </span>
                )}
                <p className="truncate text-xs text-white/50">
                  {lastMessage.is_deleted
                    ? 'Message deleted'
                    : lastMessage.content || 'Media'}
                </p>
              </>
            ) : (
              <p className="text-xs text-white/30">No messages yet</p>
            )}
          </div>
        </div>

        {/* Unread badge */}
        {conversation.unreadCount > 0 && (
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sphere-500 text-[10px] font-medium text-white">
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
}
