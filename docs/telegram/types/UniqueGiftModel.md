---
title: UniqueGiftModel — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: UniqueGiftModel Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: UniqueGiftModel, telegram bot api types, gramio UniqueGiftModel, UniqueGiftModel object, UniqueGiftModel typescript
---

# UniqueGiftModel

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#uniquegiftmodel" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object describes the model of a unique gift.

## Fields

<ApiParam name="name" type="String" required description="Name of the model" />

<ApiParam name="sticker" type="Sticker" required description="The sticker that represents the unique gift" />

<ApiParam name="rarity_per_mille" type="Integer" required description="The number of unique gifts that receive this model for every 1000 gift upgrades. Always 0 for crafted gifts." />

<ApiParam name="rarity" type="String" description="*Optional*. Rarity of the model if it is a crafted model. Currently, can be “uncommon”, “rare”, “epic”, or “legendary”." :enumValues='["uncommon","rare","epic","legendary"]' />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
