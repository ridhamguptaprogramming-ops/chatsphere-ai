import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../components/AuthLayout';
import { OAuthButtons } from '../components/OAuthButtons';
import { authService } from '@/services/auth.service';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
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

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep the conversation going."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-sphere-300 hover:text-sphere-200">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input-field"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <Link to="/auth/forgot-password" className="mb-1.5 text-xs text-sphere-300 hover:text-sphere-200">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input-field"
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        {serverError && <p className="form-error text-center">{serverError}</p>}

        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-white/40">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <OAuthButtons />

      <p className="mt-6 text-center text-sm text-white/50">
        <Link to="/auth/magic-link" className="font-medium text-sphere-300 hover:text-sphere-200">
          Sign in with a magic link instead
        </Link>
      </p>
    </AuthLayout>
  );
}
