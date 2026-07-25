import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGoogle, FaGithub, FaEye, FaEyeSlash, FaMessage, FaShield } from 'react-icons/fa6';
import { authService } from '@/services/auth.service';

interface LoginFormValues {
  email: string;
  password: string;
}

function FloatingParticle({ delay = 0, x = 0, y = 0, size = 2 }) {
  return (
    <div
      className="absolute rounded-full bg-sphere-400/20"
      style={{
        width: size + 'px',
        height: size + 'px',
        left: x + '%',
        top: y + '%',
        animation: `gentleFloat 6s ease-in-out ${delay}s infinite`,
        opacity: 0,
      }}
    />
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'google' | 'github' | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; x: number; y: number; size: number }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const from = (location.state as { from?: string })?.from ?? '/';

  useEffect(() => {
    const arr = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.6,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 1.5 + Math.random() * 2,
    }));
    setParticles(arr);
  }, []);

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
    setServerError(null);
    try {
      const magicLinkEmail = (document.getElementById('magic-email') as HTMLInputElement)?.value;
      if (!magicLinkEmail || !/^\S+@\S+\.\S+$/.test(magicLinkEmail)) {
        setServerError('Please enter a valid email address.');
        return;
      }
      await authService.signInWithMagicLink(magicLinkEmail);
      alert('Magic link sent! Check your inbox.');
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
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-ink-950">
      {/* ===== Background ===== */}
      <div className="pointer-events-none fixed inset-0">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(86,70,224,0.06)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(109,93,246,0.04)_0%,_transparent_50%)]" />

        {/* Subtle indigo glow behind the auth panel */}
        <div className="absolute right-0 top-1/4 h-[30rem] w-[30rem] -translate-y-1/4 rounded-full bg-indigo-600/8 blur-[120px]" />

        {/* Floating particles */}
        {particles.map((p) => (
          <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
        ))}

        {/* Minimal geometric lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="200" y1="0" x2="200" y2="800" stroke="#8B72FF" strokeWidth="0.5" />
          <line x1="500" y1="0" x2="500" y2="800" stroke="#8B72FF" strokeWidth="0.5" />
          <line x1="800" y1="0" x2="800" y2="800" stroke="#8B72FF" strokeWidth="0.5" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#8B72FF" strokeWidth="0.5" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="#8B72FF" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ===== Left Side — Brand Experience (desktop only) ===== */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between p-10 xl:p-14">
        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sphere-400 to-sphere-600 font-display text-sm font-bold shadow-sm">
            CS
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-white/90">ChatSphere</span>
        </motion.div>

        {/* Hero content */}
        <div className="flex flex-col items-start gap-10 max-w-lg">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <h1 className="font-display text-[2.6rem] xl:text-[3rem] font-bold leading-[1.15] tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                ChatSphere
              </span>
            </h1>
            <p className="mt-3 text-lg xl:text-xl font-display font-semibold text-white/60 leading-snug">
              Where conversations become{' '}
              <span className="bg-gradient-to-r from-sphere-300 to-indigo-300 bg-clip-text text-transparent">
                connections.
              </span>
            </p>
            <p className="mt-4 text-sm text-white/35 leading-relaxed max-w-md">
              Connect with people, exchange ideas, and build meaningful conversations in one beautiful space.
            </p>
          </motion.div>

          {/* Feature items */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="w-full space-y-5"
          >
            {/* Feature 01 */}
            <div className="flex items-start gap-4 group">
              <div className="feature-icon mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="feature-number">01</span>
                  <p className="text-sm font-medium text-white/80">Real-time conversations</p>
                </div>
                <p className="mt-1 text-xs text-white/35 leading-relaxed">
                  Stay connected with the people and ideas that matter.
                </p>
              </div>
            </div>

            {/* Feature 02 */}
            <div className="flex items-start gap-4 group">
              <div className="feature-icon mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="feature-number">02</span>
                  <p className="text-sm font-medium text-white/80">Private by design</p>
                </div>
                <p className="mt-1 text-xs text-white/35 leading-relaxed">
                  Your conversations belong to you.
                </p>
              </div>
            </div>

            {/* Feature 03 */}
            <div className="flex items-start gap-4 group">
              <div className="feature-icon mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="feature-number">03</span>
                  <p className="text-sm font-medium text-white/80">Built for connection</p>
                </div>
                <p className="mt-1 text-xs text-white/35 leading-relaxed">
                  A simple space to talk, collaborate, and grow.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom — Community Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="card-premium relative overflow-hidden p-5 max-w-md">
            {/* Subtle inner glow */}
            <div className="pointer-events-none absolute -inset-10">
              <div className="absolute top-0 left-1/3 h-20 w-20 rounded-full bg-sphere-400/10 blur-[40px]" />
            </div>

            <div className="relative flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sphere-400/10 text-sphere-400">
                <FaMessage className="text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-semibold text-white/85">
                  Your space is waiting.
                </p>
                <p className="mt-1.5 text-sm text-white/40 leading-relaxed">
                  Come back to the conversations that matter. Share ideas. Ask questions. Build connections.
                </p>

                {/* Animated activity indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sphere-400/40 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sphere-400" />
                  </span>
                  <span className="text-[11px] text-sphere-300/60 tracking-wide">
                    Your conversations are waiting for you.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== Right Side — Authentication Panel ===== */}
      <div className="relative flex min-h-screen w-full items-center justify-center lg:w-[48%] xl:w-[45%] px-4 sm:px-6 lg:px-10 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo (visible only on mobile) */}
          <motion.div variants={itemVariants} className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sphere-400 to-sphere-600 font-display text-sm font-bold shadow-sm">
              CS
            </div>
            <h1 className="font-display text-xl font-semibold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-white/40">Continue your conversations.</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            variants={itemVariants}
            className="card-elegant p-7 sm:p-8 lg:p-9"
          >
            {/* Card header */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sphere-400 to-sphere-600 font-display text-lg font-bold shadow-sm">
                CS
              </div>
              <h1 className="font-display text-xl font-semibold text-white hidden lg:block">Welcome back</h1>
              <p className="text-sm text-white/40 hidden lg:block">Continue your conversations.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="form-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input-premium"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="mb-1.5 text-xs font-medium text-sphere-400/70 hover:text-sphere-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input-premium pr-11"
                    placeholder="Enter your password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="checkbox-custom text-sm text-white/40">
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
                <p className="rounded-lg bg-red-500/8 px-3 py-2 text-center text-xs text-red-400/90">
                  {serverError}
                </p>
              )}

              {/* Submit Button */}
              <button type="submit" className="btn-gradient w-full text-sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue to ChatSphere
                    <FaArrowRight size={13} />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <span className="text-xs uppercase tracking-wider text-white/20">or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                className="btn-oauth w-full"
                disabled={pendingProvider !== null}
                onClick={() => handleOAuth('google')}
              >
                <FaGoogle className="h-4 w-4 text-white/40" />
                {pendingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}
              </button>
              <button
                type="button"
                className="btn-oauth w-full"
                disabled={pendingProvider !== null}
                onClick={() => handleOAuth('github')}
              >
                <FaGithub className="h-4 w-4 text-white/40" />
                {pendingProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
              </button>
              {oauthError && (
                <p className="rounded-lg bg-red-500/8 px-3 py-2 text-center text-xs text-red-400/90">
                  {oauthError}
                </p>
              )}
            </div>

            {/* Magic Link */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleMagicLink}
                className="text-xs font-medium text-sphere-400/60 hover:text-sphere-300 transition-colors"
              >
                Use a magic link instead
              </button>
            </div>

            {/* Security Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center border-t border-white/[0.04] pt-5">
              <FaShield className="h-3 w-3 text-white/15" />
              <span className="text-xs text-white/20">
                Secure authentication &middot; Your privacy matters
              </span>
            </div>
          </motion.div>

          {/* Signup section */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-sm text-white/35"
          >
            New to ChatSphere?{' '}
            <Link
              to="/auth/signup"
              className="font-medium text-sphere-400/70 hover:text-sphere-300 transition-colors"
            >
              Create your account
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

