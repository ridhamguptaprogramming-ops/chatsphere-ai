-- =========================================================
-- ChatSphere AI — Storage buckets & policies
-- Run this against your Supabase project (SQL editor or CLI).
-- Convention: files are stored under `<user_id>/...` so RLS can
-- check `storage.foldername(name)[1] = auth.uid()::text`.
-- =========================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',        'avatars',        true,  5242880,   array['image/png','image/jpeg','image/webp','image/gif']),
  ('profile-covers',  'profile-covers', true,  8388608,   array['image/png','image/jpeg','image/webp']),
  ('chat-media',      'chat-media',     false, 52428800,  array['image/png','image/jpeg','image/webp','image/gif']),
  ('images',          'images',        false, 20971520,  array['image/png','image/jpeg','image/webp','image/gif']),
  ('videos',          'videos',        false, 209715200, array['video/mp4','video/webm','video/quicktime']),
  ('voice-notes',     'voice-notes',   false, 20971520,  array['audio/mpeg','audio/webm','audio/ogg','audio/mp4']),
  ('documents',       'documents',     false, 52428800,  null),
  ('stickers',        'stickers',      true,  2097152,   array['image/png','image/webp']),
  ('status-media',    'status-media',  false, 52428800,  array['image/png','image/jpeg','image/webp','video/mp4']),
  ('temporary-files',  'temporary-files', false, 52428800, null)
on conflict (id) do nothing;

-- Helper: first path segment must equal the caller's uid, e.g. "<uid>/avatar.png".
-- Applies to all private, user-scoped buckets below.

-- ---------- avatars (public read, owner write) ----------
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_owner_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_owner_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_owner_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- profile-covers (public read, owner write) ----------
create policy "covers_public_read"
  on storage.objects for select
  using (bucket_id = 'profile-covers');

create policy "covers_owner_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'profile-covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "covers_owner_modify"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'profile-covers' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'profile-covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "covers_owner_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'profile-covers' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- stickers (public read, admin write) ----------
create policy "stickers_public_read"
  on storage.objects for select
  using (bucket_id = 'stickers');

create policy "stickers_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'stickers' and is_admin());

-- ---------- private, per-user buckets: chat-media, images, videos,
-- voice-notes, documents, status-media, temporary-files ----------
-- Read is allowed for the uploader; broader "conversation member" access
-- for chat attachments is brokered through signed URLs generated after a
-- media_files row lookup (see media.service.ts in the chat phase), so the
-- storage policy itself only needs to trust the uploader + admins.

do $$
declare
  bucket text;
begin
  foreach bucket in array array['chat-media','images','videos','voice-notes','documents','status-media','temporary-files']
  loop
    execute format($sql$
      create policy "%1$s_owner_read" on storage.objects for select to authenticated
        using (bucket_id = '%1$s' and ((storage.foldername(name))[1] = auth.uid()::text or is_admin()));
    $sql$, bucket);

    execute format($sql$
      create policy "%1$s_owner_write" on storage.objects for insert to authenticated
        with check (bucket_id = '%1$s' and (storage.foldername(name))[1] = auth.uid()::text);
    $sql$, bucket);

    execute format($sql$
      create policy "%1$s_owner_delete" on storage.objects for delete to authenticated
        using (bucket_id = '%1$s' and ((storage.foldername(name))[1] = auth.uid()::text or is_admin()));
    $sql$, bucket);
  end loop;
end $$;
