# ChatSphere AI - Bug Fix: "No name appears when searching"

## Issue
When searching conversations in the sidebar, some conversations don't display names properly because:
1. For direct conversations where `otherUser` is null/undefined (data inconsistency), the search filter produces empty string `''`
2. The `ConversationItem` display name also doesn't handle the missing `otherUser` case gracefully

## Root Cause Analysis
- In `ChatSidebar.tsx`, the search filter computes the name as: `c.otherUser?.full_name || c.otherUser?.username` for direct conversations
- If `otherUser` is undefined/null, this evaluates to `''`, making the conversation invisible in search results
- The same issue applies to the display name in `ConversationItem.tsx`

## Fix Plan
1. **ChatSidebar.tsx** - Add fallback display name in search filter for direct conversations without `otherUser`
2. **ConversationItem.tsx** - Add fallback display name for direct conversations without `otherUser`

