---
title: reopenForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Reopen a closed forum topic in a supergroup using GramIO. TypeScript examples with context shorthand, error table, and tips for forum topic management in Telegram bots.
  - - meta
    - name: keywords
      content: reopenForumTopic, telegram bot api, reopen forum topic telegram, gramio reopenForumTopic, reopenForumTopic typescript, reopenForumTopic example, forum topic management, can_manage_topics, message_thread_id, chat_id, how to reopen forum topic telegram bot, supergroup forum
---

# reopenForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#reopenforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights, unless it is the creator of the topic. Returns *True* on success.

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
// Context shorthand — reopens the topic the current message belongs to
// (chat_id and message_thread_id are injected automatically from the context)
bot.on("forum_topic_closed", async (ctx) => {
  await ctx.reopenTopic();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call with explicit chat_id and message_thread_id
await bot.api.reopenForumTopic({
  chat_id: -1001234567890,
  message_thread_id: 42,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reopen a specific topic from a command with the thread ID as argument
bot.command("reopentopic", async (ctx) => {
  const threadId = Number(ctx.args);
  if (!threadId || isNaN(threadId)) return ctx.reply("Usage: /reopentopic <thread_id>");

  await bot.api.reopenForumTopic({
    chat_id: ctx.chat.id,
    message_thread_id: threadId,
  });
  await ctx.reply(`Topic ${threadId} has been reopened.`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Automatically reopen topics that were closed by a specific condition
bot.on("message", async (ctx) => {
  if (ctx.forumTopicClosed && ctx.chat.is_forum) {
    // ctx.messageThreadId holds the thread ID of the current message
    await ctx.reopenTopic();
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: message thread not found` | `message_thread_id` doesn't exist in the target chat |
| 400 | `Bad Request: TOPIC_NOT_MODIFIED` | The topic is already open — no state change needed |
| 400 | `Bad Request: method is available only for supergroups` | The target chat is not a supergroup with forum mode enabled |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_manage_topics` admin right and is not the topic creator |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Forum mode must be enabled.** This method only works in supergroups where the "Topics" (forum) feature is turned on. Calling it in a regular group returns an error.
- **`can_manage_topics` is required** unless the bot created the topic itself. Use [`promoteChatMember`](/telegram/methods/promoteChatMember) to grant this right if needed.
- **Context shorthand `ctx.reopenTopic()`** automatically fills `chat_id` and `message_thread_id` from the current message context, which is the cleanest way to reopen the topic a message was sent in.
- **Check topic state before calling.** Calling `reopenForumTopic` on an already-open topic returns `TOPIC_NOT_MODIFIED`. Use this call only when you know the topic is closed.
- **Does not automatically unhide.** Unlike `reopenGeneralForumTopic`, this method does not unhide the topic — use [`editForumTopic`](/telegram/methods/editForumTopic) if the topic also needs to be made visible.

## See Also

- [`closeForumTopic`](/telegram/methods/closeForumTopic) — close an open forum topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — create a new forum topic
- [`editForumTopic`](/telegram/methods/editForumTopic) — edit a forum topic's name and icon
- [`deleteForumTopic`](/telegram/methods/deleteForumTopic) — delete a forum topic and all its messages
- [`reopenGeneralForumTopic`](/telegram/methods/reopenGeneralForumTopic) — reopen the General topic specifically
