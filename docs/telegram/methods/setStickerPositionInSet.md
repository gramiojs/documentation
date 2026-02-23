---
title: setStickerPositionInSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Reorder stickers in a Telegram sticker set using GramIO. Move a sticker to a specific zero-based position in a bot-created set. TypeScript examples included.
  - - meta
    - name: keywords
      content: setStickerPositionInSet, telegram bot api, telegram sticker position, gramio setStickerPositionInSet, reorder stickers, move sticker in set, setStickerPositionInSet typescript, setStickerPositionInSet example, sticker file_id, position, zero-based, how to reorder telegram stickers, telegram bot sticker order
---

# setStickerPositionInSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickerpositioninset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to move a sticker in a set created by the bot to a specific position. Returns *True* on success.

## Parameters

<ApiParam name="sticker" type="String" required description="File identifier of the sticker" />

<ApiParam name="position" type="Integer" required description="New sticker position in the set, zero-based" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Move a sticker to the front of the set (position 0)
await bot.api.setStickerPositionInSet({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  position: 0,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Move a sticker to a specific position (e.g. 4th slot, zero-based index 3)
await bot.api.setStickerPositionInSet({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  position: 3,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reorder all stickers in a set alphabetically by their emoji
const set = await bot.api.getStickerSet({ name: "my_pack_by_mybot" });

const sorted = [...set.stickers].sort((a, b) =>
  (a.emoji ?? "").localeCompare(b.emoji ?? "")
);

for (let i = 0; i < sorted.length; i++) {
  await bot.api.setStickerPositionInSet({
    sticker: sorted[i].file_id,
    position: i,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKER_ID_INVALID` | The `sticker` file_id is invalid or doesn't belong to a set created by this bot |
| 400 | `Bad Request: position is out of bounds` | `position` is greater than or equal to the number of stickers in the set — use zero-based indexing within range |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Position is zero-based.** The first position in the set is `0`, not `1`. Moving a sticker to position `0` makes it the first sticker shown in the sticker picker.
- **The first sticker is used as the set's cover image.** If no explicit thumbnail is set, Telegram uses the sticker at position `0` as the set's preview image. Use this to control which sticker represents your pack.
- **Reordering multiple stickers requires sequential calls.** There's no bulk reorder API — if you're sorting an entire set, you must call `setStickerPositionInSet` for each sticker, and order matters (moving one sticker shifts others).
- **Fetch the latest set state before reordering.** After each `setStickerPositionInSet` call the set's order changes, so when reordering multiple stickers, work from a fresh snapshot from [getStickerSet](/telegram/methods/getStickerSet) and process in a calculated sequence.
- **Only works on bot-created sets.** You cannot reorder stickers in sets created by other bots or via BotFather.

## See Also

- [getStickerSet](/telegram/methods/getStickerSet) — get the current sticker order and file_ids
- [deleteStickerFromSet](/telegram/methods/deleteStickerFromSet) — remove a sticker from a set
- [addStickerToSet](/telegram/methods/addStickerToSet) — add a new sticker (appended to the end)
- [setStickerSetThumbnail](/telegram/methods/setStickerSetThumbnail) — set an explicit thumbnail instead of using position 0
- [Sticker](/telegram/types/Sticker) — sticker object with file_id
- [StickerSet](/telegram/types/StickerSet) — sticker set object with ordered stickers array
