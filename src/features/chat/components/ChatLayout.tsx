import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSidebar } from './ChatSidebar';
import { MessageCircle, Plus, Shield, Lock, Eye } from 'lucide-react';

// Fallback inline NewChatModal to avoid module not found errors.
// If a dedicated ./NewChatModal exists, replace or remove this fallback.
function NewChatModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-xl">
        <h3 className="font-display mb-4 text-lg font-semibold text-white">New chat</h3>
        <p className="mb-6 text-sm text-white/60">Create a new conversation.</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatLayout() {
  const navigate = useNavigate();
  const [showNewChat, setShowNewChat] = useState(false);

  const handleSelectConversation = useCallback(
    (id: string) => {
      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  const handleStartNewChat = useCallback(() => {
    setShowNewChat(true);
  }, []);

  return (
    <div className="flex h-screen bg-ink-950">
      {/* Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          activeConversationId={null}
          onSelectConversation={handleSelectConversation}
          onStartNewChat={handleStartNewChat}
        />
      </div>

      {/* Main content area — no conversation selected */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* Purple radial glow background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[500px] w-[500px] rounded-full bg-sphere-500/5 blur-[120px]" />
        </div>

        {/* Empty state content */}
        <div className="relative z-10 empty-state-fade-in text-center max-w-md px-6">
          {/* Glowing icon */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sphere-500/30 to-indigo-500/30 blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sphere-500/20 to-indigo-500/20 border border-white/[0.08] shadow-lg shadow-sphere-500/10">
              <MessageCircle
                size={36}
                className="text-sphere-400"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Welcome to ChatSphere
          </h1>
          <p className="text-base text-white/50 font-medium mb-1">
            Your conversations start here.
          </p>
          <p className="text-sm text-white/30 leading-relaxed mb-8">
            Start a conversation, share ideas, and connect with people who matter.
          </p>

          <button
            onClick={handleStartNewChat}
            className="btn-gradient inline-flex items-center gap-2 px-6 py-3"
          >
            <Plus size={18} />
            Start new chat
          </button>

          {/* Footer */}
          <div className="mt-12 flex items-center justify-center gap-4 text-xs text-white/20">
            <span className="flex items-center gap-1.5">
              <Shield size={12} />
              Secure
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Lock size={12} />
              Private
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Eye size={12} />
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* New chat modal */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </div>
  );
}

