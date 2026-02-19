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

<ApiParam name="origin" type="String" required description="Origin of the gift. Currently, either “upgrade” for gifts upgraded from regular gifts, “transfer” for gifts transferred from other users or channels, “resale” for gifts bought from other users, “gifted\_upgrade” for upgrades purchased after the gift was sent, or “offer” for gifts bought or sold through gift purchase offers" />

<ApiParam name="last_resale_currency" type="String" description="_Optional_. For gifts bought from other users, the currency in which the payment for the gift was done. Currently, one of “XTR” for Telegram Stars or “TON” for toncoins." />

<ApiParam name="last_resale_amount" type="Integer" description="_Optional_. For gifts bought from other users, the price paid for the gift in either Telegram Stars or nanotoncoins" />

<ApiParam name="owned_gift_id" type="String" description="_Optional_. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts" />

<ApiParam name="transfer_star_count" type="Integer" description="_Optional_. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift" />

<ApiParam name="next_transfer_date" type="Integer" description="_Optional_. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
