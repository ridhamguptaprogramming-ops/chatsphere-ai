import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';
import { ChatSidebar } from '@/features/chat/components/ChatSidebar';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { NewChatModal } from '@/features/chat/components/NewChatModal';
import { MessageCircle, Plus, Shield, Lock, Eye } from 'lucide-react';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId);
  const [showNewChat, setShowNewChat] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveConversationId(conversationId || null);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
    setMobileSidebarOpen(false);
  };

  const handleStartNewChat = () => {
    setShowNewChat(true);
  };

  return (
    <div className="flex h-screen bg-ink-950 overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on desktop, slide drawer on mobile */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ease-out ${
          conversationId
            ? 'hidden lg:flex'
            : mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 z-50 flex w-80 animate-fade-in lg:relative lg:z-auto lg:flex'
            : 'flex w-80'
        }`}
      >
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
        <div className="relative hidden flex-1 items-center justify-center lg:flex overflow-hidden">
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
      )}

      {/* New chat modal */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </div>
  );
}

