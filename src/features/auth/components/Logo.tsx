import { MessageCircle } from 'lucide-react';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
}

const sizeMap: Record<LogoSize, { icon: number; text: string }> = {
  sm: { icon: 18, text: 'text-base' },
  md: { icon: 22, text: 'text-lg' },
  lg: { icon: 26, text: 'text-xl' },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sphere-400 to-sphere-600 blur-sm opacity-60" />
        <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-sphere-400 to-sphere-600 p-2 shadow-lg shadow-sphere-500/20">
          <MessageCircle size={iconSize} className="text-white" strokeWidth={1.5} />
        </div>
      </div>
      {showText && (
        <span className={`font-display font-bold tracking-tight text-white ${textSize}`}>
          Chat<span className="text-sphere-400">Sphere</span>
        </span>
      )}
    </div>
  );
}

