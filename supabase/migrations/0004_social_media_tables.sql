-- =========================================================
-- ChatSphere AI — Migration 0004: Groups, channels, status,
-- calls, media, notifications, AI & settings tables
-- =========================================================

-- ---------- groups (extends a 'group'-type conversation with metadata) ----------
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique references conversations(id) on delete cascade,
  name text not null,
  description text,
  avatar_url text,
  invite_code text unique default encode(gen_random_bytes(6), 'hex'),
  invite_enabled boolean not null default true,
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_groups_updated_at before update on groups
  for each row execute function set_updated_at();

-- ---------- group_members (mirrors conversation_members but scoped to explicit group roles/permissions) ----------
create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role member_role not null default 'member',
  can_send_messages boolean not null default true,
  can_add_members boolean not null default false,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_group_member unique (group_id, user_id)
);
create index if not exists idx_group_members_user on group_members(user_id);
create trigger trg_group_members_updated_at before update on group_members
  for each row execute function set_updated_at();

-- ---------- group_invites ----------
create table if not exists group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  invited_by uuid not null references profiles(id) on delete cascade,
  invited_user_id uuid references profiles(id) on delete cascade,
  code text unique default encode(gen_random_bytes(6), 'hex'),
  status friend_request_status not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_group_invites_group on group_invites(group_id);
create trigger trg_group_invites_updated_at before update on group_invites
  for each row execute function set_updated_at();

-- ---------- channels (broadcast, unlimited subscribers) ----------
create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text not null unique,
  description text,
  avatar_url text,
  is_verified boolean not null default false,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint handle_format check (handle ~ '^[a-z0-9_]{3,32}$')
);
create index if not exists idx_channels_handle_trgm on channels using gin (handle gin_trgm_ops);
create trigger trg_channels_updated_at before update on channels
  for each row execute function set_updated_at();

-- ---------- channel_members (subscribers) ----------
create table if not exists channel_members (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references channels(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role member_role not null default 'member', -- 'admin' = channel editor
  notifications_enabled boolean not null default true,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_channel_member unique (channel_id, user_id)
);
create index if not exists idx_channel_members_user on channel_members(user_id);
create trigger trg_channel_members_updated_at before update on channel_members
  for each row execute function set_updated_at();

-- ---------- status_updates (stories) ----------
create table if not exists status_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null default 'text', -- 'text' | 'image' | 'video' | 'music'
  content text,
  media_url text,
  background_color text,
  privacy text not null default 'contacts', -- 'everyone' | 'contacts' | 'except' | 'only'
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_status_updates_user on status_updates(user_id);
create index if not exists idx_status_updates_expiry on status_updates(expires_at);
create trigger trg_status_updates_updated_at before update on status_updates
  for each row execute function set_updated_at();

-- ---------- status_views ----------
create table if not exists status_views (
  id uuid primary key default gen_random_uuid(),
  status_id uuid not null references status_updates(id) on delete cascade,
  viewer_id uuid not null references profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  constraint unique_status_view unique (status_id, viewer_id)
);
create index if not exists idx_status_views_status on status_views(status_id);

-- ---------- calls ----------
create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete set null,
  initiated_by uuid not null references profiles(id) on delete cascade,
  type call_type not null default 'voice',
  status call_status not null default 'ringing',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calls_conversation on calls(conversation_id);
create trigger trg_calls_updated_at before update on calls
  for each row execute function set_updated_at();

-- ---------- call_participants ----------
create table if not exists call_participants (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references calls(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz,
  left_at timestamptz,
  is_muted boolean not null default false,
  is_camera_on boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_call_participant unique (call_id, user_id)
);
create trigger trg_call_participants_updated_at before update on call_participants
  for each row execute function set_updated_at();

-- ---------- media_files ----------
create table if not exists media_files (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid not null references profiles(id) on delete cascade,
  message_id uuid references messages(id) on delete cascade,
  bucket text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  duration_seconds numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_media_files_uploader on media_files(uploader_id);
create index if not exists idx_media_files_message on media_files(message_id);
create trigger trg_media_files_updated_at before update on media_files
  for each row execute function set_updated_at();

-- ---------- notifications ----------
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  type notification_type not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_notifications_user_unread on notifications(user_id, is_read, created_at desc);
create trigger trg_notifications_updated_at before update on notifications
  for each row execute function set_updated_at();

-- ---------- tasks (AI-extracted action items) ----------
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  source_message_id uuid references messages(id) on delete set null,
  title text not null,
  description text,
  is_completed boolean not null default false,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tasks_user on tasks(user_id, is_completed);
create trigger trg_tasks_updated_at before update on tasks
  for each row execute function set_updated_at();

-- ---------- ai_history ----------
create table if not exists ai_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  feature text not null, -- 'smart_reply' | 'summary' | 'translation' | 'grammar' | 'ocr' | 'assistant' | ...
  prompt text,
  response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ai_history_user on ai_history(user_id, created_at desc);
create trigger trg_ai_history_updated_at before update on ai_history
  for each row execute function set_updated_at();

-- ---------- search_history ----------
create table if not exists search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  query text not null,
  scope text not null default 'all', -- 'all' | 'users' | 'messages' | 'groups' | 'channels' | 'media'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_search_history_user on search_history(user_id, created_at desc);
create trigger trg_search_history_updated_at before update on search_history
  for each row execute function set_updated_at();

-- ---------- settings ----------
create table if not exists settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  notifications jsonb not null default '{"messages": true, "groups": true, "calls": true, "mentions": true}'::jsonb,
  privacy jsonb not null default '{"last_seen": "everyone", "read_receipts": true, "profile_photo": "everyone", "status": "contacts"}'::jsonb,
  chat jsonb not null default '{"enter_to_send": true, "media_auto_download": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_settings_updated_at before update on settings
  for each row execute function set_updated_at();

-- ---------- theme_preferences ----------
create table if not exists theme_preferences (
  user_id uuid primary key references profiles(id) on delete cascade,
  mode text not null default 'dark', -- 'light' | 'dark' | 'system'
  accent_color text not null default '#6D5DF6',
  font_scale numeric not null default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_theme_preferences_updated_at before update on theme_preferences
  for each row execute function set_updated_at();

-- Seed settings/theme rows automatically alongside profile creation.
create or replace function handle_new_profile_defaults()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.settings (user_id) values (new.id) on conflict do nothing;
  insert into public.theme_preferences (user_id) values (new.id) on conflict do nothing;
  insert into public.user_presence (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
  after insert on profiles
  for each row execute function handle_new_profile_defaults();
