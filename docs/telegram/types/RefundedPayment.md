---
title: RefundedPayment — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: RefundedPayment Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: RefundedPayment, telegram bot api types, gramio RefundedPayment, RefundedPayment object, RefundedPayment typescript
---

# RefundedPayment

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#refundedpayment" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains basic information about a refunded payment.

## Fields

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). Currently, always “XTR”" />

<ApiParam name="total_amount" type="Integer" required description="Total refunded price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45`, `total_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies)." />

<ApiParam name="invoice_payload" type="String" required description="Bot-specified invoice payload" />

<ApiParam name="telegram_payment_charge_id" type="String" required description="Telegram payment identifier" />

<ApiParam name="provider_payment_charge_id" type="String" description="_Optional_. Provider payment identifier" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
