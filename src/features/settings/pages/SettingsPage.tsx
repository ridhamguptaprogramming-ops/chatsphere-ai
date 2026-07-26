import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/features/auth/components/Logo';
import {
  ArrowLeft,
  Bell,
  BellRing,
  Moon,
  Globe,
  MessageSquare,
  Volume2,
  Vibrate,
  Eye,
  EyeOff,
  Shield,
  Trash2,
  Loader2,
  CheckCircle2,
  Lock,
  Key,
  Mail,
  Users,
  Image,
} from 'lucide-react';
import { authService } from '@/services/auth.service';

type SettingToggleProps = {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  icon?: React.ReactNode;
};

function SettingToggle({ label, description, enabled, onChange, icon }: SettingToggleProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-all duration-300 ${
          enabled ? 'bg-sphere-500' : 'bg-white/[0.08]'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 shadow-sm ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // General
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');

  // Notifications
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Privacy
  const [readReceipts, setReadReceipts] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [saveChatHistory, setSaveChatHistory] = useState(true);

  // Chat
  const [enterToSend, setEnterToSend] = useState(true);
  const [showMedia, setShowMedia] = useState(true);
  const [autoplayGifs, setAutoplayGifs] = useState(true);

  // Account action states
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setIsResetting(true);
    try {
      await authService.sendPasswordReset(user.email);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to send reset email:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95"
            >
              <ArrowLeft size={16} />
            </button>
            <Logo size="sm" />
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 empty-state-fade-in">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-white/40 mt-1">
            Customize your ChatSphere experience
          </p>
        </div>

        {/* General */}
        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Globe size={15} className="text-sphere-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              General
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              icon={<Moon size={15} className="text-sphere-400" />}
              label="Dark Mode"
              description="Use dark theme throughout the app"
              enabled={darkMode}
              onChange={setDarkMode}
            />
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <Globe size={15} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">Language</p>
                <p className="text-xs text-white/40 mt-0.5">App display language</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 text-sm text-white/80 outline-none focus:border-sphere-400/40 transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Bell size={15} className="text-sphere-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Notifications
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              icon={<BellRing size={15} className="text-sphere-400" />}
              label="Push Notifications"
              description="Receive push notifications when the app is closed"
              enabled={pushNotifications}
              onChange={setPushNotifications}
            />
            <SettingToggle
              icon={<MessageSquare size={15} className="text-sphere-400" />}
              label="Message Notifications"
              description="Notify me when I receive a new message"
              enabled={messageNotifications}
              onChange={setMessageNotifications}
            />
            <SettingToggle
              icon={<Users size={15} className="text-sphere-400" />}
              label="Group Notifications"
              description="Notify me for group chat messages"
              enabled={groupNotifications}
              onChange={setGroupNotifications}
            />
            <SettingToggle
              icon={<Volume2 size={15} className="text-sphere-400" />}
              label="Sound"
              description="Play sound for incoming messages"
              enabled={soundEnabled}
              onChange={setSoundEnabled}
            />
            <SettingToggle
              icon={<Vibrate size={15} className="text-sphere-400" />}
              label="Vibrate"
              description="Vibrate on new messages"
              enabled={vibrateEnabled}
              onChange={setVibrateEnabled}
            />
            <SettingToggle
              icon={showPreview ? <Eye size={15} className="text-sphere-400" /> : <EyeOff size={15} className="text-sphere-400" />}
              label="Message Preview"
              description="Show message preview in notifications"
              enabled={showPreview}
              onChange={setShowPreview}
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Shield size={15} className="text-sphere-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Privacy
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              icon={<Eye size={15} className="text-sphere-400" />}
              label="Read Receipts"
              description="Let others see when you've read their messages"
              enabled={readReceipts}
              onChange={setReadReceipts}
            />
            <SettingToggle
              icon={<MessageSquare size={15} className="text-sphere-400" />}
              label="Typing Indicator"
              description="Show when you're typing a message"
              enabled={typingIndicator}
              onChange={setTypingIndicator}
            />
            <SettingToggle
              icon={<Eye size={15} className="text-sphere-400" />}
              label="Online Status"
              description="Let others see when you're online"
              enabled={onlineStatus}
              onChange={setOnlineStatus}
            />
            <SettingToggle
              icon={<Lock size={15} className="text-sphere-400" />}
              label="Save Chat History"
              description="Keep a history of your conversations"
              enabled={saveChatHistory}
              onChange={setSaveChatHistory}
            />
          </div>
        </div>

        {/* Chat */}
        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <MessageSquare size={15} className="text-sphere-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Chat Preferences
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              icon={<Key size={15} className="text-sphere-400" />}
              label="Enter to Send"
              description="Press Enter to send, Shift+Enter for new line"
              enabled={enterToSend}
              onChange={setEnterToSend}
            />
            <SettingToggle
              icon={<Image size={15} className="text-sphere-400" />}
              label="Auto-download Media"
              description="Automatically download images and videos"
              enabled={showMedia}
              onChange={setShowMedia}
            />
            <SettingToggle
              icon={<Image size={15} className="text-sphere-400" />}
              label="Autoplay GIFs"
              description="Automatically play animated GIFs"
              enabled={autoplayGifs}
              onChange={setAutoplayGifs}
            />
          </div>
        </div>

        {/* Account */}
        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Shield size={15} className="text-sphere-400" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Account
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {/* Email */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <Mail size={15} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">Email</p>
                <p className="text-xs text-white/50 mt-0.5">{user?.email || 'Unknown'}</p>
              </div>
            </div>

            {/* Reset Password */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <Key size={15} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">Password</p>
                <p className="text-xs text-white/50 mt-0.5">Reset your account password</p>
                {resetSuccess && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Reset email sent! Check your inbox.
                  </p>
                )}
              </div>
              <button
                onClick={handleResetPassword}
                disabled={isResetting}
                className="btn-secondary inline-flex items-center gap-2 px-3 py-1.5 text-xs flex-shrink-0"
              >
                {isResetting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Key size={12} />
                )}
                {isResetting ? 'Sending...' : 'Reset'}
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
                <Trash2 size={15} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">Delete Account</p>
                <p className="text-xs text-white/50 mt-0.5">Permanently delete your account and all data</p>
              </div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20 flex-shrink-0"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs text-white/60 hover:text-white/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs text-white hover:bg-red-400 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center pb-12">
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 text-sm text-white/50 transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 active:scale-95"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

