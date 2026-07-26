import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

// Extend window with our custom sound function
declare global {
  interface Window {
    __chatsphere_play_sound?: () => void;
  }
}

/**
 * Watches the settings store and applies global effects:
 * - Dark mode class on <html>
 * - Sound effect for new messages
 * - Other global behaviors
 */
export function SettingsWatcher() {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  // Apply dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  // Set up sound playback for new messages
  useEffect(() => {
    if (!soundEnabled) {
      delete window.__chatsphere_play_sound;
      return;
    }

    const playMessageSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      } catch {
        // Audio not available
      }
    };

    window.__chatsphere_play_sound = playMessageSound;

    return () => {
      delete window.__chatsphere_play_sound;
    };
  }, [soundEnabled]);

  return null;
}

