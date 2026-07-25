import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';
import { Shield } from 'lucide-react';
import { authService, getOAuthErrorMessage } from '@/services/auth.service';

export function SocialLogin() {
  const [pendingProvider, setPendingProvider] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOAuth(provider: 'google' | 'github') {
    setError(null);
    setPendingProvider(provider);
    try {
      await authService.signInWithOAuth(provider);
    } catch (err) {
      setError(getOAuthErrorMessage(err) || 'Failed to start sign-in.');
      setPendingProvider(null);
    }
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      {/* Divider */}
      <div className="auth-divider">
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">OR</span>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          className="btn-social"
          disabled={pendingProvider !== null}
          onClick={() => handleOAuth('google')}
        >
          <FcGoogle className="h-5 w-5 flex-shrink-0" />
          <span>{pendingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}</span>
        </button>
        <button
          type="button"
          className="btn-social"
          disabled={pendingProvider !== null}
          onClick={() => handleOAuth('github')}
        >
          <FaGithub className="h-5 w-5 flex-shrink-0" />
          <span>{pendingProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs text-red-400 text-center">
          {error}
        </p>
      )}

      {/* Magic link */}
      <div className="text-center">
        <Link to="/auth/magic-link" className="magic-link">
          Sign in with a magic link instead
        </Link>
      </div>

      {/* Divider before signup */}
      <div className="pt-2">
        <div className="auth-divider" />
      </div>

      {/* Signup prompt */}
      <div className="text-center">
        <p className="text-sm text-white/40">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="font-medium text-sphere-400 transition-colors hover:text-sphere-300"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* Security message */}
      <div className="flex items-center justify-center gap-1.5 pt-4">
        <Shield size={12} className="text-white/30" />
        <span className="text-[10px] text-white/25 tracking-wide">
          Secure authentication · Your privacy matters
        </span>
      </div>
    </motion.div>
  );
}

