import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BrandPanel } from './BrandPanel';

interface AuthContainerProps {
  children: ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 auth-gradient-bg p-4 sm:p-6 lg:p-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-sphere-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-sphere-400/15 blur-[100px]" />
        <div className="absolute top-1/3 left-[10%] h-[20rem] w-[20rem] rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      {/* Main container */}
      <motion.div
        className="relative z-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0B0B14]/90 shadow-2xl shadow-black/40 md:flex-row md:backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Left brand panel - hidden on mobile */}
        <div className="w-full md:w-1/2 md:min-h-[600px] lg:min-h-[680px]">
          <BrandPanel />
        </div>

        {/* Right auth panel */}
        <div className="flex w-full flex-col justify-center md:w-1/2">
          <div className="glass-card-strong mx-4 my-6 p-6 sm:mx-6 sm:p-8 md:mx-8 md:my-8 lg:p-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

