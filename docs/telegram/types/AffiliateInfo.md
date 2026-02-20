---
title: AffiliateInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: AffiliateInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: AffiliateInfo, telegram bot api types, gramio AffiliateInfo, AffiliateInfo object, AffiliateInfo typescript
---

# AffiliateInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#affiliateinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Contains information about the affiliate that received a commission via this transaction.

## Fields

<ApiParam name="affiliate_user" type="User" description="*Optional*. The bot or the user that received an affiliate commission if it was received by a bot or a user" />

<ApiParam name="affiliate_chat" type="Chat" description="*Optional*. The chat that received an affiliate commission if it was received by a chat" />

<ApiParam name="commission_per_mille" type="Integer" required description="The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users" />

<ApiParam name="amount" type="Integer" required description="Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds" />

<ApiParam name="nanostar_amount" type="Integer" description="*Optional*. The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
