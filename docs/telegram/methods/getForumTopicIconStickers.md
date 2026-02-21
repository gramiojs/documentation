---
title: getForumTopicIconStickers — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get custom emoji stickers available as forum topic icons using GramIO. TypeScript examples for getForumTopicIconStickers and createForumTopic icon integration.
  - - meta
    - name: keywords
      content: getForumTopicIconStickers, telegram bot api, gramio getForumTopicIconStickers, forum topic icon stickers, telegram forum topic icon, getForumTopicIconStickers typescript, custom emoji forum topic, createForumTopic icon, TelegramSticker array, telegram supergroup forum
---

# getForumTopicIconStickers

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Sticker">Sticker[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getforumtopiciconstickers" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of [Sticker](https://core.telegram.org/bots/api#sticker) objects.

## Returns

On success, an array of [Sticker](/telegram/types/Sticker) objects is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch all stickers available as forum topic icons
const stickers = await bot.api.getForumTopicIconStickers();
console.log(`${stickers.length} icon stickers available`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Use an icon sticker when creating a forum topic
const stickers = await bot.api.getForumTopicIconStickers();
const icon = stickers[0]; // pick any from the list

if (icon.custom_emoji_id) {
  await bot.api.createForumTopic({
    chat_id: -1001234567890,
    name: "Support",
    icon_custom_emoji_id: icon.custom_emoji_id,
  });
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Find a specific icon by emoji character
const stickers = await bot.api.getForumTopicIconStickers();
const heartIcon = stickers.find((s) => s.emoji === "❤️");

const heartEmojiId = heartIcon?.custom_emoji_id;
if (heartEmojiId) {
  await bot.api.createForumTopic({
    chat_id: -1001234567890,
    name: "Love & Support",
    icon_color: 0xFB6F5F,
    icon_custom_emoji_id: heartEmojiId,
  });
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// List available icons and their emojis
const stickers = await bot.api.getForumTopicIconStickers();
const icons = stickers
  .filter((s) => s.custom_emoji_id)
  .map((s) => ({ emoji: s.emoji, id: s.custom_emoji_id }));

console.log(icons);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
This method requires no permissions and almost never fails. The result is stable over time — you can cache it at startup rather than calling it on every topic creation.
:::

## Tips & Gotchas

- **No parameters required.** This method takes no input — call it as `bot.api.getForumTopicIconStickers()` with no arguments.
- **Result is stable, cache it.** The set of valid forum icon stickers changes infrequently. Fetch once at startup and reuse the list throughout your bot's lifetime.
- **Use `custom_emoji_id` — not `file_id`.** When passing an icon to `createForumTopic` or `editForumTopic`, use the `custom_emoji_id` field from the sticker, not `file_id`.
- **Available to all users, not just bots.** Any Telegram user can use these stickers as topic icons — the list is the same globally, not per-bot.
- **Forum topics require a supergroup with `is_forum: true`.** Calling `createForumTopic` on a regular group or non-forum supergroup will fail.

## See Also

- [Sticker](/telegram/types/Sticker) — return type element
- [createForumTopic](/telegram/methods/createForumTopic) — create a new forum topic using an icon from this list
- [editForumTopic](/telegram/methods/editForumTopic) — change the icon of an existing topic
