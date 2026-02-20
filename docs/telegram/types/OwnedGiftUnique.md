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

<ApiParam name="type" type="String" description="Type of the gift, always &quot;unique&quot;" defaultValue="unique" />

<ApiParam name="gift" type="UniqueGift" required description="Information about the unique gift" />

<ApiParam name="owned_gift_id" type="String" description="*Optional*. Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only" />

<ApiParam name="sender_user" type="User" description="*Optional*. Sender of the gift if it is a known user" />

<ApiParam name="send_date" type="Integer" required description="Date the gift was sent in Unix time" />

<ApiParam name="is_saved" type="True" description="*Optional*. *True*, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only" />

<ApiParam name="can_be_transferred" type="True" description="*Optional*. *True*, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only" />

<ApiParam name="transfer_star_count" type="Integer" description="*Optional*. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift" />

<ApiParam name="next_transfer_date" type="Integer" description="*Optional*. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
