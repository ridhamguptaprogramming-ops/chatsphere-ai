import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSidebar } from './ChatSidebar';

// Fallback inline NewChatModal to avoid module not found errors.
// If a dedicated ./NewChatModal exists, replace or remove this fallback.
function NewChatModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded bg-ink-900 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">New chat</h3>
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
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sphere-600/20">
            <svg
              className="h-8 w-8 text-sphere-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-white/80">
            Select a conversation
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Choose a chat from the sidebar or start a new one
          </p>
          <button
            onClick={handleStartNewChat}
            className="btn-primary mt-6"
          >
            Start new chat
          </button>
        </div>
      </div>

      {/* New chat modal */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </div>
  );
}

