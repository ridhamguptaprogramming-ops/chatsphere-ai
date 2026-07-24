import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-4 text-center">
      <div className="glass-panel w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-semibold">
          Welcome{profile?.username ? `, ${profile.username}` : ''} 👋
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Auth + database foundation is live. The chat UI, groups, channels, calling, and AI
          features get built on top of this in the next phases.
        </p>
        <button className="btn-secondary mt-6" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
