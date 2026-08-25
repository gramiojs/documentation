---
title: UniqueGiftInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: UniqueGiftInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: UniqueGiftInfo, telegram bot api types, gramio UniqueGiftInfo, UniqueGiftInfo object, UniqueGiftInfo typescript
---

# UniqueGiftInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#uniquegiftinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about a unique gift that was sent or received.

## Fields

<ApiParam name="gift" type="UniqueGift" required description="Information about the gift" />

<ApiParam name="origin" type="String" required description="Origin of the gift. Currently, either &quot;upgrade&quot; for gifts upgraded from regular gifts, &quot;transfer&quot; for gifts transferred from other users or channels, &quot;resale&quot; for gifts bought from other users, &quot;gifted\_upgrade&quot; for upgrades purchased after the gift was sent, or &quot;offer&quot; for gifts bought or sold through gift purchase offers." :enumValues='["upgrade","transfer","resale","gifted_upgrade","offer"]' />

<ApiParam name="text" type="String" description="*Optional*. Text of the message that was added to the gift" />

<ApiParam name="entities" type="MessageEntity[]" description="*Optional*. Special entities that appear in the text" />

<ApiParam name="is_private" type="True" description="*Optional*. *True*, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them" />

<ApiParam name="last_resale_currency" type="String" description="*Optional*. For gifts bought from other users, the currency in which the payment for the gift was done. Currently, one of &quot;XTR&quot; for Telegram Stars or &quot;TON&quot; for TON grams." :enumValues='["XTR","TON"]' />

<ApiParam name="last_resale_amount" type="Integer" description="*Optional*. For gifts bought from other users, the price paid for the gift in either Telegram Stars or nanograms" />

<ApiParam name="owned_gift_id" type="String" description="*Optional*. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts" />

<ApiParam name="transfer_star_count" type="Integer" description="*Optional*. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift" />

<ApiParam name="next_transfer_date" type="Integer" description="*Optional*. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
