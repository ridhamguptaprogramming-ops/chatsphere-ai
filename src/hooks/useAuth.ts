import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const reset = useAuthStore((s) => s.reset);

  const signOut = useCallback(async () => {
    await authService.signOut('local');
    reset();
    navigate('/auth/login', { replace: true });
  }, [navigate, reset]);

  return {
    session,
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: Boolean(session),
    role: profile?.role ?? 'user',
    signOut,
  };
}
