---
title: setStickerEmojiList — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the emoji list of a sticker using GramIO. Assign 1–20 emoji to regular or custom emoji stickers in bot-created sets. TypeScript examples included.
  - - meta
    - name: keywords
      content: setStickerEmojiList, telegram bot api, telegram sticker emoji list, gramio setStickerEmojiList, set sticker emoji, change sticker emoji, setStickerEmojiList typescript, setStickerEmojiList example, sticker file_id, emoji_list, telegram bot sticker set, how to change sticker emoji telegram
---

# setStickerEmojiList

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickeremojilist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns *True* on success.

## Parameters

<ApiParam name="sticker" type="String" required description="File identifier of the sticker" />

<ApiParam name="emoji_list" type="String[]" required description="A JSON-serialized list of 1-20 emoji associated with the sticker" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Assign emoji to a sticker by its file_id
await bot.api.setStickerEmojiList({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  emoji_list: ["😄", "😂", "🤣"],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Replace emoji on a sticker — set exactly one primary emoji
await bot.api.setStickerEmojiList({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  emoji_list: ["🔥"],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get a sticker set to find file_ids, then update emoji on each sticker
const set = await bot.api.getStickerSet({ name: "my_pack_by_mybot" });

for (const sticker of set.stickers) {
  // Only update stickers that don't already have the right emoji
  if (!sticker.emoji?.includes("⭐")) {
    await bot.api.setStickerEmojiList({
      sticker: sticker.file_id,
      emoji_list: [sticker.emoji ?? "⭐", "⭐"],
    });
  }
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKER_ID_INVALID` | The `sticker` file_id is invalid or the sticker doesn't belong to a set created by this bot |
| 400 | `Bad Request: emoji list must be non-empty` | `emoji_list` is empty — provide at least 1 emoji |
| 400 | `Bad Request: emoji list is too long` | `emoji_list` has more than 20 entries — trim the list |
| 400 | `Bad Request: can't use this sticker` | The sticker type doesn't support emoji lists (e.g., mask stickers) |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only works on stickers in bot-created sets.** You can only modify emoji for stickers in sets your bot created — attempting to modify stickers in sets owned by other bots or users returns an error.
- **1–20 emoji, not characters.** The limit counts emoji, not bytes or code points. Multi-codepoint emoji (like `🏳️‍🌈`) count as one emoji. Stay within 1–20 entries.
- **The first emoji is the "primary" one.** Telegram displays the first emoji in the list as the sticker's main associated emoji in the sticker picker. Put the most relevant emoji first.
- **Use the sticker's `file_id`, not `file_unique_id`.** The `file_id` is what you pass to sticker management methods — get it from [getStickerSet](/telegram/methods/getStickerSet) or from a received sticker message.
- **Works for both regular and custom emoji stickers.** Both sticker types support emoji lists, but mask stickers do not.

## See Also

- [getStickerSet](/telegram/methods/getStickerSet) — retrieve a sticker set and its sticker file_ids
- [setStickerKeywords](/telegram/methods/setStickerKeywords) — set search keywords for a sticker
- [addStickerToSet](/telegram/methods/addStickerToSet) — add a new sticker with its initial emoji list
- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set
- [Sticker](/telegram/types/Sticker) — sticker object with file_id and emoji fields
- [StickerSet](/telegram/types/StickerSet) — sticker set object
