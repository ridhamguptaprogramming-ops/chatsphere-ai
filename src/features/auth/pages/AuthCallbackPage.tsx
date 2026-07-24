import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '../components/AuthLayout';

// Supabase's `detectSessionInUrl: true` client option handles exchanging the
// code/hash for a session automatically; this page just waits for that to
// resolve and then routes the user into the app.
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function finalize() {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionError || !data.session) {
        setError(sessionError?.message ?? 'We could not complete sign-in. Try again.');
        return;
      }
      navigate('/', { replace: true });
    }

    finalize();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <AuthLayout title="Signing you in" subtitle="Just a moment while we finish up.">
      {error ? (
        <div className="text-center">
          <p className="form-error">{error}</p>
          <button className="btn-secondary mt-4" onClick={() => navigate('/auth/login')}>
            Back to sign in
          </button>
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-sphere-400" />
        </div>
      )}
    </AuthLayout>
  );
}
