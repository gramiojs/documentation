---
title: createForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Create topics in Telegram forum supergroups and private chats using GramIO. Complete createForumTopic TypeScript reference with icon colors, custom emoji IDs, and admin permission guide.
  - - meta
    - name: keywords
      content: createForumTopic, telegram bot api, telegram forum topic, gramio createForumTopic, createForumTopic typescript, createForumTopic example, forum supergroup topic, icon_color, can_manage_topics, ForumTopic, getForumTopicIconStickers, message_thread_id, how to create forum topic telegram bot
---

# createForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ForumTopic">ForumTopic</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator right. Returns information about the created topic as a [ForumTopic](https://core.telegram.org/bots/api#forumtopic) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="name" type="String" required description="Topic name, 1-128 characters" :minLen="1" :maxLen="128" />

<ApiParam name="icon_color" type="Integer" description="Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F)" :enumValues='[7322096,16766590,13338331,9367192,16749490,16478047]' />

<ApiParam name="icon_custom_emoji_id" type="String" description="Unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers." />

## Returns

On success, the [ForumTopic](/telegram/types/ForumTopic) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a basic forum topic with a default icon
const topic = await bot.api.createForumTopic({
  chat_id: -1001234567890,
  name: "General Discussion",
});
// Save message_thread_id to send messages to this topic later
console.log(`Topic thread ID: ${topic.message_thread_id}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a topic with a specific icon color (yellow)
const topic = await bot.api.createForumTopic({
  chat_id: -1001234567890,
  name: "Announcements",
  icon_color: 16766590, // 0xFFD67E — yellow
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a topic with a custom emoji icon
// Use getForumTopicIconStickers to find valid emoji IDs
const topic = await bot.api.createForumTopic({
  chat_id: -1001234567890,
  name: "Bug Reports",
  icon_color: 16478047, // 0xFB6F5F — red
  icon_custom_emoji_id: "5312536423581202898",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a topic and then send a message into it
const topic = await bot.api.createForumTopic({
  chat_id: -1001234567890,
  name: "Support",
  icon_color: 9367192, // 0x8EEE98 — green
});

await bot.api.sendMessage({
  chat_id: -1001234567890,
  message_thread_id: topic.message_thread_id,
  text: "Welcome to the Support topic!",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is a member |
| 400 | `Bad Request: TOPIC_NAME_EMPTY` | `name` is empty — must be 1–128 characters |
| 400 | `Bad Request: TOPIC_NAME_TOO_LONG` | `name` exceeds 128 characters |
| 400 | `Bad Request: ICON_COLOR_INVALID` | `icon_color` is not one of the 6 allowed integer values |
| 400 | `Bad Request: FORUMS_DISABLED` | The supergroup does not have the forum/topics feature enabled |
| 400 | `Bad Request: method not available for this chat type` | Target chat is not a forum supergroup (or an allowed private chat) |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_manage_topics` administrator right in the supergroup |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Forum mode must be enabled on the supergroup.** The chat must have topics turned on in group settings — the method fails silently otherwise.
- **`icon_color` accepts only 6 specific integer values.** Valid options: `7322096` (blue 0x6FB9F0), `16766590` (yellow 0xFFD67E), `13338331` (purple 0xCB86DB), `9367192` (green 0x8EEE98), `16749490` (pink 0xFF93B2), `16478047` (red 0xFB6F5F).
- **Get valid `icon_custom_emoji_id` values from `getForumTopicIconStickers`.** Not all custom emoji work as topic icons — only those returned by that method are permitted.
- **Save `message_thread_id` from the returned `ForumTopic`.** You need it to send messages into the topic, close it, or delete it later.
- **In private chats, bots can always create topics without admin rights.** This is useful for organizing per-user conversations.
- **The `can_manage_topics` right is required in supergroups** — even if the bot has other admin rights, this specific permission must be granted.

## See Also

- [`editForumTopic`](/telegram/methods/editForumTopic) — Edit an existing topic's name or icon
- [`closeForumTopic`](/telegram/methods/closeForumTopic) — Close a topic to prevent new messages
- [`deleteForumTopic`](/telegram/methods/deleteForumTopic) — Delete a topic and all its messages
- [`getForumTopicIconStickers`](/telegram/methods/getForumTopicIconStickers) — Get the list of allowed topic icon custom emoji IDs
- [`ForumTopic`](/telegram/types/ForumTopic) — Return type containing `message_thread_id` and icon details
