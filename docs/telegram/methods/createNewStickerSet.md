---
title: createNewStickerSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: createNewStickerSet Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: createNewStickerSet, telegram bot api, gramio createNewStickerSet, createNewStickerSet typescript, createNewStickerSet example
---

# createNewStickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createnewstickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of created sticker set owner" />

<ApiParam name="name" type="String" required description="Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `&quot;_by_<bot_username>&quot;`. `<bot_username>` is case insensitive. 1-64 characters." />

<ApiParam name="title" type="String" required description="Sticker set title, 1-64 characters" />

<ApiParam name="stickers" type="InputSticker[]" required description="A JSON-serialized list of 1-50 initial stickers to be added to the sticker set" />

<ApiParam name="sticker_type" type="String" required description="Type of stickers in the set, pass “regular”, “mask”, or “custom\_emoji”. By default, a regular sticker set is created." />

<ApiParam name="needs_repainting" type="Boolean" required description="Pass _True_ if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only" />

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
