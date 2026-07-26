import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/features/auth/components/Logo';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Globe,
  Phone,
  MapPin,
  Shield,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  AtSign,
  Edit3,
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  // Sync form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setWebsite(profile.website || '');
      setPhoneNumber(profile.phone_number || '');
      setCountry(profile.country || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const displayName =
    profile?.full_name ||
    profile?.username ||
    (user?.email ? user.email.split('@')[0] : null) ||
    'User';

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          username,
          bio: bio || null,
          website: website || null,
          phone_number: phoneNumber || null,
          country: country || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save profile');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setUsername(profile?.username || '');
    setBio(profile?.bio || '');
    setWebsite(profile?.website || '');
    setPhoneNumber(profile?.phone_number || '');
    setCountry(profile?.country || '');
    setIsEditing(false);
    setSaveError(null);
  };

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 active:scale-95"
            >
              <ArrowLeft size={16} />
            </button>
            <Logo size="sm" />
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                <XCircle size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Avatar Section */}
        <div className="empty-state-fade-in mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sphere-500/30 to-indigo-500/30 blur-2xl" />
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-white/[0.08] shadow-xl shadow-sphere-500/10"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sphere-500/40 to-indigo-500/40 text-4xl font-bold text-white ring-2 ring-white/[0.08] shadow-xl shadow-sphere-500/10">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sphere-500 text-white shadow-lg shadow-sphere-500/30 transition-all duration-200 hover:bg-sphere-400 active:scale-95 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Camera size={14} />
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-white">
            {displayName}
          </h1>
          {profile?.full_name && (
            <p className="text-sm text-white/40">@{profile.username}</p>
          )}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400/80 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>

        {/* Success / Error Messages */}
        {saveSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 empty-state-fade-in">
            <CheckCircle2 size={16} />
            Profile updated successfully
          </div>
        )}
        {saveError && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 empty-state-fade-in">
            <XCircle size={16} />
            {saveError}
          </div>
        )}

        {/* Profile Details Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {/* Info Section */}
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Personal Information
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {/* Full Name */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <User size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Full Name
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-0.5 focus:border-sphere-400/40 transition-colors"
                  />
                ) : (
                  <p className="text-sm text-white/90">
                    {profile?.full_name || <span className="text-white/30 italic">Not set</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <AtSign size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Username
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-0.5 focus:border-sphere-400/40 transition-colors"
                  />
                ) : (
                  <p className="text-sm text-white/90">@{profile?.username}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <Mail size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Email
                </p>
                <p className="text-sm text-white/90">{user?.email || 'Unknown'}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  <CheckCircle2 size={10} />
                  Verified
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0 mt-0.5">
                <Edit3 size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Bio
                </p>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full resize-none bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-1 focus:border-sphere-400/40 transition-colors"
                  />
                ) : (
                  <p className="text-sm text-white/90 leading-relaxed">
                    {profile?.bio || <span className="text-white/30 italic">No bio yet</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <Phone size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Phone
                </p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-0.5 focus:border-sphere-400/40 transition-colors"
                  />
                ) : (
                  <p className="text-sm text-white/90">
                    {profile?.phone_number || <span className="text-white/30 italic">Not set</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <Globe size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Website
                </p>
                {isEditing ? (
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-0.5 focus:border-sphere-400/40 transition-colors"
                  />
                ) : (
                  <p className="text-sm text-white/90">
                    {profile?.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sphere-400 hover:text-sphere-300 underline underline-offset-2 decoration-sphere-400/30 transition-colors"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <span className="text-white/30 italic">Not set</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                <MapPin size={16} className="text-sphere-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                  Country
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-0.5 focus:border-sphere-400/40 transition-colors"
                  />
                ) : (
                  <p className="text-sm text-white/90">
                    {profile?.country || <span className="text-white/30 italic">Not set</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="border-t border-white/[0.06]">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                Account
              </h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {/* Member since */}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                  <Calendar size={16} className="text-sphere-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                    Member Since
                  </p>
                  <p className="text-sm text-white/90">{memberSince}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                  <Shield size={16} className="text-sphere-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">
                    Role
                  </p>
                  <p className="text-sm text-white/90 capitalize">
                    {profile?.role || 'User'}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center rounded-full bg-sphere-500/10 px-2.5 py-0.5 text-[10px] font-medium text-sphere-300 capitalize">
                    {profile?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="mt-8 text-center">
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-5 py-2.5 text-sm text-white/50 transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 active:scale-95"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

