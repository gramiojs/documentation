---
title: setCustomEmojiStickerSetThumbnail — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set or remove the thumbnail of a custom emoji sticker set using GramIO. TypeScript examples, custom_emoji_id usage, and dropping thumbnail to use first sticker.
  - - meta
    - name: keywords
      content: setCustomEmojiStickerSetThumbnail, telegram bot api, telegram bot custom emoji sticker set thumbnail, gramio setCustomEmojiStickerSetThumbnail, setCustomEmojiStickerSetThumbnail typescript, set sticker set thumbnail, custom emoji sticker thumbnail, sticker set name, custom_emoji_id, how to set emoji sticker thumbnail telegram bot
---

# setCustomEmojiStickerSetThumbnail

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set the thumbnail of a custom emoji sticker set. Returns *True* on success.

## Parameters

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="custom_emoji_id" type="String" description="Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a specific emoji as the sticker set thumbnail
await bot.api.setCustomEmojiStickerSetThumbnail({
  name: "my_emoji_set_by_mybot",
  custom_emoji_id: "5368324170671202286",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Drop the thumbnail — the first sticker in the set is used automatically
await bot.api.setCustomEmojiStickerSetThumbnail({
  name: "my_emoji_set_by_mybot",
  custom_emoji_id: "",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update thumbnail after adding a new emoji to the set
async function updateStickerSetThumbnail(setName: string, thumbnailEmojiId: string) {
  await bot.api.setCustomEmojiStickerSetThumbnail({
    name: setName,
    custom_emoji_id: thumbnailEmojiId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKERSET_INVALID` | No sticker set with this `name` exists, or it belongs to another bot |
| 400 | `Bad Request: STICKER_ID_INVALID` | `custom_emoji_id` does not refer to a sticker in this set — verify it belongs to the set |
| 400 | `Bad Request: not a custom emoji sticker set` | The sticker set is a regular image/animated set, not a custom emoji set — method only works for custom emoji sets |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and back off |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **This method only works for custom emoji sticker sets.** It does not apply to regular image, animated (.TGS), or video (.WEBM) sticker sets — use [`setStickerSetThumbnail`](/telegram/methods/setStickerSetThumbnail) for those.
- **Pass an empty string to clear the thumbnail.** When `custom_emoji_id` is `""`, Telegram automatically uses the first sticker in the set as the display thumbnail.
- **The emoji must be part of the set.** The `custom_emoji_id` must reference an emoji that is already in the sticker set — you cannot use an emoji from a different set.
- **Sticker set name convention.** Custom emoji set names created via the bot typically end in `_by_<botusername>`. Use [`getStickerSet`](/telegram/methods/getStickerSet) to look up the exact name.
- **Bot must own the sticker set.** Only the bot that created the sticker set can modify its thumbnail.

## See Also

- [`setStickerSetThumbnail`](/telegram/methods/setStickerSetThumbnail) — set thumbnail for regular/animated/video sticker sets
- [`getStickerSet`](/telegram/methods/getStickerSet) — retrieve sticker set info and list of stickers
- [`setStickerSetTitle`](/telegram/methods/setStickerSetTitle) — change the display title of a sticker set
- [`StickerSet`](/telegram/types/StickerSet) — sticker set object type
