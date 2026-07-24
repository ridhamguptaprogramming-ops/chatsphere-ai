import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';
import { ChatSidebar } from '@/features/chat/components/ChatSidebar';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { NewChatModal } from '@/features/chat/components/NewChatModal';
import { useState } from 'react';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    setActiveConversationId(conversationId || null);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleStartNewChat = () => {
    setShowNewChat(true);
  };

  return (
    <div className="flex h-screen bg-ink-950">
      {/* Sidebar — always visible on desktop, toggle on mobile */}
      <div className={`${conversationId ? 'hidden lg:flex' : 'flex'} flex-shrink-0`}>
        <ChatSidebar
          activeConversationId={conversationId || null}
          onSelectConversation={handleSelectConversation}
          onStartNewChat={handleStartNewChat}
        />
      </div>

      {/* Main area */}
      {conversationId ? (
        <ChatWindow conversationId={conversationId} />
      ) : (
        <div className="hidden flex-1 items-center justify-center lg:flex">
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
      )}

      {/* New chat modal */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </div>
  );
}

