---
title: deleteStickerFromSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a sticker from a bot-owned sticker set using GramIO. TypeScript examples, file_id usage, sticker set management patterns, and error reference.
  - - meta
    - name: keywords
      content: deleteStickerFromSet, telegram bot api, delete sticker telegram bot, gramio deleteStickerFromSet, deleteStickerFromSet typescript, sticker file_id, remove sticker from set, sticker set management, deleteStickerFromSet example
---

# deleteStickerFromSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletestickerfromset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a sticker from a set created by the bot. Returns *True* on success.

## Parameters

<ApiParam name="sticker" type="String" required description="File identifier of the sticker" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a sticker from a bot-owned set by file_id
await bot.api.deleteStickerFromSet({
  sticker: "CAACAgIAAxkBAAIBZWXk8s...",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the sticker set, then delete the first sticker
const stickerSet = await bot.api.getStickerSet({ name: "my_pack_by_mybot" });

if (stickerSet.stickers.length > 0) {
  await bot.api.deleteStickerFromSet({
    sticker: stickerSet.stickers[0].file_id,
  });
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Handle a sticker message and remove it from its set
bot.on("message", async (ctx) => {
  if (ctx.sticker && ctx.sticker.set_name) {
    await bot.api.deleteStickerFromSet({
      sticker: ctx.sticker.file_id,
    });
    await ctx.send("Sticker removed from its set.");
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKER_ID_INVALID` | The `sticker` file_id is malformed, expired, or belongs to a different bot's context |
| 400 | `Bad Request: STICKERSET_INVALID` | The sticker set the sticker belongs to was not created by this bot |
| 400 | `Bad Request: not enough rights` | The bot does not own the sticker set that contains this sticker |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only works on bot-owned sticker sets.** You can only delete stickers from sets that were created by your bot. Attempting to delete stickers from any other set returns an error.
- **Use `file_id` not `file_unique_id`.** The `sticker` parameter requires the `file_id` string (context-specific), not `file_unique_id` (which is stable but not accepted here).
- **Deleting the last sticker doesn't delete the set.** An empty sticker set still exists — use `deleteStickerSet` to remove it entirely.
- **Get sticker `file_id` via `getStickerSet`.** If you don't have the file_id at hand, use `getStickerSet` to retrieve the full sticker list and extract `file_id` from each sticker.
- **Sticker type must be consistent within a set.** If the set was created as animated or video stickers, ensure remaining stickers stay consistent — mixing types is not allowed.

## See Also

- [deleteStickerSet](/telegram/methods/deleteStickerSet) — delete an entire sticker set
- [addStickerToSet](/telegram/methods/addStickerToSet) — add a new sticker to an existing set
- [getStickerSet](/telegram/methods/getStickerSet) — retrieve a sticker set and its stickers
- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set
- [StickerSet](/telegram/types/StickerSet) — sticker set object reference
