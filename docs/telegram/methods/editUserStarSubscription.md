---
title: editUserStarSubscription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Cancel or re-enable a Telegram Star subscription extension using GramIO. Complete editUserStarSubscription reference with payment charge IDs, cancellation flows, and subscription lifecycle management.
  - - meta
    - name: keywords
      content: editUserStarSubscription, telegram bot api, telegram stars subscription, cancel star subscription telegram bot, gramio editUserStarSubscription, editUserStarSubscription typescript, editUserStarSubscription example, user_id, telegram_payment_charge_id, is_canceled, how to manage telegram star subscription, telegram stars cancel, telegram bot subscription management
---

# editUserStarSubscription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#edituserstarsubscription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Identifier of the user whose subscription will be edited" />

<ApiParam name="telegram_payment_charge_id" type="String" required description="Telegram payment identifier for the subscription" />

<ApiParam name="is_canceled" type="Boolean" required description="Pass *True* to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass *False* to allow the user to re-enable a subscription that was previously canceled by the bot." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Cancel a user's subscription — they keep access until the current period ends
await bot.api.editUserStarSubscription({
  user_id: 123456789,
  telegram_payment_charge_id: "t_charge_abc123xyz",
  is_canceled: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Re-enable a subscription that was previously canceled by the bot
await bot.api.editUserStarSubscription({
  user_id: 123456789,
  telegram_payment_charge_id: "t_charge_abc123xyz",
  is_canceled: false,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Store charge IDs and cancel subscriptions for users who violate ToS
const bannedUsers = new Map<number, string>(); // userId → chargeId

bot.command("ban", async (ctx) => {
  const userId = 987654321; // ID from your system
  const chargeId = bannedUsers.get(userId);

  if (chargeId) {
    await bot.api.editUserStarSubscription({
      user_id: userId,
      telegram_payment_charge_id: chargeId,
      is_canceled: true,
    });
    await ctx.send(`Subscription canceled for user ${userId}.`);
  }
});
```

```ts
// Save charge IDs from successful_payment for later subscription management
bot.on("message", (ctx) => {
  const payment = ctx.update.message?.successful_payment;
  if (payment) {
    const chargeId = payment.telegram_payment_charge_id;
    const userId = ctx.from?.id;
    // persist chargeId → userId mapping in your database
    console.log(`Subscription charge for user ${userId}: ${chargeId}`);
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: USER_ID_INVALID` | The `user_id` doesn't exist or the user has never interacted with the bot |
| 400 | `Bad Request: CHARGE_ID_INVALID` | `telegram_payment_charge_id` is invalid, expired, or belongs to a different bot |
| 400 | `Bad Request: subscription not active` | Can't cancel a subscription that has already expired — only active subscriptions can be canceled |
| 400 | `Bad Request: subscription already canceled` | Subscription is already in a canceled state — no need to cancel again |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Canceling does not immediately revoke access.** Setting `is_canceled: true` stops the subscription from renewing at the end of the current billing period — the user keeps full access until then.
- **`telegram_payment_charge_id` comes from payment updates.** Capture it from `ctx.message.successful_payment.telegram_payment_charge_id` and store it in your database; you'll need it later to manage the subscription.
- **Only the bot that created the subscription can edit it.** The `telegram_payment_charge_id` is tied to your bot's payment flow — other bots cannot cancel it.
- **Setting `is_canceled: false` re-enables auto-renewal.** This only works if the subscription hasn't yet expired; it won't resurrect an already-expired subscription.
- **Subscription state is distinct from user access.** Use your own database to track who has access vs. whose subscription is pending cancellation, since Telegram doesn't notify users about bot-side cancellations by default.
- **Pair with `refundStarPayment` for full refunds.** If you want to both cancel and refund the current period, call `refundStarPayment` first, then optionally cancel.

## See Also

- [refundStarPayment](/telegram/methods/refundStarPayment) — issue a full refund of a Telegram Stars payment
- [sendInvoice](/telegram/methods/sendInvoice) — create a subscription invoice using Stars
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
