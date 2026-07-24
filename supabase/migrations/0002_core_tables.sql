-- =========================================================
-- ChatSphere AI — Migration 0002: Core identity & conversation tables
-- =========================================================

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  avatar_url text,
  cover_url text,
  bio text,
  phone_number text,
  email text not null unique,
  website text,
  birthday date,
  country text,
  language text not null default 'en',
  role user_role not null default 'user',
  custom_status text,
  is_online boolean not null default false,
  last_seen timestamptz,
  privacy_settings jsonb not null default '{"last_seen": "everyone", "read_receipts": true, "profile_photo": "everyone"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-zA-Z0-9_.]{3,32}$')
);
create index if not exists idx_profiles_username_trgm on profiles using gin (username gin_trgm_ops);
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row whenever a new auth user is created.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)),
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- devices ----------
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  device_name text,
  device_type text, -- 'web' | 'ios' | 'android' | 'desktop'
  push_token text,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_devices_user on devices(user_id);
create trigger trg_devices_updated_at before update on devices
  for each row execute function set_updated_at();

-- ---------- sessions (app-level device/session metadata; Supabase Auth owns real tokens) ----------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  device_id uuid references devices(id) on delete set null,
  ip_address inet,
  user_agent text,
  is_revoked boolean not null default false,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_sessions_user on sessions(user_id);
create trigger trg_sessions_updated_at before update on sessions
  for each row execute function set_updated_at();

-- ---------- user_presence ----------
create table if not exists user_presence (
  user_id uuid primary key references profiles(id) on delete cascade,
  status presence_status not null default 'offline',
  last_changed_at timestamptz not null default now()
);

-- ---------- friend_requests ----------
create table if not exists friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  status friend_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_request check (sender_id <> receiver_id),
  constraint unique_pending_pair unique (sender_id, receiver_id)
);
create index if not exists idx_friend_requests_receiver on friend_requests(receiver_id, status);
create trigger trg_friend_requests_updated_at before update on friend_requests
  for each row execute function set_updated_at();

-- ---------- blocked_users ----------
create table if not exists blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_block check (blocker_id <> blocked_id),
  constraint unique_block_pair unique (blocker_id, blocked_id)
);
create index if not exists idx_blocked_users_blocker on blocked_users(blocker_id);

-- ---------- conversations ----------
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  type conversation_type not null default 'direct',
  title text,
  avatar_url text,
  created_by uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_conversations_last_message on conversations(last_message_at desc);
create trigger trg_conversations_updated_at before update on conversations
  for each row execute function set_updated_at();

-- ---------- conversation_members ----------
create table if not exists conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role member_role not null default 'member',
  is_pinned boolean not null default false,
  is_archived boolean not null default false,
  is_muted boolean not null default false,
  last_read_message_id uuid,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_conversation_member unique (conversation_id, user_id)
);
create index if not exists idx_conv_members_user on conversation_members(user_id);
create index if not exists idx_conv_members_conversation on conversation_members(conversation_id);
create trigger trg_conv_members_updated_at before update on conversation_members
  for each row execute function set_updated_at();

-- Helper functions used heavily by RLS policies below.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function is_moderator_or_above()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin')
  );
$$;

create or replace function is_conversation_member(target_conversation_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from conversation_members
    where conversation_id = target_conversation_id and user_id = auth.uid()
  );
$$;
