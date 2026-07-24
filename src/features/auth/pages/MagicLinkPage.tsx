import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../components/AuthLayout';
import { authService } from '@/services/auth.service';

interface FormValues {
  email: string;
}

export default function MagicLinkPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await authService.signInWithMagicLink(values.email);
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to send magic link.');
    }
  }

  return (
    <AuthLayout
      title="Sign in with a magic link"
      subtitle="We'll email you a one-time link — no password needed."
      footer={
        <Link to="/auth/login" className="font-medium text-sphere-300 hover:text-sphere-200">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="text-center text-sm text-white/70">
          Check your inbox — click the link we sent to finish signing in.
        </p>
      ) : (
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

          {serverError && <p className="form-error text-center">{serverError}</p>}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
