---
title: OwnedGiftRegular — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: OwnedGiftRegular Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: OwnedGiftRegular, telegram bot api types, gramio OwnedGiftRegular, OwnedGiftRegular object, OwnedGiftRegular typescript
---

# OwnedGiftRegular

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#ownedgiftregular" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a regular gift owned by a user or a chat.

## Fields

<ApiParam name="type" type="String" required description="Type of the gift, always “regular”" />

<ApiParam name="gift" type="Gift" required description="Information about the regular gift" />

<ApiParam name="owned_gift_id" type="String" description="_Optional_. Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only" />

<ApiParam name="sender_user" type="User" description="_Optional_. Sender of the gift if it is a known user" />

<ApiParam name="send_date" type="Integer" required description="Date the gift was sent in Unix time" />

<ApiParam name="text" type="String" description="_Optional_. Text of the message that was added to the gift" />

<ApiParam name="entities" type="MessageEntity[]" description="_Optional_. Special entities that appear in the text" />

<ApiParam name="is_private" type="Boolean" description="_Optional_. _True_, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them" />

<ApiParam name="is_saved" type="Boolean" description="_Optional_. _True_, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only" />

<ApiParam name="can_be_upgraded" type="Boolean" description="_Optional_. _True_, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only" />

<ApiParam name="was_refunded" type="Boolean" description="_Optional_. _True_, if the gift was refunded and isn't available anymore" />

<ApiParam name="convert_star_count" type="Integer" description="_Optional_. Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars; for gifts received on behalf of business accounts only" />

<ApiParam name="prepaid_upgrade_star_count" type="Integer" description="_Optional_. Number of Telegram Stars that were paid for the ability to upgrade the gift" />

<ApiParam name="is_upgrade_separate" type="Boolean" description="_Optional_. _True_, if the gift's upgrade was purchased after the gift was sent; for gifts received on behalf of business accounts only" />

<ApiParam name="unique_gift_number" type="Integer" description="_Optional_. Unique number reserved for this gift when upgraded. See the _number_ field in [UniqueGift](https://core.telegram.org/bots/api#uniquegift)" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
