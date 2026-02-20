---
title: Gift — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Gift Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Gift, telegram bot api types, gramio Gift, Gift object, Gift typescript
---

# Gift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#gift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a gift that can be sent by the bot.

## Fields

<ApiParam name="id" type="String" required description="Unique identifier of the gift" />

<ApiParam name="sticker" type="Sticker" required description="The sticker that represents the gift" />

<ApiParam name="star_count" type="Integer" required description="The number of Telegram Stars that must be paid to send the sticker" />

<ApiParam name="upgrade_star_count" type="Integer" description="*Optional*. The number of Telegram Stars that must be paid to upgrade the gift to a unique one" />

<ApiParam name="is_premium" type="True" description="*Optional*. *True*, if the gift can only be purchased by Telegram Premium subscribers" />

<ApiParam name="has_colors" type="True" description="*Optional*. *True*, if the gift can be used (after being upgraded) to customize a user's appearance" />

<ApiParam name="total_count" type="Integer" description="*Optional*. The total number of gifts of this type that can be sent by all users; for limited gifts only" />

<ApiParam name="remaining_count" type="Integer" description="*Optional*. The number of remaining gifts of this type that can be sent by all users; for limited gifts only" />

<ApiParam name="personal_total_count" type="Integer" description="*Optional*. The total number of gifts of this type that can be sent by the bot; for limited gifts only" />

<ApiParam name="personal_remaining_count" type="Integer" description="*Optional*. The number of remaining gifts of this type that can be sent by the bot; for limited gifts only" />

<ApiParam name="background" type="GiftBackground" description="*Optional*. Background of the gift" />

<ApiParam name="unique_gift_variant_count" type="Integer" description="*Optional*. The total number of different unique gifts that can be obtained by upgrading the gift" />

<ApiParam name="publisher_chat" type="Chat" description="*Optional*. Information about the chat that published the gift" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
