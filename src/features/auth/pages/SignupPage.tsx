import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../components/AuthLayout';
import { OAuthButtons } from '../components/OAuthButtons';
import { authService } from '@/services/auth.service';

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>();

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      await authService.signUpWithPassword(values.email, values.password, values.username);
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to create account.');
    }
  }

  if (submitted) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We sent you a verification link.">
        <p className="text-center text-sm text-white/70">
          Click the link we emailed you to verify your account, then come back and sign in.
        </p>
        <button className="btn-secondary mt-6 w-full" onClick={() => navigate('/auth/login')}>
          Back to sign in
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join ChatSphere AI in seconds."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-sphere-300 hover:text-sphere-200">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="input-field"
            placeholder="yourname"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'At least 3 characters' },
              pattern: { value: /^[a-zA-Z0-9_.]+$/, message: 'Letters, numbers, _ and . only' },
            })}
          />
          {errors.username && <p className="form-error">{errors.username.message}</p>}
        </div>

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
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div>
          <label className="form-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
        </div>

        {serverError && <p className="form-error text-center">{serverError}</p>}

        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-white/40">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <OAuthButtons />
    </AuthLayout>
  );
}
