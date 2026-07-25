import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGoogle, FaGithub, FaEnvelope, FaEye, FaEyeSlash, FaHeart } from 'react-icons/fa';
import { authService } from '@/services/auth.service';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'google' | 'github' | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const from = (location.state as { from?: string })?.from ?? '/';

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await authService.signInWithPassword(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to sign in.');
    }
  }

  async function handleMagicLink() {
    if (!magicEmail || !/^\S+@\S+\.\S+$/.test(magicEmail)) return;
    setServerError(null);
    try {
      await authService.signInWithMagicLink(magicEmail);
      setMagicSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to send magic link.');
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setOauthError(null);
    setPendingProvider(provider);
    try {
      await authService.signInWithOAuth(provider);
    } catch (err) {
      setOauthError(err instanceof Error ? err.message : 'Failed to start OAuth sign-in.');
      setPendingProvider(null);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-ink-950">
      {/* ===== Ambient Background Effects ===== */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-sphere-600/20 blur-[150px]" />
        <div className="absolute bottom-[-12rem] right-[-8rem] h-[36rem] w-[36rem] rounded-full bg-sphere-400/15 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[20rem] w-[20rem] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* ===== Desktop: Left Hero Section (55%) ===== */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative flex-col justify-between p-8 xl:p-12">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sphere-400 to-sphere-600 font-display text-base font-bold shadow-lg shadow-sphere-500/30">
            CS
          </div>
          <span className="font-display text-lg font-semibold text-white">ChatSphere</span>
        </motion.div>

        {/* Center Content */}
        <div className="flex flex-col items-start gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <h1 className="font-display text-5xl xl:text-6xl font-bold leading-[1.1] text-white">
              <span className="bg-gradient-to-r from-sphere-300 via-sphere-400 to-purple-400 bg-clip-text text-transparent">
                Connect.
              </span>
              <br />
              <span className="bg-gradient-to-r from-sphere-200 via-sphere-400 to-indigo-400 bg-clip-text text-transparent">
                Collaborate.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-sphere-400 to-blue-400 bg-clip-text text-transparent">
                Converse.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base text-white/40 leading-relaxed">
              Your intelligent conversation platform. Connect, collaborate, and create with your community in real-time.
            </p>
          </motion.div>

          {/* Premium Motivational Glass Card (no avatars / profile images) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="glass-premium-glow w-full max-w-md p-6 xl:p-8 relative overflow-hidden"
          >
            {/* Subtle animated glow inside card */}
            <div className="pointer-events-none absolute -inset-20 opacity-30">
              <div className="absolute top-0 left-1/4 h-40 w-40 rounded-full bg-sphere-400/20 blur-[60px] animate-pulse-glow" />
            </div>

            {/* Glowing heart icon */}
            <div className="relative mb-5 flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-sphere-400/20 blur-md animate-pulse-glow" />
                <FaHeart className="relative text-sphere-400 text-lg animate-pulse-glow" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-sphere-300/70">
                Community
              </span>
            </div>

            <div className="relative space-y-4">
              <p className="font-display text-lg xl:text-xl font-semibold text-white/90 leading-relaxed">
                &ldquo;Every conversation matters.&rdquo;
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Share ideas, solve problems, and grow together as a community.
              </p>
              <div className="my-4 h-px bg-gradient-to-r from-sphere-400/30 via-sphere-400/10 to-transparent" />
              <p className="text-sm text-white/60 font-medium">
                &ldquo;Log in. Connect. Come back.&rdquo;
              </p>
              <p className="text-xs text-white/40">
                Your conversations, your people, your space. We&apos;re here when you are.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom left — subtle glowing chat icon + tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-3 text-white/30"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-sphere-400/20 blur-md" />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xs text-white/30">Real-time conversations, powered by AI</span>
        </motion.div>
      </div>

      {/* ===== Right Section — Login Form (45%) ===== */}
      <div className="relative flex min-h-screen w-full items-center justify-center lg:w-[45%] xl:w-[42%] px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile Logo (hidden on desktop) */}
          <motion.div variants={itemVariants} className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sphere-400 to-sphere-600 font-display text-xl font-bold shadow-lg shadow-sphere-500/30">
              CS
            </div>
            <h1 className="font-display text-2xl font-semibold text-white">Welcome back</h1>
            <p className="mt-1.5 text-sm text-white/50">Sign in to keep the conversation going.</p>
          </motion.div>

          {/* Login Card — Premium Glassmorphism */}
          <motion.div
            variants={itemVariants}
            className="gradient-border glass-premium-glow p-6 sm:p-8 xl:p-10"
          >
            {/* Desktop header inside card */}
            <div className="mb-8 hidden lg:block">
              <h1 className="font-display text-2xl font-semibold text-white">Welcome back</h1>
              <p className="mt-1.5 text-sm text-white/50">Sign in to keep the conversation going.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="form-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input-refined"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              {/* Password with visibility toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="mb-1.5 text-xs font-medium text-sphere-300 hover:text-sphere-200 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input-refined pr-11"
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <label className="checkbox-custom text-sm text-white/50">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark mr-2.5" />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Server Error */}
              {serverError && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
                  {serverError}
                </p>
              )}

              {/* Sign In Button (Gradient + Arrow) */}
              <button type="submit" className="btn-gradient w-full text-sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <FaArrowRight size={14} />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs uppercase tracking-wider text-white/30">or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="btn-oauth w-full"
                disabled={pendingProvider !== null}
                onClick={() => handleOAuth('google')}
              >
                <FaGoogle className="h-4 w-4 text-white/60" />
                {pendingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}
              </button>
              <button
                type="button"
                className="btn-oauth w-full"
                disabled={pendingProvider !== null}
                onClick={() => handleOAuth('github')}
              >
                <FaGithub className="h-4 w-4 text-white/60" />
                {pendingProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
              </button>
              {oauthError && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
                  {oauthError}
                </p>
              )}
            </div>

            {/* Magic Link Section */}
            <div className="mt-5">
              {!isMagicLinkMode ? (
                <button
                  type="button"
                  onClick={() => setIsMagicLinkMode(true)}
                  className="btn-oauth w-full"
                >
                  <FaEnvelope className="h-4 w-4 text-white/60" />
                  Sign in with a magic link
                </button>
              ) : magicSent ? (
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
                  <p className="text-sm text-sphere-300 font-medium">Magic link sent!</p>
                  <p className="mt-1 text-xs text-white/40">
                    Check your inbox for the sign-in link.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setIsMagicLinkMode(false); setMagicSent(false); }}
                    className="mt-3 text-xs text-sphere-300 hover:text-sphere-200 transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="text-xs text-white/40">
                    Enter your email and we&apos;ll send you a one-time link.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-refined flex-1 py-2.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={!magicEmail || !/^\S+@\S+\.\S+$/.test(magicEmail)}
                      className="btn-gradient py-2.5 px-4 text-xs shrink-0"
                    >
                      Send
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMagicLinkMode(false)}
                    className="text-xs text-white/30 hover:text-white/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Secure Authentication Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center">
              <svg className="h-3.5 w-3.5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-xs text-white/25">
                End-to-end encrypted · Powered by Supabase
              </span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-sm text-white/50"
          >
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/signup"
              className="font-semibold text-sphere-300 hover:text-sphere-200 transition-colors"
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

