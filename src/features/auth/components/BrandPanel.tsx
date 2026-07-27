import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop';

export function BrandPanel() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden md:block">
      {/* Background photograph */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B14] via-[#0F0B1A] to-[#0B0B14]" />
        <img
          src={HERO_IMAGE_URL}
          alt="People connecting and having meaningful conversations"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter:
              'brightness(0.7) saturate(1.2) contrast(1.1) hue-rotate(250deg) sepia(0.15)',
          }}
        />
        {/* Purple/indigo color grading overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sphere-900/40 via-sphere-800/30 to-ink-950/60 mix-blend-multiply" />
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-transparent to-[#0B0B14]/40" />
        {/* Bottom gradient for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#0B0B14] via-[#0B0B14]/60 to-transparent" />
      </div>

      {/* Subtle ambient glow accent */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sphere-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/8 blur-[60px]" />

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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom content over image */}
        <div className="pb-8">
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
            className="mt-4 max-w-xs text-sm leading-relaxed text-white/50"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Connect, share ideas, and build meaningful conversations in one
            beautiful space.
          </motion.p>

          {/* Bottom indicators */}
          <motion.div
            className="mt-6 flex items-center gap-2"
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
    </div>
  );
}

