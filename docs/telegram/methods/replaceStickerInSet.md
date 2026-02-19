---
title: replaceStickerInSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: replaceStickerInSet Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: replaceStickerInSet, telegram bot api, gramio replaceStickerInSet, replaceStickerInSet typescript, replaceStickerInSet example
---

# replaceStickerInSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#replacestickerinset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset), then [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset), then [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset). Returns _True_ on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of the sticker set owner" />

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="old_sticker" type="String" required description="File identifier of the replaced sticker" />

<ApiParam name="sticker" type="InputSticker" required description="A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged." />

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
