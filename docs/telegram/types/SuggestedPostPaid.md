---
title: SuggestedPostPaid — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SuggestedPostPaid Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SuggestedPostPaid, telegram bot api types, gramio SuggestedPostPaid, SuggestedPostPaid object, SuggestedPostPaid typescript
---

# SuggestedPostPaid

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#suggestedpostpaid" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about a successful payment for a suggested post.

## Fields

<ApiParam name="suggested_post_message" type="Message" description="_Optional_. Message containing the suggested post. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply." />

<ApiParam name="currency" type="String" required description="Currency in which the payment was made. Currently, one of “XTR” for Telegram Stars or “TON” for toncoins" />

<ApiParam name="amount" type="Integer" description="_Optional_. The amount of the currency that was received by the channel in nanotoncoins; for payments in toncoins only" />

<ApiParam name="star_amount" type="StarAmount" description="_Optional_. The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
