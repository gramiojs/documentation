---
title: deleteForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a forum topic and all its messages in a Telegram supergroup using GramIO. Irreversible — requires can_delete_messages. TypeScript examples for forum management.
  - - meta
    - name: keywords
      content: deleteForumTopic, telegram bot api, delete forum topic telegram, remove forum topic, gramio deleteForumTopic, telegram forum management bot, message_thread_id, can_delete_messages, supergroup forum topic typescript, delete all topic messages telegram
---

# deleteForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deleteforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the *can\_delete\_messages* administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread of the forum topic" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a forum topic and all its messages permanently
await bot.api.deleteForumTopic({
  chat_id: -1001234567890,
  message_thread_id: 123,
});
```

```ts
// Delete the current forum topic from within a message handler
bot.on("message", async (ctx) => {
  const threadId = ctx.update.message?.message_thread_id;
  if (threadId && ctx.text === "/deletetopic") {
    await bot.api.deleteForumTopic({
      chat_id: ctx.chatId,
      message_thread_id: threadId,
    });
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a temporary topic, use it, then clean up
const topic = await bot.api.createForumTopic({
  chat_id: -1001234567890,
  name: "Temporary Discussion",
});

// ... use the topic ...

await bot.api.deleteForumTopic({
  chat_id: -1001234567890,
  message_thread_id: topic.message_thread_id,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot cannot access the chat |
| 400 | `Bad Request: message thread not found` | `message_thread_id` doesn't exist or the topic was already deleted |
| 400 | `Bad Request: FORUM_DISABLED` | The target chat does not have forums enabled |
| 403 | `Forbidden: not enough rights` | Bot is not an admin or lacks `can_delete_messages` right in the supergroup |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **This is permanent and irreversible.** Unlike `closeForumTopic`, `deleteForumTopic` deletes the topic **and every message inside it**. There is no undo. If you only want to stop new messages, use `closeForumTopic` instead.
- **Requires `can_delete_messages`, not `can_manage_topics`.** Despite acting on a topic, the required right is for message deletion — not topic management. Ensure the bot has this specific right.
- **Works in private chats with topics enabled.** In addition to supergroups, this method can delete topics in private (DM) chats that have topics enabled.
- **`message_thread_id` equals the topic's creation message ID.** The ID comes from `ForumTopic.message_thread_id` as returned by `createForumTopic`, or from `ctx.messageThreadId` inside the topic.
- **Deleting a topic also removes it from unread counts.** Users will lose access to all messages in the topic immediately.

## See Also

- [createForumTopic](/telegram/methods/createForumTopic) — create a new forum topic
- [editForumTopic](/telegram/methods/editForumTopic) — rename or change the topic icon
- [closeForumTopic](/telegram/methods/closeForumTopic) — close a topic without deleting it
- [reopenForumTopic](/telegram/methods/reopenForumTopic) — reopen a closed topic
- [unpinAllForumTopicMessages](/telegram/methods/unpinAllForumTopicMessages) — unpin all messages in a topic
- [ForumTopic](/telegram/types/ForumTopic) — the forum topic object type
