---
title: editGeneralForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Rename the General topic in Telegram forum supergroups using GramIO with TypeScript. Complete editGeneralForumTopic parameter reference and admin rights guide.
  - - meta
    - name: keywords
      content: editGeneralForumTopic, telegram bot api, telegram general topic, rename general topic telegram bot, gramio editGeneralForumTopic, editGeneralForumTopic typescript, editGeneralForumTopic example, can_manage_topics, telegram supergroup general topic, forum general topic name, how to rename general forum topic
---

# editGeneralForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editgeneralforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="name" type="String" required description="New topic name, 1-128 characters" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename the General topic
await bot.api.editGeneralForumTopic({
  chat_id: -1001234567890,
  name: "Welcome & Announcements",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename by username — works for public supergroups
await bot.api.editGeneralForumTopic({
  chat_id: "@mysupergroup",
  name: "General Chat",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Restore the default name after a custom rename
bot.command("reset_general", async (ctx) => {
  await bot.api.editGeneralForumTopic({
    chat_id: ctx.chat.id,
    name: "General",
  });
  await ctx.send("General topic name has been reset.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid `chat_id` or the bot is not a member of the chat |
| 400 | `Bad Request: method is available only in supergroups` | Target chat is not a forum supergroup — forums must be enabled in the group settings |
| 400 | `Bad Request: not enough rights to manage topics` | Bot lacks the `can_manage_topics` administrator right |
| 400 | `Bad Request: TOPIC_NAME_INVALID` | `name` is empty or exceeds 128 characters |
| 403 | `Forbidden: not enough rights` | Bot is not an administrator in the supergroup |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The General topic has its own dedicated method.** Unlike regular topics, the General topic cannot be edited with [`editForumTopic`](/telegram/methods/editForumTopic) — use this method instead.
- **`name` is required and must be 1–128 characters.** Unlike regular topics where `name` can be omitted to keep the current value, this method always requires a non-empty name.
- **The General topic cannot have a custom icon.** Only regular forum topics support `icon_custom_emoji_id` — the General topic always uses the default icon.
- **Bot must have `can_manage_topics` admin right.** This is distinct from `can_edit_messages` or other admin rights.
- **Forums must be enabled on the supergroup.** If the group doesn't have the forum mode active, the method will fail with a supergroup-only error.
- **`chat_id` accepts `@username` strings** for public supergroups. Private supergroups always require the numeric chat ID.

## See Also

- [`editForumTopic`](/telegram/methods/editForumTopic) — Edit a regular (non-General) forum topic
- [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic) — Hide the General topic from the topic list
- [`unhideGeneralForumTopic`](/telegram/methods/unhideGeneralForumTopic) — Unhide a previously hidden General topic
- [`closeGeneralForumTopic`](/telegram/methods/closeGeneralForumTopic) — Close the General topic to new messages
- [`reopenGeneralForumTopic`](/telegram/methods/reopenGeneralForumTopic) — Reopen the General topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — Create a new regular forum topic
