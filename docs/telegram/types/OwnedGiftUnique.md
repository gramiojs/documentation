---
title: OwnedGiftUnique — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: OwnedGiftUnique Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: OwnedGiftUnique, telegram bot api types, gramio OwnedGiftUnique, OwnedGiftUnique object, OwnedGiftUnique typescript
---

# OwnedGiftUnique

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#ownedgiftunique" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a unique gift received and owned by a user or a chat.

## Fields

<ApiParam name="type" type="String" required description="Type of the gift, always “unique”" />

<ApiParam name="gift" type="UniqueGift" required description="Information about the unique gift" />

<ApiParam name="owned_gift_id" type="String" description="_Optional_. Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only" />

<ApiParam name="sender_user" type="User" description="_Optional_. Sender of the gift if it is a known user" />

<ApiParam name="send_date" type="Integer" required description="Date the gift was sent in Unix time" />

<ApiParam name="is_saved" type="Boolean" description="_Optional_. _True_, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only" />

<ApiParam name="can_be_transferred" type="Boolean" description="_Optional_. _True_, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only" />

<ApiParam name="transfer_star_count" type="Integer" description="_Optional_. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift" />

<ApiParam name="next_transfer_date" type="Integer" description="_Optional_. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
