-- =========================================================
-- ChatSphere AI — Migration 0001: Extensions & Enum Types
-- =========================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm"; -- fuzzy/full-text search support

-- ---------- Enum types ----------
do $$ begin
  create type user_role as enum ('user', 'moderator', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type presence_status as enum ('online', 'offline', 'away', 'busy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type conversation_type as enum ('direct', 'group');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_role as enum ('member', 'moderator', 'admin', 'owner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_type as enum ('text', 'image', 'video', 'audio', 'document', 'sticker', 'gif', 'system', 'call');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_status as enum ('sent', 'delivered', 'read');
exception when duplicate_object then null; end $$;

do $$ begin
  create type friend_request_status as enum ('pending', 'accepted', 'declined', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type call_type as enum ('voice', 'video');
exception when duplicate_object then null; end $$;

do $$ begin
  create type call_status as enum ('ringing', 'ongoing', 'ended', 'missed', 'declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_type as enum (
    'message', 'mention', 'reaction', 'friend_request', 'group_invite',
    'call', 'status', 'system'
  );
exception when duplicate_object then null; end $$;

-- ---------- Shared trigger: keep updated_at current ----------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
