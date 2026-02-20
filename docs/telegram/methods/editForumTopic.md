---
title: editForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit forum topic name and icon in Telegram supergroups using GramIO with TypeScript. Rename topics, change custom emoji icons, and manage forum threads.
  - - meta
    - name: keywords
      content: editForumTopic, telegram bot api, telegram forum topic, edit forum topic telegram bot, gramio editForumTopic, editForumTopic typescript, editForumTopic example, message_thread_id, icon_custom_emoji_id, can_manage_topics, telegram supergroup topics, forum thread name, how to edit forum topic telegram bot
---

# editForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights, unless it is the creator of the topic. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread of the forum topic" />

<ApiParam name="name" type="String" description="New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept" :minLen="0" :maxLen="128" />

<ApiParam name="icon_custom_emoji_id" type="String" description="New unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename a forum topic
await bot.api.editForumTopic({
  chat_id: -1001234567890,
  message_thread_id: 42,
  name: "Announcements",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Change both the topic name and its custom emoji icon
await bot.api.editForumTopic({
  chat_id: "@mysupergroup",
  message_thread_id: 42,
  name: "Dev Discussion",
  icon_custom_emoji_id: "5312536423851630001",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the topic icon by passing an empty string
await bot.api.editForumTopic({
  chat_id: -1001234567890,
  message_thread_id: 42,
  icon_custom_emoji_id: "",
});
```

```ts
// Handle the forum_topic_created event and immediately rename it
bot.on("message", async (ctx) => {
  const threadId = ctx.update.message?.message_thread_id;
  const topicCreated = ctx.update.message?.forum_topic_created;
  if (topicCreated && threadId) {
    await bot.api.editForumTopic({
      chat_id: ctx.chatId,
      message_thread_id: threadId,
      name: `[OPEN] ${topicCreated.name}`,
    });
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid `chat_id` or the bot is not a member of the chat |
| 400 | `Bad Request: message thread not found` | `message_thread_id` doesn't exist in the target chat |
| 400 | `Bad Request: not enough rights to manage topics` | Bot is not the topic creator and lacks the `can_manage_topics` admin right |
| 400 | `Bad Request: TOPIC_NAME_INVALID` | `name` exceeds 128 characters |
| 400 | `Bad Request: method is available only in supergroups` | `chat_id` points to a regular group or channel, not a supergroup with forums enabled |
| 403 | `Forbidden: not enough rights` | Bot is not an administrator in the supergroup |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Both `name` and `icon_custom_emoji_id` are optional.** Omit a field to keep its current value — passing only `name` leaves the icon unchanged.
- **Pass an empty string for `icon_custom_emoji_id` to remove the icon.** Omitting it keeps the current icon; an empty string clears it.
- **Use `getForumTopicIconStickers` to get valid emoji IDs.** Only specific emoji from the sticker set are allowed as topic icons — you can't use arbitrary custom emoji.
- **Bot must be creator of the topic or have `can_manage_topics` admin right.** If neither condition is met, the call returns a 400 error.
- **Works in private chats with topics** (as of Bot API 9.0). The `message_thread_id` works the same way in both supergroups and private chats with topics enabled.
- **General topic cannot be edited with this method.** Use [`editGeneralForumTopic`](/telegram/methods/editGeneralForumTopic) for the special General topic.

## See Also

- [`createForumTopic`](/telegram/methods/createForumTopic) — Create a new forum topic
- [`closeForumTopic`](/telegram/methods/closeForumTopic) — Close a forum topic to new messages
- [`reopenForumTopic`](/telegram/methods/reopenForumTopic) — Reopen a closed forum topic
- [`deleteForumTopic`](/telegram/methods/deleteForumTopic) — Delete a forum topic and all its messages
- [`editGeneralForumTopic`](/telegram/methods/editGeneralForumTopic) — Edit the special General topic name
- [`getForumTopicIconStickers`](/telegram/methods/getForumTopicIconStickers) — Get the list of allowed topic icon emoji
- [`ForumTopic`](/telegram/types/ForumTopic) — Forum topic object type
