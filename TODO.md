# Phase 2 — Core 1:1 Messaging

## Step 1: Update types/database.types.ts
- Add missing table types: friend_requests, user_presence, message_reactions, read_receipts, typing_status, blocked_users

## Step 2: Create chatStore.ts
- Zustand store for conversations, active conversation, messages, unread counts

## Step 3: Create chat.service.ts
- API functions: fetchConversations, fetchMessages, sendMessage, addReaction, removeReaction, setTyping, markAsRead, createDirectConversation

## Step 4: Create realtime hooks
- useRealtimeMessages.ts — subscribe to message inserts/updates
- useTyping.ts — track & broadcast typing status
- useReadReceipts.ts — mark messages as read, subscribe to receipt updates

## Step 5: Create UI Components
- ChatLayout.tsx — split-pane layout
- ChatSidebar.tsx — conversation list
- ConversationItem.tsx — single sidebar item
- ChatWindow.tsx — main chat area (message list + composer)
- MessageList.tsx — virtualized message list
- MessageBubble.tsx — single message display
- MessageComposer.tsx — text input + send + emoji
- TypingIndicator.tsx — typing animation
- ReactionPicker.tsx — emoji reaction popover
- MessageReactions.tsx — inline reaction chips
- EmojiPickerWrapper.tsx — emoji picker component

## Step 6: Create ChatPage
- Wire everything together

## Step 7: Update routes & navigation
- AppRoutes.tsx — add /chat and /chat/:conversationId
- HomePage.tsx — redirect to /chat
- App.tsx — wrap with necessary providers if needed

## Step 8: Verify build
- Run `npm run build` and fix any issues

