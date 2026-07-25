import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { Database } from '@/types/database.types';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface NewChatModalProps {
  onClose: () => void;
}

export function NewChatModal({ onClose }: NewChatModalProps) {
  const navigate = useNavigate();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isProcessing = useRef(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
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

  const handleSelectUser = async (otherUserId: string) => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    setProcessingUserId(otherUserId);
    setError(null);

    try {
      // Get authenticated user directly from Supabase (not Zustand store)
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authUser) {
        throw new Error('Not authenticated - please sign in again');
      }
      const userId = authUser.id;

      // Step 1: Check for existing direct conversation
      let conversationId: string | null = null;

      const { data: myMemberships } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', userId);

      if (myMemberships && myMemberships.length > 0) {
        const myIds = myMemberships.map((m) => m.conversation_id);

        const { data: shared } = await supabase
          .from('conversation_members')
          .select('conversation_id')
          .in('conversation_id', myIds)
          .eq('user_id', otherUserId);

        if (shared && shared.length > 0) {
          const { data: existingConv } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', shared[0].conversation_id)
            .eq('type', 'direct')
            .maybeSingle();

          if (existingConv) {
            conversationId = existingConv.id;
          }
        }
      }

      // Step 2: Create new conversation if none exists
      if (!conversationId) {
        // Log user info for debugging
        console.log('[NewChatModal] Creating conversation with userId:', userId);
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[NewChatModal] Session user ID:', session?.user?.id);

        const { data: newConv, error: createErr } = await supabase
          .from('conversations')
          .insert({
            type: 'direct',
            created_by: userId,
          })
          .select('id')
          .single();

        if (createErr) {
          throw new Error(`Failed to create conversation (userId=${userId}): ${createErr.message || JSON.stringify(createErr)}`);
        }
        if (!newConv) {
          throw new Error('Conversation creation returned no data');
        }

        conversationId = newConv.id;

        // Step 3: Add current user as member
        const { error: addSelfErr } = await supabase
          .from('conversation_members')
          .insert({
            conversation_id: conversationId,
            user_id: userId,
            role: 'member',
          });

        if (addSelfErr) {
          throw new Error(`Failed to add yourself: ${addSelfErr.message || JSON.stringify(addSelfErr)}`);
        }

        // Step 4: Add other user as member
        const { error: addOtherErr } = await supabase
          .from('conversation_members')
          .insert({
            conversation_id: conversationId,
            user_id: otherUserId,
            role: 'member',
          });

        if (addOtherErr) {
          throw new Error(`Failed to add user: ${addOtherErr.message || JSON.stringify(addOtherErr)}`);
        }
      }

      // Success - close modal and navigate
      onClose();
      navigate(`/chat/${conversationId}`, { replace: true });
    } catch (err: any) {
      const msg = err?.message || err?.error_description || JSON.stringify(err);
      console.error('[NewChatModal] Error:', err);
      setError(msg);
      isProcessing.current = false;
      setProcessingUserId(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing.current) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">New conversation</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={!!processingUserId}
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
          <div className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 break-words">
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
              {results.map((user) => {
                const isLoading = processingUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user.id)}
                    disabled={!!processingUserId}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 active:bg-white/10 disabled:cursor-wait disabled:opacity-50"
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
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white/90">
                        {user.full_name || user.username}
                      </p>
                      {user.full_name && (
                        <p className="text-xs text-white/40">@{user.username}</p>
                      )}
                    </div>
                    {isLoading && (
                      <FaSpinner className="animate-spin text-sphere-400" size={14} />
                    )}
                  </button>
                );
              })}
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

