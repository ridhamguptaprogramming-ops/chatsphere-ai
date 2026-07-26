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
    conversation.type === 'direct'
      ? conversation.otherUser?.full_name || conversation.otherUser?.username || 'Unknown User'
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
      className={`group relative w-full px-3 py-3 text-left transition-all duration-200 ${
        isActive
          ? 'bg-sphere-500/10 after:absolute after:left-0 after:top-1/2 after:h-8 after:w-0.5 after:-translate-y-1/2 after:rounded-full after:bg-sphere-400 after:shadow-glow-sm'
          : 'hover:bg-white/[0.03] active:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative h-10 w-10 flex-shrink-0">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="h-full w-full rounded-full object-cover ring-1 ring-white/[0.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-sphere-500/40 to-indigo-500/40 text-sm font-medium text-white ring-1 ring-white/[0.06]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Online indicator */}
          {conversation.type === 'direct' && (
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-950 transition-colors duration-300 ${
                isOtherOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-gray-600'
              }`}
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`truncate text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-white/80 group-hover:text-white/90'
              }`}
            >
              {displayName}
            </p>
            {time && (
              <span className="flex-shrink-0 text-[11px] text-white/40">{time}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {lastMessage ? (
              <>
                {isLastMessageMine && (
                  <span className="text-xs text-white/40 flex-shrink-0">You: </span>
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
          <div className="flex h-5 min-w-[1.25rem] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sphere-500 to-sphere-600 px-1.5 text-[10px] font-semibold text-white shadow-sm shadow-sphere-500/30">
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
}

