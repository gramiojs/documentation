---
title: refundStarPayment — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Refund a successful Telegram Stars payment using GramIO and TypeScript. Learn how to retrieve the charge ID, handle errors, and trigger refund logic on pre_checkout_query.
  - - meta
    - name: keywords
      content: refundStarPayment, telegram bot api, gramio refundStarPayment, refundStarPayment typescript, refundStarPayment example, telegram stars refund, star payment refund, telegram_payment_charge_id, successful payment, pre_checkout_query
---

# refundStarPayment

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#refundstarpayment" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Refunds a successful payment in [Telegram Stars](https://t.me/BotNews/90). Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Identifier of the user whose payment will be refunded" />

<ApiParam name="telegram_payment_charge_id" type="String" required description="Telegram payment identifier" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Refund a payment when you receive the `successful_payment` update and store the charge ID for later:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Store charge IDs mapped by user for later refund
const paymentStore = new Map<number, string>();

bot.on("message", (ctx) => {
  const payment = ctx.update.message?.successful_payment;
  if (!payment) return;

  // Save the charge ID so we can refund later if needed
  paymentStore.set(ctx.from!.id, payment.telegram_payment_charge_id);
  ctx.send("Payment received! Thank you.");
});
```

Issue a refund by command when a user requests it:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
const paymentStore = new Map<number, string>();
// ---cut---
bot.command("refund", async (ctx) => {
  const userId = ctx.from!.id;
  const chargeId = paymentStore.get(userId);

  if (!chargeId) {
    return ctx.send("No recent payment found for your account.");
  }

  const success = await bot.api.refundStarPayment({
    user_id: userId,
    telegram_payment_charge_id: chargeId,
  });

  if (success) {
    paymentStore.delete(userId);
    await ctx.send("Your payment has been refunded.");
  }
});
```

Refund directly inside a `pre_checkout_query` handler when your stock validation fails:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("pre_checkout_query", async (ctx) => {
  const isAvailable = false; // replace with real stock check

  if (!isAvailable) {
    // Decline the checkout — Telegram will not charge the user
    await bot.api.answerPreCheckoutQuery({
      pre_checkout_query_id: ctx.update.pre_checkout_query!.id,
      ok: false,
      error_message: "Item is out of stock. Please try again later.",
    });
    return;
  }

  await bot.api.answerPreCheckoutQuery({
    pre_checkout_query_id: ctx.update.pre_checkout_query!.id,
    ok: true,
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | The `user_id` does not correspond to a known Telegram user. |
| 400 | `Bad Request: CHARGE_NOT_FOUND` | The `telegram_payment_charge_id` is invalid or does not match a payment made to this bot. |
| 400 | `Bad Request: CHARGE_ALREADY_REFUNDED` | The payment with this charge ID has already been refunded. Each charge can only be refunded once. |
| 403 | `Forbidden: bot was blocked by the user` | The user has blocked the bot. The refund cannot be delivered as a notification. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Wait `N` seconds before retrying. |

## Tips & Gotchas

- **The `telegram_payment_charge_id` comes from `SuccessfulPayment`.** After a user completes a Stars payment, Telegram sends a message with a `successful_payment` field. Read `ctx.update.message?.successful_payment?.telegram_payment_charge_id` and store it persistently — you will need it to issue refunds later.
- **Each charge ID can only be refunded once.** Calling `refundStarPayment` a second time with the same `telegram_payment_charge_id` returns a 400 error. Check your database before issuing a refund to avoid double-refund attempts.
- **Refunds cannot be issued from `pre_checkout_query`.** At the pre-checkout stage the user has not yet been charged, so there is nothing to refund — simply answer with `ok: false` and an error message to decline the payment before it processes.
- **Stars refunds are immediate and unconditional.** Unlike credit-card gateways, there is no partial refund: the full amount is always returned to the user's Stars balance. There is no time limit enforced by the API, but it is good practice to refund promptly.
- **Store charge IDs durably.** In-memory maps are lost on bot restarts. Persist `telegram_payment_charge_id` in a database keyed by `user_id` and order/item ID so you can always look them up when a user requests a refund days later.

## See Also

- [sendInvoice](/telegram/methods/sendInvoice) — Send a Telegram Stars invoice to a user
- [createInvoiceLink](/telegram/methods/createInvoiceLink) — Generate a shareable invoice link
- [getStarTransactions](/telegram/methods/getStarTransactions) — List all incoming Stars transactions for the bot
- [SuccessfulPayment](/telegram/types/SuccessfulPayment) — The object containing `telegram_payment_charge_id`
