---
title: GiftInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: GiftInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: GiftInfo, telegram bot api types, gramio GiftInfo, GiftInfo object, GiftInfo typescript
---

# GiftInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#giftinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about a regular gift that was sent or received.

## Fields

<ApiParam name="gift" type="Gift" required description="Information about the gift" />

<ApiParam name="owned_gift_id" type="String" description="*Optional*. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts" />

<ApiParam name="convert_star_count" type="Integer" description="*Optional*. Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible" />

<ApiParam name="prepaid_upgrade_star_count" type="Integer" description="*Optional*. Number of Telegram Stars that were prepaid for the ability to upgrade the gift" />

<ApiParam name="is_upgrade_separate" type="True" description="*Optional*. *True*, if the gift's upgrade was purchased after the gift was sent" />

<ApiParam name="can_be_upgraded" type="True" description="*Optional*. *True*, if the gift can be upgraded to a unique gift" />

<ApiParam name="text" type="String" description="*Optional*. Text of the message that was added to the gift" />

<ApiParam name="entities" type="MessageEntity[]" description="*Optional*. Special entities that appear in the text" />

<ApiParam name="is_private" type="True" description="*Optional*. *True*, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them" />

<ApiParam name="unique_gift_number" type="Integer" description="*Optional*. Unique number reserved for this gift when upgraded. See the *number* field in [UniqueGift](https://core.telegram.org/bots/api#uniquegift)" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
