---
title: TransactionPartnerUser — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: TransactionPartnerUser Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: TransactionPartnerUser, telegram bot api types, gramio TransactionPartnerUser, TransactionPartnerUser object, TransactionPartnerUser typescript
---

# TransactionPartnerUser

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#transactionpartneruser" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a transaction with a user.

## Fields

<ApiParam name="type" type="String" description="Type of the transaction partner, always “user”" defaultValue="user" />

<ApiParam name="transaction_type" type="String" required description="Type of the transaction, currently one of “invoice\_payment” for payments via invoices, “paid\_media\_payment” for payments for paid media, “gift\_purchase” for gifts sent by the bot, “premium\_purchase” for Telegram Premium subscriptions gifted by the bot, “business\_account\_transfer” for direct transfers from managed business accounts" :enumValues='["invoice_payment","paid_media_payment","gift_purchase","premium_purchase","business_account_transfer"]' />

<ApiParam name="user" type="User" required description="Information about the user" />

<ApiParam name="affiliate" type="AffiliateInfo" description="*Optional*. Information about the affiliate that received a commission via this transaction. Can be available only for “invoice\_payment” and “paid\_media\_payment” transactions." />

<ApiParam name="invoice_payload" type="String" description="*Optional*. Bot-specified invoice payload. Can be available only for “invoice\_payment” transactions." />

<ApiParam name="subscription_period" type="Integer" description="*Optional*. The duration of the paid subscription. Can be available only for “invoice\_payment” transactions." />

<ApiParam name="paid_media" type="PaidMedia[]" description="*Optional*. Information about the paid media bought by the user; for “paid\_media\_payment” transactions only" />

<ApiParam name="paid_media_payload" type="String" description="*Optional*. Bot-specified paid media payload. Can be available only for “paid\_media\_payment” transactions." />

<ApiParam name="gift" type="Gift" description="*Optional*. The gift sent to the user by the bot; for “gift\_purchase” transactions only" />

<ApiParam name="premium_subscription_duration" type="Integer" description="*Optional*. Number of months the gifted Telegram Premium subscription will be active for; for “premium\_purchase” transactions only" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
