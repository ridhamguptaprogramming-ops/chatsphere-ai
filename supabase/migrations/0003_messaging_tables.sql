-- =========================================================
-- ChatSphere AI — Migration 0003: Messaging tables
-- =========================================================

-- ---------- messages ----------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  type message_type not null default 'text',
  content text,
  metadata jsonb not null default '{}'::jsonb, -- ai translations, ocr text, transcription, etc.
  reply_to_id uuid references messages(id) on delete set null,
  forwarded_from_id uuid references messages(id) on delete set null,
  is_edited boolean not null default false,
  is_deleted boolean not null default false,
  deleted_for_everyone boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_or_media check (content is not null or type <> 'text')
);
create index if not exists idx_messages_conversation_created on messages(conversation_id, created_at desc);
create index if not exists idx_messages_sender on messages(sender_id);
create index if not exists idx_messages_content_trgm on messages using gin (content gin_trgm_ops);
create trigger trg_messages_updated_at before update on messages
  for each row execute function set_updated_at();

-- Keep conversations.last_message_at fresh for sidebar ordering.
create or replace function bump_conversation_last_message()
returns trigger
language plpgsql
as $$
begin
  update conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;
create trigger trg_bump_conversation_last_message
  after insert on messages
  for each row execute function bump_conversation_last_message();

-- ---------- message_reactions ----------
create table if not exists message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_reaction unique (message_id, user_id, emoji)
);
create index if not exists idx_reactions_message on message_reactions(message_id);

-- ---------- read_receipts ----------
create table if not exists read_receipts (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status delivery_status not null default 'delivered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_receipt unique (message_id, user_id)
);
create index if not exists idx_read_receipts_message on read_receipts(message_id);
create index if not exists idx_read_receipts_user on read_receipts(user_id);
create trigger trg_read_receipts_updated_at before update on read_receipts
  for each row execute function set_updated_at();

-- ---------- typing_status ----------
create table if not exists typing_status (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  is_typing boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint unique_typing unique (conversation_id, user_id)
);
create index if not exists idx_typing_conversation on typing_status(conversation_id);

-- ---------- pinned_messages ----------
create table if not exists pinned_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  message_id uuid not null references messages(id) on delete cascade,
  pinned_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_pin unique (conversation_id, message_id)
);

-- ---------- starred_messages ----------
create table if not exists starred_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  message_id uuid not null references messages(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_star unique (user_id, message_id)
);

-- ---------- saved_messages ----------
create table if not exists saved_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  message_id uuid not null references messages(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_saved unique (user_id, message_id)
);

-- ---------- reported_messages ----------
create table if not exists reported_messages (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  reported_by uuid not null references profiles(id) on delete cascade,
  reason text not null,
  status report_status not null default 'open',
  reviewed_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_reported_messages_status on reported_messages(status);
create trigger trg_reported_messages_updated_at before update on reported_messages
  for each row execute function set_updated_at();

-- ---------- reported_users ----------
create table if not exists reported_users (
  id uuid primary key default gen_random_uuid(),
  reported_user_id uuid not null references profiles(id) on delete cascade,
  reported_by uuid not null references profiles(id) on delete cascade,
  reason text not null,
  status report_status not null default 'open',
  reviewed_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_reported_users_status on reported_users(status);
create trigger trg_reported_users_updated_at before update on reported_users
  for each row execute function set_updated_at();
