---
title: deleteStickerSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a bot-owned Telegram sticker set using GramIO. TypeScript examples, sticker set name conventions, ownership rules, and error reference.
  - - meta
    - name: keywords
      content: deleteStickerSet, telegram bot api, delete sticker set telegram bot, gramio deleteStickerSet, deleteStickerSet typescript, remove sticker set, sticker set name, how to delete telegram sticker set, deleteStickerSet example
---

# deleteStickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletestickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a sticker set that was created by the bot. Returns *True* on success.

## Parameters

<ApiParam name="name" type="String" required description="Sticker set name" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a sticker set by its name
await bot.api.deleteStickerSet({
  name: "my_pack_by_mybot",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a sticker set after confirming it exists
const stickerSet = await bot.api.getStickerSet({ name: "my_pack_by_mybot" });

if (stickerSet) {
  await bot.api.deleteStickerSet({ name: stickerSet.name });
  console.log(`Deleted sticker set: ${stickerSet.title}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Clean up multiple sticker sets created by the bot
const stickerSetNames = ["pack_one_by_mybot", "pack_two_by_mybot", "pack_three_by_mybot"];

for (const name of stickerSetNames) {
  await bot.api.deleteStickerSet({ name });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKERSET_INVALID` | The sticker set name doesn't exist or was not created by this bot |
| 400 | `Bad Request: not enough rights` | The bot does not own the sticker set — only the creating bot can delete a set |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Name format is `<set_name>_by_<botusername>`.** Sticker set names always end with `_by_<botusername>` where `<botusername>` is your bot's username without the `@`. This suffix is appended automatically by Telegram when you create the set, but you must include it when referencing the set name.
- **Only the creating bot can delete the set.** Sticker sets are owned per-bot. A different bot token cannot delete a set even if the sets are managed by the same developer.
- **Deletion is permanent and irreversible.** Once a sticker set is deleted, all its stickers are gone. Users who have added the pack will lose access to it. There is no way to undo this.
- **Empty sets can still be deleted.** Unlike some platforms, Telegram allows deleting an empty sticker set. You do not need to remove individual stickers first.
- **Use `deleteStickerFromSet` to remove individual stickers.** If you only want to clean up a few stickers while keeping the set alive, prefer `deleteStickerFromSet` over deleting the whole set.

## See Also

- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set
- [deleteStickerFromSet](/telegram/methods/deleteStickerFromSet) — remove a single sticker from a set
- [getStickerSet](/telegram/methods/getStickerSet) — retrieve a sticker set and inspect its stickers
- [setStickerSetTitle](/telegram/methods/setStickerSetTitle) — rename a sticker set
- [StickerSet](/telegram/types/StickerSet) — sticker set object reference
