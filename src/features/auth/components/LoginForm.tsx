import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await authService.signInWithPassword(values.email, values.password);
      // The auth state listener in AuthProvider will handle redirect
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email field */}
        <div>
          <label htmlFor="email" className="label-auth">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input-auth"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Please enter a valid email',
              },
            })}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="label-auth mb-0">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-[11px] text-sphere-400/70 transition-colors hover:text-sphere-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="input-auth pr-10"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me checkbox */}
        <label className="checkbox-custom">
          <input
            type="checkbox"
            {...register('rememberMe')}
          />
          <span className="checkmark" />
          <span className="ml-2.5 text-xs text-white/40">Remember me</span>
        </label>

        {/* Server error */}
        {serverError && (
          <motion.p
            className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-400 text-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {serverError}
          </motion.p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="btn-gradient-auth w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue to ChatSphere
              <ArrowRight size={15} />
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
}

