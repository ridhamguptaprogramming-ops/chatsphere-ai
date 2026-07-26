import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '@/features/chat/chat.service';
import { useChatStore } from '@/store/chatStore';
import { ConversationItem } from './ConversationItem';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/features/auth/components/Logo';
import {
  Plus,
  MoreVertical,
  Search,
  X,
  LogOut,
  User,
  Settings,
  Palette,
} from 'lucide-react';

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
  const navigate = useNavigate();
  const conversations = useChatStore((s) => s.conversations);
  const setConversations = useChatStore((s) => s.setConversations);
  const isLoading = useChatStore((s) => s.isLoadingConversations);
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Get display name with priority: full_name -> username -> email username -> 'User'
  const displayName =
    profile?.full_name ||
    profile?.username ||
    (profile?.email ? profile.email.split('@')[0] : null) ||
    'User';

  useEffect(() => {
    chatService
      .fetchConversations()
      .then(setConversations)
      .catch((err) => console.error('Failed to fetch conversations:', err));
  }, [setConversations]);

  // Close profile menu on click outside
  useEffect(() => {
    if (!showProfileMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

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
    <div className="flex h-full w-80 flex-col border-r border-white/[0.06] bg-ink-950">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/[0.06] px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <Logo size="sm" showText />
          <div className="flex items-center gap-0.5">
            <button
              onClick={onStartNewChat}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95"
              title="New conversation"
            >
              <Plus size={16} />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95"
              title="More options"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-white/40 font-medium tracking-wide">
          Your conversations
        </p>

        {/* Search */}
        <div className="relative mt-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl bg-white/[0.04] py-2 pl-9 pr-9 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 border border-white/[0.06] focus:border-sphere-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,114,255,0.06),0_0_16px_rgba(139,114,255,0.04)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-sphere-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <Search size={20} className="text-white/30" />
            </div>
            <p className="text-sm text-white/40">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={onStartNewChat}
                className="mt-3 text-sm font-medium text-sphere-400 hover:text-sphere-300 transition-colors"
              >
                Start a new chat
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="relative flex-shrink-0 border-t border-white/[0.06] px-3 py-3">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-all duration-200 hover:bg-white/[0.03] active:bg-white/[0.05]"
        >
          {/* Avatar */}
          <div className="relative h-9 w-9 flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-full w-full rounded-full object-cover ring-1 ring-white/[0.06]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-sphere-500/50 to-indigo-500/50 text-sm font-semibold text-white ring-1 ring-white/[0.06]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-950 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>

          {/* Name and status */}
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-white/90">
              {displayName}
            </p>
            <p className="text-xs text-emerald-400/80 font-medium">Online</p>
          </div>
        </button>

        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
          <div
            ref={profileMenuRef}
            className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900 shadow-xl shadow-black/40 animate-fade-in"
          >
            <div className="py-1">
              <button
                onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <User size={15} className="text-white/40" />
                Profile
              </button>
              <button
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Settings size={15} className="text-white/40" />
                Settings
              </button>
              <button
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Palette size={15} className="text-white/40" />
                Theme
              </button>
              <div className="mx-3 my-1 border-t border-white/[0.06]" />
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 transition-colors hover:bg-white/[0.04] hover:text-red-400"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

