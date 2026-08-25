---
title: BotSubscriptionUpdated — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: BotSubscriptionUpdated Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: BotSubscriptionUpdated, telegram bot api types, gramio BotSubscriptionUpdated, BotSubscriptionUpdated object, BotSubscriptionUpdated typescript
---

# BotSubscriptionUpdated

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#botsubscriptionupdated" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about changes to a user payment subscription toward the current bot.

## Fields

<ApiParam name="user" type="User" required description="User who subscribed for payments toward the bot" />

<ApiParam name="invoice_payload" type="String" required description="Bot-specified invoice payload" />

<ApiParam name="state" type="String" required description="The new state of the subscription. Currently, it can be one of &quot;canceled&quot; if the user canceled the subscription, &quot;active&quot; if the user re-enabled a previously canceled subscription, or &quot;failed&quot; if payment for the subscription failed." :enumValues='["canceled","active","failed"]' />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
