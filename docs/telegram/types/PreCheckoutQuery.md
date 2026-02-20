---
title: PreCheckoutQuery — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PreCheckoutQuery Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PreCheckoutQuery, telegram bot api types, gramio PreCheckoutQuery, PreCheckoutQuery object, PreCheckoutQuery typescript
---

# PreCheckoutQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#precheckoutquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about an incoming pre-checkout query.

## Fields

<ApiParam name="id" type="String" required description="Unique query identifier" />

<ApiParam name="from" type="User" required description="User who sent the query" />

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or &quot;XTR&quot; for payments in [Telegram Stars](https://t.me/BotNews/90)" />

<ApiParam name="total_amount" type="Integer" required description="Total price in the *smallest units* of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the *exp* parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies)." />

<ApiParam name="invoice_payload" type="String" required description="Bot-specified invoice payload" />

<ApiParam name="shipping_option_id" type="String" description="*Optional*. Identifier of the shipping option chosen by the user" />

<ApiParam name="order_info" type="OrderInfo" description="*Optional*. Order information provided by the user" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
