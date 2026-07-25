# ChatSphere AI - Bug Fix: "No name appears when searching"

## Issue
When searching conversations in the sidebar or searching for users in NewChatModal, names don't appear properly.

## Root Causes
1. **NewChatModal.tsx** - The Supabase `.or()` filter used `%` wildcard which doesn't work inside `.or()` strings (PostgREST expects `*`)
2. **ChatSidebar.tsx** - Search filter had no fallback when `otherUser` is null for direct conversations
3. **ConversationItem.tsx** - Display name had no fallback when `otherUser` is null
4. **ChatWindow.tsx** - Header display name had no fallback when `otherUser` is null

## Changes Made
1. ✅ **NewChatModal.tsx** - Fixed Supabase search query to use `*` wildcard instead of `%` inside `.or()` filter
2. ✅ **ChatSidebar.tsx** - Added fallback `'Unknown User'` when `otherUser` is null for direct conversations in search filter
3. ✅ **ConversationItem.tsx** - Added fallback `'Unknown User'` when `otherUser` is null for direct conversations
4. ✅ **ChatWindow.tsx** - Added fallback `'Unknown User'` when `otherUser` is null for direct conversations header

