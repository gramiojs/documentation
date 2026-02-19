---
title: UniqueGift — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: UniqueGift Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: UniqueGift, telegram bot api types, gramio UniqueGift, UniqueGift object, UniqueGift typescript
---

# UniqueGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#uniquegift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object describes a unique gift that was upgraded from a regular gift.

## Fields

<ApiParam name="gift_id" type="String" required description="Identifier of the regular gift from which the gift was upgraded" />

<ApiParam name="base_name" type="String" required description="Human-readable name of the regular gift from which this unique gift was upgraded" />

<ApiParam name="name" type="String" required description="Unique name of the gift. This name can be used in `https://t.me/nft/...` links and story areas" />

<ApiParam name="number" type="Integer" required description="Unique number of the upgraded gift among gifts upgraded from the same regular gift" />

<ApiParam name="model" type="UniqueGiftModel" required description="Model of the gift" />

<ApiParam name="symbol" type="UniqueGiftSymbol" required description="Symbol of the gift" />

<ApiParam name="backdrop" type="UniqueGiftBackdrop" required description="Backdrop of the gift" />

<ApiParam name="is_premium" type="Boolean" description="_Optional_. _True_, if the original regular gift was exclusively purchaseable by Telegram Premium subscribers" />

<ApiParam name="is_burned" type="Boolean" description="_Optional_. _True_, if the gift was used to craft another gift and isn't available anymore" />

<ApiParam name="is_from_blockchain" type="Boolean" description="_Optional_. _True_, if the gift is assigned from the TON blockchain and can't be resold or transferred in Telegram" />

<ApiParam name="colors" type="UniqueGiftColors" description="_Optional_. The color scheme that can be used by the gift's owner for the chat's name, replies to messages and link previews; for business account gifts and gifts that are currently on sale only" />

<ApiParam name="publisher_chat" type="Chat" description="_Optional_. Information about the chat that published the gift" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
