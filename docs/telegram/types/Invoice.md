---
title: Invoice — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Invoice Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Invoice, telegram bot api types, gramio Invoice, Invoice object, Invoice typescript
---

# Invoice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#invoice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains basic information about an invoice.

## Fields

<ApiParam name="title" type="String" required description="Product name" />

<ApiParam name="description" type="String" required description="Product description" />

<ApiParam name="start_parameter" type="String" required description="Unique bot deep-linking parameter that can be used to generate this invoice" />

<ApiParam name="currency" type="Currencies" required description="Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or &quot;XTR&quot; for payments in [Telegram Stars](https://t.me/BotNews/90)" />

<ApiParam name="total_amount" type="Integer" required description="Total price in the *smallest units* of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the *exp* parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies)." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
