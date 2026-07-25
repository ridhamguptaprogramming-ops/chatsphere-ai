import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { chatService } from '@/features/chat/chat.service';
import { useAuthStore } from '@/store/authStore';
import type { Database } from '@/types/database.types';
import { FaSearch, FaTimes } from 'react-icons/fa';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface NewChatModalProps {
  onClose: () => void;
}

export function NewChatModal({ onClose }: NewChatModalProps) {
  const navigate = useNavigate();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Search both username and full_name with ilike using SQL % wildcard
        const searchPattern = `%${query}%`;
        const { data } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .or(`username.ilike.${searchPattern},full_name.ilike.${searchPattern}`)
          .neq('id', currentUserId || '')
          .limit(10);

        setResults(data || []);
      } catch (err) {
        console.error('Failed to search users:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUserId]);

  const handleSelectUser = async (userId: string) => {
    if (isCreating) return;
    setIsCreating(true);
    setError(null);

    try {
      const conversationId = await chatService.findOrCreateDirectConversation(userId, currentUserId);
      onClose();
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation. Please try again.');
      setIsCreating(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">New conversation</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={12} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username..."
            autoFocus
            className="w-full rounded-xl bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:ring-1 focus:ring-sphere-400"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-sphere-400" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  disabled={isCreating}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sphere-600/40 text-sm font-medium text-white">
                      {(user.full_name || user.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white/90">
                      {user.full_name || user.username}
                    </p>
                    {user.full_name && (
                      <p className="text-xs text-white/40">@{user.username}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <p className="py-4 text-center text-sm text-white/40">No users found</p>
          ) : (
            <p className="py-4 text-center text-sm text-white/30">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
