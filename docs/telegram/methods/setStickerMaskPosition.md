---
title: setStickerMaskPosition — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setStickerMaskPosition Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setStickerMaskPosition, telegram bot api, gramio setStickerMaskPosition, setStickerMaskPosition typescript, setStickerMaskPosition example
---

# setStickerMaskPosition

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickermaskposition" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the [mask position](https://core.telegram.org/bots/api#maskposition) of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.

## Parameters

<ApiParam name="sticker" type="String" required description="File identifier of the sticker" />

<ApiParam name="mask_position" type="MaskPosition" required description="A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
