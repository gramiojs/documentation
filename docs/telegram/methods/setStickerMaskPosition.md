---
title: setStickerMaskPosition — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set or clear the mask position of a mask sticker using GramIO. Control face placement with forehead/eyes/mouth/chin anchors and x/y offsets. TypeScript examples included.
  - - meta
    - name: keywords
      content: setStickerMaskPosition, telegram bot api, telegram mask sticker, gramio setStickerMaskPosition, set mask position, mask sticker face position, setStickerMaskPosition typescript, setStickerMaskPosition example, MaskPosition, mask_position, sticker file_id, forehead eyes mouth chin, how to set mask position telegram bot
---

# setStickerMaskPosition

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickermaskposition" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the [mask position](https://core.telegram.org/bots/api#maskposition) of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns *True* on success.

## Parameters

<ApiParam name="sticker" type="String" required description="File identifier of the sticker" />

<ApiParam name="mask_position" type="MaskPosition" description="A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the mask to appear over the eyes, centered
await bot.api.setStickerMaskPosition({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  mask_position: {
    point: "eyes",
    x_shift: 0,
    y_shift: 0,
    scale: 1.0,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Position a mask slightly below the forehead and scaled larger
await bot.api.setStickerMaskPosition({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  mask_position: {
    point: "forehead",
    x_shift: 0,
    y_shift: 0.5,  // shift down by half the mask height
    scale: 1.5,    // 50% larger than default
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the mask position (sticker loses default placement hint)
await bot.api.setStickerMaskPosition({
  sticker: "CAACAgIAAxkBAAIBcWZ...",
  // omitting mask_position removes it
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKER_ID_INVALID` | The `sticker` file_id is invalid or the sticker doesn't belong to a set created by this bot |
| 400 | `Bad Request: not a mask sticker` | This method only applies to mask-type stickers — regular/custom emoji stickers don't support mask positions |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only works on mask-type stickers.** The sticker set must have been created with `sticker_type: "mask"`. Regular or custom emoji stickers do not have mask positions.
- **`point` is the anchor face feature.** Valid values are `"forehead"`, `"eyes"`, `"mouth"`, and `"chin"`. The mask is positioned relative to the chosen facial landmark.
- **`x_shift` and `y_shift` are in face-relative units.** A shift of `1.0` moves the mask by exactly one mask-width (x) or mask-height (y). Negative x shifts left, positive shifts right; negative y shifts up, positive shifts down.
- **`scale` multiplies the default mask size.** `1.0` is the unscaled default, `2.0` doubles the size, `0.5` halves it. Use this to fit the mask better to different face proportions.
- **Omitting `mask_position` removes placement data.** Without a mask position, Telegram clients use a neutral default placement. It's best to always provide explicit coordinates for predictable results.

## See Also

- [MaskPosition](/telegram/types/MaskPosition) — the mask position object structure
- [getStickerSet](/telegram/methods/getStickerSet) — retrieve sticker set details and sticker file_ids
- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a mask sticker set with initial mask positions
- [addStickerToSet](/telegram/methods/addStickerToSet) — add a mask sticker with initial position
- [Sticker](/telegram/types/Sticker) — sticker object (includes mask_position field)
- [StickerSet](/telegram/types/StickerSet) — sticker set object
