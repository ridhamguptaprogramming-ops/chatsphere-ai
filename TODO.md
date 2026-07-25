# TODO - NewChatModal.tsx Refactor

## Steps

1. [x] Remove the `generateUUID()` helper function
2. [x] Replace conversation creation with `.select().single()` pattern from user's snippet
3. [x] Replace member insertions to use `conversation.id` instead of pre-generated `conversationId`
4. [x] Update references to use `conversation.id` for navigation
5. [x] Fix variable reference (`user.id` → `userId`)
6. [x] TypeScript compilation passes

