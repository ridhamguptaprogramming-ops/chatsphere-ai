import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

interface SettingsState {
  // General
  darkMode: boolean;
  language: AppLanguage;

  // Notifications
  pushNotifications: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  showPreview: boolean;

  // Privacy
  readReceipts: boolean;
  typingIndicator: boolean;
  onlineStatus: boolean;
  saveChatHistory: boolean;

  // Chat
  enterToSend: boolean;
  autoDownloadMedia: boolean;
  autoplayGifs: boolean;

  // Actions
  setDarkMode: (enabled: boolean) => void;
  setLanguage: (lang: AppLanguage) => void;
  setPushNotifications: (enabled: boolean) => void;
  setMessageNotifications: (enabled: boolean) => void;
  setGroupNotifications: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrateEnabled: (enabled: boolean) => void;
  setShowPreview: (enabled: boolean) => void;
  setReadReceipts: (enabled: boolean) => void;
  setTypingIndicator: (enabled: boolean) => void;
  setOnlineStatus: (enabled: boolean) => void;
  setSaveChatHistory: (enabled: boolean) => void;
  setEnterToSend: (enabled: boolean) => void;
  setAutoDownloadMedia: (enabled: boolean) => void;
  setAutoplayGifs: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Defaults
      darkMode: true,
      language: 'en',
      pushNotifications: true,
      messageNotifications: true,
      groupNotifications: true,
      soundEnabled: true,
      vibrateEnabled: false,
      showPreview: true,
      readReceipts: true,
      typingIndicator: true,
      onlineStatus: true,
      saveChatHistory: true,
      enterToSend: true,
      autoDownloadMedia: true,
      autoplayGifs: true,

      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setLanguage: (lang) => set({ language: lang }),
      setPushNotifications: (enabled) => set({ pushNotifications: enabled }),
      setMessageNotifications: (enabled) => set({ messageNotifications: enabled }),
      setGroupNotifications: (enabled) => set({ groupNotifications: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setVibrateEnabled: (enabled) => set({ vibrateEnabled: enabled }),
      setShowPreview: (enabled) => set({ showPreview: enabled }),
      setReadReceipts: (enabled) => set({ readReceipts: enabled }),
      setTypingIndicator: (enabled) => set({ typingIndicator: enabled }),
      setOnlineStatus: (enabled) => set({ onlineStatus: enabled }),
      setSaveChatHistory: (enabled) => set({ saveChatHistory: enabled }),
      setEnterToSend: (enabled) => set({ enterToSend: enabled }),
      setAutoDownloadMedia: (enabled) => set({ autoDownloadMedia: enabled }),
      setAutoplayGifs: (enabled) => set({ autoplayGifs: enabled }),
    }),
    {
      name: 'chatsphere-settings',
    }
  )
);

