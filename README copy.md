# ChatSphere AI

A next-generation AI-powered real-time messaging platform. This repo is
**Phase 1** of the build: project foundation, complete database schema with
Row Level Security, and a fully working Supabase Auth flow (email/password,
Google, GitHub, magic link, password reset). The chat UI, groups/channels,
calling, and AI features are built on top of this in later phases.

## Why phased delivery

The full spec (real-time chat, groups, channels, stories, WebRTC calling,
Gemini AI features, 30+ database tables, full RLS, PWA, testing, deployment)
is a multi-month build for a team. Shipping it as one giant code drop would
mean handing you thousands of lines nobody has verified. Instead this repo
gives you a real, working slice — auth + schema — that the rest of the app
plugs into safely.

**Roadmap:**
1. ✅ Foundation, database schema, RLS, Auth (this repo)
2. Core 1:1 messaging (realtime messages, typing, presence, read receipts, reactions)
3. Groups & channels
4. Media, status/stories, WebRTC calling
5. AI features (Gemini): smart replies, summaries, translation, OCR, transcription
6. PWA polish, performance pass, tests, deployment

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP,
  React Router, React Hook Form, TanStack Query, Zustand, React Virtuoso, PWA
- **Backend:** Supabase (Postgres, Auth, RLS, Storage, Realtime, Edge Functions)
- **AI:** Google Gemini API
- **Calling:** WebRTC (added in Phase 4)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then grab your
Project URL and anon key from **Project Settings → API**.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `VITE_GEMINI_API_KEY`
isn't needed until Phase 5.

### 4. Run the database migrations

Using the Supabase CLI (recommended):

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or paste each file in `supabase/migrations/` (in numeric order) into the
Supabase Dashboard's SQL Editor, followed by `supabase/storage/buckets_and_policies.sql`.

Migration order matters:
1. `0001_extensions_and_types.sql` — extensions, enums, shared trigger fn
2. `0002_core_tables.sql` — profiles, devices, sessions, presence, friend
   requests, blocked users, conversations, conversation members, RLS helper fns
3. `0003_messaging_tables.sql` — messages, reactions, receipts, typing,
   pins, stars, saves, reports
4. `0004_social_media_tables.sql` — groups, channels, status/stories, calls,
   media, notifications, tasks, AI history, search history, settings, theme
5. `0005_rls_policies.sql` — RLS enablement + policies for every table
6. `supabase/storage/buckets_and_policies.sql` — storage buckets + policies

### 5. Configure Supabase Auth providers

In **Authentication → Providers**:
- Enable **Email** (with "Confirm email" on for verification)
- Enable **Google** and **GitHub** OAuth (add your client ID/secret from
  each provider's developer console)
- Set **Site URL** and **Redirect URLs** to include
  `http://localhost:5173/auth/callback` (dev) and your production domain

### 6. Run the app

```bash
npm run dev
```

Visit `http://localhost:5173`. Try signing up — you should get a
verification email, land in `profiles` automatically (via the
`handle_new_user` trigger), and get redirected into the app after email
confirmation.

## Database schema overview

33 tables, organized into five domains:

| Domain | Tables |
|---|---|
| Identity & sessions | `profiles`, `devices`, `sessions`, `user_presence` |
| Social graph | `friend_requests`, `blocked_users` |
| Conversations & messaging | `conversations`, `conversation_members`, `messages`, `message_reactions`, `read_receipts`, `typing_status`, `pinned_messages`, `starred_messages`, `saved_messages`, `reported_messages`, `reported_users` |
| Groups & channels | `groups`, `group_members`, `group_invites`, `channels`, `channel_members` |
| Status, calls & media | `status_updates`, `status_views`, `calls`, `call_participants`, `media_files` |
| Notifications, AI & prefs | `notifications`, `tasks`, `ai_history`, `search_history`, `settings`, `theme_preferences` |

**Design notes:**
- Every table has `id` (uuid), `created_at`, `updated_at` (auto-maintained via
  a shared `set_updated_at()` trigger).
- `conversations` is the single source of truth for both direct chats and
  group chats (`type = 'direct' | 'group'`); `groups` extends a group-type
  conversation with group-specific metadata (invite codes, description).
  `channels` are a separate broadcast primitive (unbounded subscribers, not
  tied to `conversations`).
- A trigger on `auth.users` (`handle_new_user`) auto-creates the matching
  `profiles` row on sign-up; a second trigger on `profiles`
  (`handle_new_profile_defaults`) seeds `settings`, `theme_preferences`, and
  `user_presence` rows.
- RLS helper functions — `is_admin()`, `is_moderator_or_above()`,
  `is_conversation_member(id)` — are `security definer` functions used across
  nearly every policy to avoid duplicating role/membership logic.

### Roles

Role lives on `profiles.role` (`user` | `moderator` | `admin`):
- **user** — read own chats, send messages, upload files, manage own profile
- **moderator** — everything a user can do, plus delete inappropriate
  messages, remove group members, manage reports
- **admin** — full system access (users, storage, analytics, settings)

### ER diagram (high level)

```
auth.users ──1:1── profiles ──1:1── settings
                       │      ├─1:1── theme_preferences
                       │      └─1:1── user_presence
                       │
        ┌──────────────┼───────────────────────────┐
        │              │                            │
  conversations   friend_requests / blocked_users   channels
        │                                              │
  conversation_members                          channel_members
        │
     messages ──┬── message_reactions
                 ├── read_receipts
                 ├── pinned/starred/saved_messages
                 ├── reported_messages
                 └── media_files

  conversations (type='group') ──1:1── groups ── group_members / group_invites
  conversations ── calls ── call_participants
```

## Security

- **RLS everywhere.** Every table has row-level security enabled with
  explicit policies — no table is left open by default.
- **Storage policies** scope private buckets to `<uploader_id>/...` paths so
  users can only write into their own folder; admins get override access.
- **Auth** is entirely Supabase-managed (JWT, refresh tokens, session
  storage) — no custom password handling in this codebase.
- Client-side Zod/react-hook-form validation is a UX nicety only; the real
  boundary is Postgres constraints + RLS.

## Project structure

```
src/
  components/       shared/reusable UI components (built out in Phase 2+)
  pages/            top-level routed pages
  features/
    auth/           login, signup, magic link, password reset, OAuth
  hooks/            useAuth, etc.
  services/         thin wrappers around Supabase calls (auth.service.ts, ...)
  lib/              supabase client
  ai/               Gemini integration (Phase 5)
  context/          AuthProvider (session bootstrap + listener)
  store/            Zustand stores
  routes/           ProtectedRoute, AppRoutes
  types/            database.types.ts (typed schema)
supabase/
  migrations/       numbered SQL migrations (run in order)
  storage/           storage bucket + policy definitions
```

## Deployment

- **Frontend:** deploy to Vercel — `vercel --prod`, with the same
  `VITE_*` env vars set in the Vercel dashboard.
- **Backend:** Supabase is already hosted; just make sure migrations have
  been pushed to your production project (`supabase db push` against the
  linked prod project, or a separate prod project + linked migrations).
- Set your production domain in Supabase **Auth → URL Configuration** so
  OAuth/magic-link/reset redirects work outside localhost.

## What's not in this repo yet

Per the roadmap above: the actual chat UI (message list, composer, emoji/GIF
picker, virtualized scroll), groups/channels UI, status/stories, WebRTC
calling, Gemini AI features, push notifications, and automated tests. Say
the word and we'll build the next phase on top of this foundation.
