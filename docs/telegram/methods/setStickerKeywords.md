---
title: setStickerKeywords — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set search keywords for a Telegram sticker using GramIO. Improve sticker discoverability with up to 20 keywords (max 64 chars total). TypeScript examples included.
  - - meta
    - name: keywords
      content: setStickerKeywords, telegram bot api, telegram sticker keywords, gramio setStickerKeywords, set sticker search keywords, sticker discoverability, setStickerKeywords typescript, setStickerKeywords example, sticker file_id, keywords, how to add sticker keywords telegram bot
---

# setStickerKeywords

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickerkeywords" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns *True* on success.

## Parameters

<ApiParam name="sticker" type="String" required description="File identifier of the sticker" />

<ApiParam name="keywords" type="String[]" description="A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Add search keywords to a sticker
await bot.api.setStickerKeywords({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  keywords: ["happy", "smile", "funny", "laugh"],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove all keywords from a sticker (pass empty array or omit)
await bot.api.setStickerKeywords({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  keywords: [],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Omitting keywords also clears them
await bot.api.setStickerKeywords({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update keywords for every sticker in a set
const set = await bot.api.getStickerSet({ name: "my_pack_by_mybot" });

const keywordMap: Record<string, string[]> = {
  happy: ["happy", "smile", "joy"],
  sad: ["sad", "cry", "upset"],
};

for (const sticker of set.stickers) {
  const emoji = sticker.emoji ?? "";
  const keywords = keywordMap[emoji] ?? [];
  await bot.api.setStickerKeywords({
    sticker: sticker.file_id,
    keywords,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKER_ID_INVALID` | The `sticker` file_id is invalid or the sticker doesn't belong to a set created by this bot |
| 400 | `Bad Request: keywords list is too long` | More than 20 keywords provided — trim the list |
| 400 | `Bad Request: total keywords length is too long` | Sum of all keyword string lengths exceeds 64 characters — use shorter keywords |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Total character budget is 64, not per-keyword.** All keywords combined (including any separators) must fit within 64 characters. With 20 keywords that's an average of 3 characters each — keep keywords short.
- **Keywords improve discoverability in inline mode.** When users search for stickers in the inline sticker picker by typing words, keywords are matched. Good keywords significantly improve how often your stickers appear.
- **`keywords` is optional — omitting clears all keywords.** Passing `keywords: []` or omitting the field entirely removes all keywords from the sticker. This is intentional — useful for resetting.
- **Only works on bot-created sticker sets.** Like other sticker modification methods, you can only update stickers in sets created by your bot.
- **Use English keywords for widest reach.** Telegram's sticker search is used globally — English keywords reach the most users, even for localized sticker packs.

## See Also

- [getStickerSet](/telegram/methods/getStickerSet) — retrieve a sticker set and its sticker file_ids
- [setStickerEmojiList](/telegram/methods/setStickerEmojiList) — change the emoji assigned to a sticker
- [addStickerToSet](/telegram/methods/addStickerToSet) — add a sticker with initial keywords
- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set
- [Sticker](/telegram/types/Sticker) — sticker object with file_id
- [StickerSet](/telegram/types/StickerSet) — sticker set object
