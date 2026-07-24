import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { authService, getOAuthErrorMessage } from '@/services/auth.service';

export function OAuthButtons() {
  const [pendingProvider, setPendingProvider] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOAuth(provider: 'google' | 'github') {
    setError(null);
    setPendingProvider(provider);
    try {
      await authService.signInWithOAuth(provider);
      // Browser will redirect to the provider; no further action needed here.
    } catch (err) {
      setError(getOAuthErrorMessage(err) || 'Failed to start OAuth sign-in.');
      setPendingProvider(null);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="btn-secondary w-full"
        disabled={pendingProvider !== null}
        onClick={() => handleOAuth('google')}
      >
        <FcGoogle className="h-5 w-5" />
        {pendingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}
      </button>
      <button
        type="button"
        className="btn-secondary w-full"
        disabled={pendingProvider !== null}
        onClick={() => handleOAuth('github')}
      >
        <FaGithub className="h-5 w-5" />
        {pendingProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
      </button>
      {error && <p className="form-error text-center">{error}</p>}
    </div>
  );
}
