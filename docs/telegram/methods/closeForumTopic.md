---
title: closeForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Close an open forum topic in a Telegram supergroup using GramIO. Requires can_manage_topics admin right unless the bot created the topic. TypeScript examples included.
  - - meta
    - name: keywords
      content: closeForumTopic, telegram bot api, close forum topic telegram bot, gramio closeForumTopic, telegram supergroup forum, forum topic management, message_thread_id, can_manage_topics, closeForumTopic typescript, closeForumTopic example
---

# closeForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#closeforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights, unless it is the creator of the topic. Returns *True* on success.

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
// Close a forum topic by chat ID and thread ID
await bot.api.closeForumTopic({
  chat_id: "@mysupergroup",
  message_thread_id: 123,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Close the topic that triggered the current message
bot.on("message", async (ctx) => {
  if (ctx.threadId && ctx.chat?.type === "supergroup") {
    await bot.api.closeForumTopic({
      chat_id: ctx.chatId,
      message_thread_id: ctx.threadId,
    });

    await ctx.send("This topic has been closed.");
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Admin command to close a topic using a numeric ID from user input
bot.command("closetopic", async (ctx) => {
  const threadId = Number(ctx.args);

  if (!threadId) {
    return ctx.reply("Usage: /closetopic <thread_id>");
  }

  await bot.api.closeForumTopic({
    chat_id: ctx.chatId,
    message_thread_id: threadId,
  });

  await ctx.reply(`Topic ${threadId} has been closed.`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to the chat |
| 400 | `Bad Request: TOPIC_NOT_MODIFIED` | The topic is already closed — no action taken |
| 400 | `Bad Request: message thread not found` | `message_thread_id` does not exist in this chat |
| 403 | `Forbidden: not enough rights` | Bot is not an admin or lacks `can_manage_topics` right, and is not the topic creator |
| 400 | `Bad Request: supergroup required` | Forum topics only exist in supergroups with forum mode enabled |

## Tips & Gotchas

- **Forum mode must be enabled.** The chat must be a supergroup with forum mode active. Calling this on a regular group or channel returns an error.
- **Topic creator exemption.** The bot can close a topic it created without `can_manage_topics` admin rights. For topics created by others, the bot needs the right explicitly.
- **General topic uses a different method.** The 'General' topic cannot be closed with `closeForumTopic` — use [`closeGeneralForumTopic`](/telegram/methods/closeGeneralForumTopic) instead.
- **`message_thread_id` is the topic ID.** In GramIO contexts, access it via `ctx.threadId`. Messages sent to a topic carry this ID.
- **Closing doesn't delete the topic.** Users can still read the conversation; new messages simply cannot be posted. Use [`deleteForumTopic`](/telegram/methods/deleteForumTopic) to remove the topic entirely.

## See Also

- [`reopenForumTopic`](/telegram/methods/reopenForumTopic) — reopen a previously closed topic
- [`editForumTopic`](/telegram/methods/editForumTopic) — change the topic name or icon
- [`deleteForumTopic`](/telegram/methods/deleteForumTopic) — permanently delete a forum topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — create a new forum topic
- [`closeGeneralForumTopic`](/telegram/methods/closeGeneralForumTopic) — close the General topic specifically
- [`unpinAllForumTopicMessages`](/telegram/methods/unpinAllForumTopicMessages) — clear pinned messages from a topic
- [`ForumTopic`](/telegram/types/ForumTopic) — the ForumTopic type
