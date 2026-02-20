---
title: reopenGeneralForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Reopen the General forum topic in a supergroup using GramIO. TypeScript examples with context shorthand, error table, and tips for General topic management in Telegram bots.
  - - meta
    - name: keywords
      content: reopenGeneralForumTopic, telegram bot api, reopen general forum topic telegram, gramio reopenGeneralForumTopic, reopenGeneralForumTopic typescript, reopenGeneralForumTopic example, general topic management, can_manage_topics, chat_id, how to reopen general topic telegram bot, supergroup forum, unhide general topic
---

# reopenGeneralForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#reopengeneralforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights. The topic will be automatically unhidden if it was hidden. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Context shorthand — reopens the General topic in the current chat
// (chat_id is injected automatically from the context)
bot.on("general_forum_topic_hidden", async (ctx) => {
  await ctx.reopenGeneralTopic();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call with explicit chat_id
await bot.api.reopenGeneralForumTopic({ chat_id: -1001234567890 });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reopen the General topic in the current chat via command
bot.command("opengeneraltopic", async (ctx) => {
  await bot.api.reopenGeneralForumTopic({ chat_id: ctx.chat.id });
  await ctx.reply("General topic has been reopened.");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reopen General topic by supergroup username
await bot.api.reopenGeneralForumTopic({ chat_id: "@mysupergroup" });
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: TOPIC_NOT_MODIFIED` | The General topic is already open — no state change needed |
| 400 | `Bad Request: method is available only for supergroups` | The target chat is not a supergroup with forum mode enabled |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_manage_topics` admin right — required without exception for the General topic |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Automatically unhides the topic.** Unlike `reopenForumTopic`, calling `reopenGeneralForumTopic` also unhides the General topic if it was previously hidden with [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic). You do not need to call `unhideGeneralForumTopic` separately.
- **`can_manage_topics` is always required.** Unlike regular forum topics where the bot can manage topics it created, the General topic always requires the `can_manage_topics` admin right — there is no creator exemption.
- **Forum mode must be enabled.** This method only works in supergroups where the "Topics" (forum) feature is turned on. Calling it on a regular group or channel returns an error.
- **Context shorthand `ctx.reopenGeneralTopic()`** automatically fills `chat_id` from the current message context — use it inside message/update handlers for cleaner code.
- **The General topic is special.** Unlike other topics it cannot be created or deleted — only opened, closed, hidden, and unhidden. Manage it with the dedicated `*GeneralForumTopic` methods.

## See Also

- [`closeGeneralForumTopic`](/telegram/methods/closeGeneralForumTopic) — close the General topic
- [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic) — hide the General topic from the topic list
- [`unhideGeneralForumTopic`](/telegram/methods/unhideGeneralForumTopic) — unhide the General topic without reopening
- [`reopenForumTopic`](/telegram/methods/reopenForumTopic) — reopen a regular (non-General) forum topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — create a new forum topic
