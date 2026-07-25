import { useEffect, useState } from 'react';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { ConversationItem } from './ConversationItem';
import { useAuth } from '@/hooks/useAuth';
import { FaSignOutAlt, FaSearch, FaPlus } from 'react-icons/fa';

interface ChatSidebarProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onStartNewChat: () => void;
}

export function ChatSidebar({
  activeConversationId,
  onSelectConversation,
  onStartNewChat,
}: ChatSidebarProps) {
  const conversations = useChatStore((s) => s.conversations);
  const setConversations = useChatStore((s) => s.setConversations);
  const isLoading = useChatStore((s) => s.isLoadingConversations);
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    chatService
      .fetchConversations()
      .then(setConversations)
      .catch((err) => console.error('Failed to fetch conversations:', err));
  }, [setConversations]);

  const filtered = searchQuery.trim()
    ? conversations.filter((c) => {
        const name =
          c.type === 'direct'
            ? c.otherUser?.full_name || c.otherUser?.username || 'Unknown User'
            : c.title || 'Group Chat';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : conversations;

  return (
    <div className="flex h-full w-80 flex-col border-r border-white/10 bg-ink-950">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-lg font-semibold text-white">Chats</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onStartNewChat}
              className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              title="New conversation"
            >
              <FaPlus size={14} />
            </button>
            <button
              onClick={signOut}
              className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              title="Sign out"
            >
              <FaSignOutAlt size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={12} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:ring-1 focus:ring-sphere-400"
          />
        </div>
      </div>

      {/* User info bar */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sphere-600/40 text-xs font-medium text-white">
            {profile?.username?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        <p className="text-sm text-white/70">{profile?.username || 'User'}</p>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-sphere-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-white/40">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={onStartNewChat}
                className="mt-2 text-sm text-sphere-400 hover:text-sphere-300"
              >
                Start a new chat
              </button>
            )}
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

