---
title: hideGeneralForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Hide the General topic in a Telegram forum supergroup using GramIO and TypeScript. Requires admin rights with can_manage_topics. Automatically closes the topic if open.
  - - meta
    - name: keywords
      content: hideGeneralForumTopic, telegram bot api, gramio hideGeneralForumTopic, hideGeneralForumTopic typescript, hideGeneralForumTopic example, hide general topic telegram, telegram forum topic bot, can_manage_topics, supergroup forum, telegram forum bot, how to hide general forum topic
---

# hideGeneralForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#hidegeneralforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights. The topic will be automatically closed if it was open. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

Hide the General topic by numeric chat ID:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.hideGeneralForumTopic({ chat_id: -1001234567890 });
```

Hide by supergroup username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.hideGeneralForumTopic({ chat_id: "@mysupergroup" });
```

Toggle the General topic visibility with a command:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("hide_general", async (ctx) => {
  await bot.api.hideGeneralForumTopic({ chat_id: ctx.chat.id });
  await ctx.send("General topic is now hidden.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — confirm the bot is a member of the supergroup |
| 400 | `Bad Request: TOPIC_NOT_MODIFIED` | The General topic is already hidden — no action was needed |
| 400 | `Bad Request: method is available for supergroup chats only` | `chat_id` points to a regular group or channel — only forum supergroups have a General topic |
| 403 | `Forbidden: bot is not a member of the supergroup chat` | Bot was removed from the chat — re-add it |
| 403 | `Forbidden: not enough rights` | Bot is not an administrator or lacks `can_manage_topics` — promote the bot first |

## Tips & Gotchas

- **Only works in forum supergroups.** Regular groups and channels do not have a General topic — calling this on a non-forum chat causes a `400` error.
- **The General topic closes automatically.** If the General topic was open when you call `hideGeneralForumTopic`, Telegram closes it silently. You don't need to call `closeGeneralForumTopic` first.
- **`can_manage_topics` is required.** Even if the bot is an admin, the specific `can_manage_topics` right must be granted — general admin rights are not enough.
- **Use `@username` for public supergroups.** The `chat_id` field accepts `@supergroupusername` for public chats, avoiding the need to store numeric IDs.
- **Pair with `unhideGeneralForumTopic`.** To restore visibility, call [unhideGeneralForumTopic](/telegram/methods/unhideGeneralForumTopic) — the same admin rights apply.

## See Also

- [unhideGeneralForumTopic](/telegram/methods/unhideGeneralForumTopic) — restore the General topic's visibility
- [closeGeneralForumTopic](/telegram/methods/closeGeneralForumTopic) — close the General topic without hiding it
- [reopenGeneralForumTopic](/telegram/methods/reopenGeneralForumTopic) — reopen a closed General topic
- [editGeneralForumTopic](/telegram/methods/editGeneralForumTopic) — rename the General topic
- [createForumTopic](/telegram/methods/createForumTopic) — create other topics in a forum supergroup
