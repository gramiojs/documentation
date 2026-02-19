---
title: editUserStarSubscription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editUserStarSubscription Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editUserStarSubscription, telegram bot api, gramio editUserStarSubscription, editUserStarSubscription typescript, editUserStarSubscription example
---

# editUserStarSubscription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#edituserstarsubscription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns _True_ on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Identifier of the user whose subscription will be edited" />

<ApiParam name="telegram_payment_charge_id" type="String" required description="Telegram payment identifier for the subscription" />

<ApiParam name="is_canceled" type="Boolean" required description="Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
