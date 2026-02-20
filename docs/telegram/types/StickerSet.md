---
title: StickerSet — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: StickerSet Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: StickerSet, telegram bot api types, gramio StickerSet, StickerSet object, StickerSet typescript
---

# StickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#stickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a sticker set.

## Fields

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="title" type="String" required description="Sticker set title" />

<ApiParam name="sticker_type" type="String" required description="Type of stickers in the set, currently one of “regular”, “mask”, “custom\_emoji”" :enumValues='["regular","mask","custom_emoji"]' />

<ApiParam name="stickers" type="Sticker[]" required description="List of all set stickers" />

<ApiParam name="thumbnail" type="PhotoSize" description="*Optional*. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
