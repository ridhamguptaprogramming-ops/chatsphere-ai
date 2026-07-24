import { useState, useRef, useEffect } from 'react';
import { FaSmile } from 'react-icons/fa';

// Inline emoji picker — lightweight set of common emojis
const EMOJI_CATEGORIES: { name: string; emojis: string[] }[] = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
  },
  {
    name: 'Gestures',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '🫶', '💋', '💯', '💢', '💥', '💫', '💦', '💨'],
  },
];

interface EmojiPickerWrapperProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function EmojiPickerWrapper({ onEmojiSelect, isOpen, onToggle }: EmojiPickerWrapperProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
        title="Add emoji"
      >
        <FaSmile size={18} />
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 z-50 mb-2 h-72 w-72 overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-xl"
        >
          {/* Category tabs */}
          <div className="flex border-b border-white/10">
            {EMOJI_CATEGORIES.map((cat, index) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(index)}
                className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                  activeCategory === index
                    ? 'border-b-2 border-sphere-400 text-sphere-300'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="h-[calc(100%-36px)] overflow-y-auto p-2">
            <div className="flex flex-wrap gap-0.5">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onEmojiSelect(emoji);
                    onToggle();
                  }}
                  className="rounded-lg p-1.5 text-lg transition-colors hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

