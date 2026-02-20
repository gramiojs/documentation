---
title: SuggestedPostPrice — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SuggestedPostPrice Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SuggestedPostPrice, telegram bot api types, gramio SuggestedPostPrice, SuggestedPostPrice object, SuggestedPostPrice typescript
---

# SuggestedPostPrice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#suggestedpostprice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes the price of a suggested post.

## Fields

<ApiParam name="currency" type="String" required description="Currency in which the post will be paid. Currently, must be one of “XTR” for Telegram Stars or “TON” for toncoins" :enumValues='["XTR","TON"]' />

<ApiParam name="amount" type="Integer" required description="The amount of the currency that will be paid for the post in the *smallest units* of the currency, i.e. Telegram Stars or nanotoncoins. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanotoncoins must be between 10000000 and 10000000000000." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
