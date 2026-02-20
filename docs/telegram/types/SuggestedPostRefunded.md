---
title: SuggestedPostRefunded — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SuggestedPostRefunded Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SuggestedPostRefunded, telegram bot api types, gramio SuggestedPostRefunded, SuggestedPostRefunded object, SuggestedPostRefunded typescript
---

# SuggestedPostRefunded

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#suggestedpostrefunded" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about a payment refund for a suggested post.

## Fields

<ApiParam name="suggested_post_message" type="Message" description="*Optional*. Message containing the suggested post. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the *reply\_to\_message* field even if it itself is a reply." />

<ApiParam name="reason" type="String" required description="Reason for the refund. Currently, one of “post\_deleted” if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or “payment\_refunded” if the payer refunded their payment." :enumValues='["post_deleted","24","payment_refunded"]' />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
