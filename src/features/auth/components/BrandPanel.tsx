import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export function BrandPanel() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden md:block">
      {/* Abstract background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B14] via-[#0F0B1A] to-[#0B0B14]" />
      <div className="abstract-grid absolute inset-0" />
      <div className="brand-panel-bg absolute inset-0" />

      {/* Animated SVG waves */}
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D5DF6" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#8B72FF" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#5646E0" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4335B3" stopOpacity={0.2} />
            <stop offset="50%" stopColor="#6D5DF6" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#8B72FF" stopOpacity={0.05} />
          </linearGradient>
          <filter id="blur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Wave 1 */}
        <motion.path
          className="wave-path"
          d="M 0 700 Q 150 550 300 650 Q 450 750 600 600 L 600 800 L 0 800 Z"
          fill="url(#waveGrad1)"
          filter="url(#blur1)"
        />
        {/* Wave 2 */}
        <motion.path
          className="wave-path-delayed"
          d="M 0 750 Q 150 650 300 700 Q 450 600 600 700 L 600 800 L 0 800 Z"
          fill="url(#waveGrad2)"
          filter="url(#blur1)"
        />
      </svg>

      {/* Floating abstract orbs */}
      <motion.div
        className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-sphere-500/10 blur-3xl"
        animate={{ x: [0, 15, -10, 5, 0], y: [0, -10, 5, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[20%] top-[40%] h-40 w-40 rounded-full bg-sphere-400/8 blur-3xl"
        animate={{ x: [0, -15, 10, -5, 0], y: [0, 10, -15, 5, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[30%] h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ x: [0, 10, -5, 15, 0], y: [0, -15, 10, -5, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative connection lines */}
      <svg
        className="absolute bottom-[30%] left-10 h-40 w-40 opacity-20"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.circle
          cx="20"
          cy="50"
          r="3"
          fill="#8B72FF"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
          cx="50"
          cy="30"
          r="2"
          fill="#8B72FF"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="80"
          cy="60"
          r="2.5"
          fill="#6D5DF6"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />
        <line x1="20" y1="50" x2="50" y2="30" stroke="#8B72FF" strokeWidth="0.5" opacity="0.4" />
        <line x1="50" y1="30" x2="80" y2="60" stroke="#6D5DF6" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="50" x2="80" y2="60" stroke="#8B72FF" strokeWidth="0.3" opacity="0.2" />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-10">
        {/* Top bar */}
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Logo size="md" />
          </motion.div>
          <motion.a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/60"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Back to website
            <ArrowRight size={12} />
          </motion.a>
        </div>

        {/* Center content */}
        <div className="mt-auto mb-8">
          <motion.h2
            className="font-display text-3xl font-bold leading-tight text-white md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Where conversations
            <br />
            become connections.
          </motion.h2>
          <motion.p
            className="mt-4 max-w-xs text-sm leading-relaxed text-white/40"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Connect, share ideas, and build meaningful conversations.
          </motion.p>
        </div>

        {/* Bottom indicators */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className="h-1.5 w-6 rounded-full bg-sphere-400" />
          <span className="h-1.5 w-2 rounded-full bg-white/20" />
          <span className="h-1.5 w-2 rounded-full bg-white/20" />
          <span className="h-1.5 w-2 rounded-full bg-white/20" />
        </motion.div>
      </div>
    </div>
  );
}

