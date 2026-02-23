---
title: unpinAllForumTopicMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Clear all pinned messages in a Telegram forum topic using GramIO. TypeScript examples with message_thread_id, required admin rights, and forum topic management tips.
  - - meta
    - name: keywords
      content: unpinAllForumTopicMessages, telegram bot api, gramio unpinAllForumTopicMessages, unpin forum topic messages, message_thread_id, forum supergroup pinned messages, can_pin_messages, typescript unpinAllForumTopicMessages example, how to unpin forum topic messages telegram
---

# unpinAllForumTopicMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unpinallforumtopicmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the *can\_pin\_messages* administrator right in the supergroup. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread of the forum topic" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Clear all pinned messages in a specific forum topic by thread ID:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.unpinAllForumTopicMessages({
  chat_id: -1001234567890,
  message_thread_id: 42, // the topic's thread ID
});
```

Clear pins from within a forum topic message handler:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("clearpin", async (ctx) => {
  // ctx.threadId is the message_thread_id of the current forum topic
  if (!ctx.threadId) {
    return ctx.reply("This command must be used inside a forum topic.");
  }

  await bot.api.unpinAllForumTopicMessages({
    chat_id: ctx.chat.id,
    message_thread_id: ctx.threadId,
  });

  await ctx.send("All pinned messages in this topic have been cleared.");
});
```

Clear pins in a specific forum topic by username and known thread ID:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function clearTopicPins(
  supergroupUsername: string,
  topicThreadId: number
) {
  await bot.api.unpinAllForumTopicMessages({
    chat_id: `@${supergroupUsername}`,
    message_thread_id: topicThreadId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: message thread not found` | `message_thread_id` does not correspond to an existing forum topic |
| 400 | `Bad Request: method is available only for supergroups` | The target chat is not a forum supergroup — forum topics require forum mode enabled |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in the chat |
| 403 | `Forbidden: not enough rights to pin messages` | The bot is an admin but lacks `can_pin_messages` in the supergroup |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`message_thread_id` is the topic ID, not a regular message ID.** It's the ID of the first message that created the topic — you get it from `ForumTopicCreated` service message or from the message's `message_thread_id` field.
- **For the General topic, use `unpinAllGeneralForumTopicMessages`.** The General topic (thread ID `1`) has its own dedicated method because it behaves differently from custom topics.
- **Also works in private chats with topics.** As of Bot API 7.0 (Bot API December 2023), this method also clears pins inside a topic in a private chat where the user has enabled topics.
- **Bot needs `can_pin_messages` in supergroups.** In private chats, no special rights are required.
- **Messages are not deleted.** Clearing pins removes messages from the pinned list but does not delete them from the topic history.
- **Use `unpinChatMessage` to remove a single pin.** If you want to unpin only one message rather than all, pass `message_id` to `unpinChatMessage`.

## See Also

- [`unpinAllGeneralForumTopicMessages`](/telegram/methods/unpinAllGeneralForumTopicMessages) — Clear pins in the General forum topic specifically
- [`unpinAllChatMessages`](/telegram/methods/unpinAllChatMessages) — Clear all pins across an entire chat (not topic-scoped)
- [`unpinChatMessage`](/telegram/methods/unpinChatMessage) — Unpin a single specific message
- [`pinChatMessage`](/telegram/methods/pinChatMessage) — Pin a message in a chat or topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — Create a new forum topic
- [`deleteForumTopic`](/telegram/methods/deleteForumTopic) — Delete a forum topic and all its messages
- [`ForumTopic`](/telegram/types/ForumTopic) — Type representing a forum topic
