---
title: addStickerToSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: addStickerToSet Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: addStickerToSet, telegram bot api, gramio addStickerToSet, addStickerToSet typescript, addStickerToSet example
---

# addStickerToSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#addstickertoset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns _True_ on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of sticker set owner" />

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="sticker" type="InputSticker" required description="A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed." />

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
