-- =========================================================
-- ChatSphere AI — Migration 0005: Row Level Security Policies
-- =========================================================
-- Roles: user (default), moderator, admin (stored on profiles.role).
-- Helper functions is_admin(), is_moderator_or_above(), is_conversation_member()
-- were created in 0002_core_tables.sql.

-- ---------- profiles ----------
alter table profiles enable row level security;

create policy "profiles_select_all_authenticated"
  on profiles for select
  to authenticated
  using (true); -- directory/search needs to see basic profile info

create policy "profiles_update_own_or_admin"
  on profiles for update
  to authenticated
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

create policy "profiles_insert_self"
  on profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_delete_admin_only"
  on profiles for delete
  to authenticated
  using (is_admin());

-- ---------- devices ----------
alter table devices enable row level security;

create policy "devices_owner_full_access"
  on devices for all
  to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());

-- ---------- sessions ----------
alter table sessions enable row level security;

create policy "sessions_owner_full_access"
  on sessions for all
  to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());

-- ---------- user_presence ----------
alter table user_presence enable row level security;

create policy "presence_select_all_authenticated"
  on user_presence for select
  to authenticated
  using (true);

create policy "presence_update_own"
  on user_presence for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "presence_insert_own"
  on user_presence for insert
  to authenticated
  with check (user_id = auth.uid());

-- ---------- friend_requests ----------
alter table friend_requests enable row level security;

create policy "friend_requests_select_participant"
  on friend_requests for select
  to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid() or is_admin());

create policy "friend_requests_insert_as_sender"
  on friend_requests for insert
  to authenticated
  with check (sender_id = auth.uid());

create policy "friend_requests_update_participant"
  on friend_requests for update
  to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid())
  with check (sender_id = auth.uid() or receiver_id = auth.uid());

create policy "friend_requests_delete_sender"
  on friend_requests for delete
  to authenticated
  using (sender_id = auth.uid() or is_admin());

-- ---------- blocked_users ----------
alter table blocked_users enable row level security;

create policy "blocked_users_owner_full_access"
  on blocked_users for all
  to authenticated
  using (blocker_id = auth.uid() or is_admin())
  with check (blocker_id = auth.uid());

-- ---------- conversations ----------
alter table conversations enable row level security;

create policy "conversations_select_member"
  on conversations for select
  to authenticated
  using (is_conversation_member(id) or is_admin());

create policy "conversations_insert_authenticated"
  on conversations for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "conversations_update_member"
  on conversations for update
  to authenticated
  using (is_conversation_member(id) or is_admin())
  with check (is_conversation_member(id) or is_admin());

create policy "conversations_delete_admin_or_creator"
  on conversations for delete
  to authenticated
  using (created_by = auth.uid() or is_admin());

-- ---------- conversation_members ----------
alter table conversation_members enable row level security;

create policy "conv_members_select_fellow_member"
  on conversation_members for select
  to authenticated
  using (is_conversation_member(conversation_id) or is_admin());

create policy "conv_members_insert_self_or_admin_member"
  on conversation_members for insert
  to authenticated
  with check (
    user_id = auth.uid()
    or is_conversation_member(conversation_id)
    or is_admin()
  );

create policy "conv_members_update_self_or_conv_admin"
  on conversation_members for update
  to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

create policy "conv_members_delete_self_or_admin"
  on conversation_members for delete
  to authenticated
  using (user_id = auth.uid() or is_admin());

-- ---------- messages ----------
alter table messages enable row level security;

create policy "messages_select_conversation_member"
  on messages for select
  to authenticated
  using (is_conversation_member(conversation_id) or is_admin());

create policy "messages_insert_conversation_member"
  on messages for insert
  to authenticated
  with check (sender_id = auth.uid() and is_conversation_member(conversation_id));

create policy "messages_update_own_within_window"
  on messages for update
  to authenticated
  using (sender_id = auth.uid() or is_moderator_or_above())
  with check (sender_id = auth.uid() or is_moderator_or_above());

create policy "messages_delete_own_or_moderator"
  on messages for delete
  to authenticated
  using (sender_id = auth.uid() or is_moderator_or_above());

-- ---------- message_reactions ----------
alter table message_reactions enable row level security;

create policy "reactions_select_conversation_member"
  on message_reactions for select
  to authenticated
  using (
    exists (
      select 1 from messages m
      where m.id = message_reactions.message_id
        and (is_conversation_member(m.conversation_id) or is_admin())
    )
  );

create policy "reactions_insert_own"
  on message_reactions for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from messages m
      where m.id = message_reactions.message_id
        and is_conversation_member(m.conversation_id)
    )
  );

create policy "reactions_delete_own"
  on message_reactions for delete
  to authenticated
  using (user_id = auth.uid() or is_moderator_or_above());

-- ---------- read_receipts ----------
alter table read_receipts enable row level security;

create policy "receipts_select_conversation_member"
  on read_receipts for select
  to authenticated
  using (
    exists (
      select 1 from messages m
      where m.id = read_receipts.message_id
        and is_conversation_member(m.conversation_id)
    )
  );

create policy "receipts_upsert_own"
  on read_receipts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "receipts_update_own"
  on read_receipts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- typing_status ----------
alter table typing_status enable row level security;

create policy "typing_select_conversation_member"
  on typing_status for select
  to authenticated
  using (is_conversation_member(conversation_id));

create policy "typing_upsert_own"
  on typing_status for insert
  to authenticated
  with check (user_id = auth.uid() and is_conversation_member(conversation_id));

create policy "typing_update_own"
  on typing_status for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "typing_delete_own"
  on typing_status for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------- pinned_messages / starred_messages / saved_messages ----------
alter table pinned_messages enable row level security;

create policy "pinned_select_conversation_member"
  on pinned_messages for select
  to authenticated
  using (is_conversation_member(conversation_id));

create policy "pinned_insert_conversation_member"
  on pinned_messages for insert
  to authenticated
  with check (pinned_by = auth.uid() and is_conversation_member(conversation_id));

create policy "pinned_delete_conversation_member"
  on pinned_messages for delete
  to authenticated
  using (is_conversation_member(conversation_id) or is_moderator_or_above());

alter table starred_messages enable row level security;

create policy "starred_owner_full_access"
  on starred_messages for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table saved_messages enable row level security;

create policy "saved_owner_full_access"
  on saved_messages for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- reported_messages / reported_users ----------
alter table reported_messages enable row level security;

create policy "reported_messages_insert_any_authenticated"
  on reported_messages for insert
  to authenticated
  with check (reported_by = auth.uid());

create policy "reported_messages_select_own_or_moderator"
  on reported_messages for select
  to authenticated
  using (reported_by = auth.uid() or is_moderator_or_above());

create policy "reported_messages_update_moderator"
  on reported_messages for update
  to authenticated
  using (is_moderator_or_above())
  with check (is_moderator_or_above());

alter table reported_users enable row level security;

create policy "reported_users_insert_any_authenticated"
  on reported_users for insert
  to authenticated
  with check (reported_by = auth.uid());

create policy "reported_users_select_own_or_moderator"
  on reported_users for select
  to authenticated
  using (reported_by = auth.uid() or is_moderator_or_above());

create policy "reported_users_update_moderator"
  on reported_users for update
  to authenticated
  using (is_moderator_or_above())
  with check (is_moderator_or_above());

-- ---------- groups ----------
alter table groups enable row level security;

create policy "groups_select_member"
  on groups for select
  to authenticated
  using (is_conversation_member(conversation_id) or is_admin());

create policy "groups_insert_creator"
  on groups for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "groups_update_group_admin"
  on groups for update
  to authenticated
  using (
    exists (
      select 1 from group_members gm
      where gm.group_id = groups.id and gm.user_id = auth.uid() and gm.role in ('admin', 'owner')
    ) or is_admin()
  )
  with check (true);

create policy "groups_delete_owner_or_admin"
  on groups for delete
  to authenticated
  using (created_by = auth.uid() or is_admin());

-- ---------- group_members ----------
alter table group_members enable row level security;

create policy "group_members_select_fellow_member"
  on group_members for select
  to authenticated
  using (
    exists (select 1 from group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid())
    or is_admin()
  );

create policy "group_members_insert_self_or_admin"
  on group_members for insert
  to authenticated
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid()
        and (gm.role in ('admin', 'owner') or gm.can_add_members)
    )
    or is_admin()
  );

create policy "group_members_update_self_or_group_admin"
  on group_members for update
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid() and gm.role in ('admin', 'owner')
    )
    or is_moderator_or_above()
  )
  with check (true);

create policy "group_members_delete_self_or_group_admin"
  on group_members for delete
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid() and gm.role in ('admin', 'owner')
    )
    or is_moderator_or_above()
  );

-- ---------- group_invites ----------
alter table group_invites enable row level security;

create policy "group_invites_select_involved"
  on group_invites for select
  to authenticated
  using (
    invited_by = auth.uid()
    or invited_user_id = auth.uid()
    or exists (select 1 from group_members gm where gm.group_id = group_invites.group_id and gm.user_id = auth.uid())
    or is_admin()
  );

create policy "group_invites_insert_group_member"
  on group_invites for insert
  to authenticated
  with check (
    invited_by = auth.uid()
    and exists (select 1 from group_members gm where gm.group_id = group_invites.group_id and gm.user_id = auth.uid())
  );

create policy "group_invites_update_involved"
  on group_invites for update
  to authenticated
  using (invited_by = auth.uid() or invited_user_id = auth.uid() or is_moderator_or_above())
  with check (true);

-- ---------- channels ----------
alter table channels enable row level security;

create policy "channels_select_all_authenticated"
  on channels for select
  to authenticated
  using (true);

create policy "channels_insert_authenticated"
  on channels for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "channels_update_owner_or_editor"
  on channels for update
  to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from channel_members cm
      where cm.channel_id = channels.id and cm.user_id = auth.uid() and cm.role in ('admin', 'owner')
    )
    or is_admin()
  )
  with check (true);

create policy "channels_delete_owner"
  on channels for delete
  to authenticated
  using (owner_id = auth.uid() or is_admin());

-- ---------- channel_members ----------
alter table channel_members enable row level security;

create policy "channel_members_select_all_authenticated"
  on channel_members for select
  to authenticated
  using (true); -- subscriber counts/lists are public-ish, like real broadcast channels

create policy "channel_members_insert_self"
  on channel_members for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "channel_members_update_self_or_owner"
  on channel_members for update
  to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from channels c where c.id = channel_members.channel_id and c.owner_id = auth.uid())
  )
  with check (true);

create policy "channel_members_delete_self_or_owner"
  on channel_members for delete
  to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from channels c where c.id = channel_members.channel_id and c.owner_id = auth.uid())
    or is_moderator_or_above()
  );

-- ---------- status_updates ----------
alter table status_updates enable row level security;

create policy "status_select_not_blocked"
  on status_updates for select
  to authenticated
  using (
    (expires_at > now())
    and not exists (
      select 1 from blocked_users b
      where (b.blocker_id = status_updates.user_id and b.blocked_id = auth.uid())
         or (b.blocker_id = auth.uid() and b.blocked_id = status_updates.user_id)
    )
    or user_id = auth.uid()
    or is_admin()
  );

create policy "status_insert_own"
  on status_updates for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "status_update_own"
  on status_updates for update
  to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

create policy "status_delete_own_or_moderator"
  on status_updates for delete
  to authenticated
  using (user_id = auth.uid() or is_moderator_or_above());

-- ---------- status_views ----------
alter table status_views enable row level security;

create policy "status_views_select_owner_or_viewer"
  on status_views for select
  to authenticated
  using (
    viewer_id = auth.uid()
    or exists (select 1 from status_updates s where s.id = status_views.status_id and s.user_id = auth.uid())
    or is_admin()
  );

create policy "status_views_insert_self"
  on status_views for insert
  to authenticated
  with check (viewer_id = auth.uid());

-- ---------- calls ----------
alter table calls enable row level security;

create policy "calls_select_participant"
  on calls for select
  to authenticated
  using (
    initiated_by = auth.uid()
    or exists (select 1 from call_participants cp where cp.call_id = calls.id and cp.user_id = auth.uid())
    or is_admin()
  );

create policy "calls_insert_initiator"
  on calls for insert
  to authenticated
  with check (initiated_by = auth.uid());

create policy "calls_update_participant"
  on calls for update
  to authenticated
  using (
    initiated_by = auth.uid()
    or exists (select 1 from call_participants cp where cp.call_id = calls.id and cp.user_id = auth.uid())
  )
  with check (true);

-- ---------- call_participants ----------
alter table call_participants enable row level security;

create policy "call_participants_select_fellow_participant"
  on call_participants for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from call_participants cp where cp.call_id = call_participants.call_id and cp.user_id = auth.uid())
    or is_admin()
  );

create policy "call_participants_insert_self_or_initiator"
  on call_participants for insert
  to authenticated
  with check (
    user_id = auth.uid()
    or exists (select 1 from calls c where c.id = call_participants.call_id and c.initiated_by = auth.uid())
  );

create policy "call_participants_update_self"
  on call_participants for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- media_files ----------
alter table media_files enable row level security;

create policy "media_select_uploader_or_conversation_member"
  on media_files for select
  to authenticated
  using (
    uploader_id = auth.uid()
    or (
      message_id is not null
      and exists (
        select 1 from messages m
        where m.id = media_files.message_id and is_conversation_member(m.conversation_id)
      )
    )
    or is_admin()
  );

create policy "media_insert_own"
  on media_files for insert
  to authenticated
  with check (uploader_id = auth.uid());

create policy "media_delete_own_or_moderator"
  on media_files for delete
  to authenticated
  using (uploader_id = auth.uid() or is_moderator_or_above());

-- ---------- notifications ----------
alter table notifications enable row level security;

create policy "notifications_owner_full_access"
  on notifications for all
  to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- ---------- tasks ----------
alter table tasks enable row level security;

create policy "tasks_owner_full_access"
  on tasks for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- ai_history ----------
alter table ai_history enable row level security;

create policy "ai_history_owner_full_access"
  on ai_history for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- search_history ----------
alter table search_history enable row level security;

create policy "search_history_owner_full_access"
  on search_history for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- settings ----------
alter table settings enable row level security;

create policy "settings_owner_full_access"
  on settings for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- theme_preferences ----------
alter table theme_preferences enable row level security;

create policy "theme_preferences_owner_full_access"
  on theme_preferences for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
