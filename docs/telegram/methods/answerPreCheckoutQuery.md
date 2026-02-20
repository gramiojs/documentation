---
title: answerPreCheckoutQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Confirm or reject Telegram payment pre-checkout queries using GramIO and TypeScript. Handle order validation, stock checks, and payment flow. Full reference with examples.
  - - meta
    - name: keywords
      content: answerPreCheckoutQuery, telegram bot api, telegram payments, answer pre checkout query, gramio answerPreCheckoutQuery, answerPreCheckoutQuery typescript, answerPreCheckoutQuery example, pre_checkout_query_id, ok, error_message, telegram bot payment, how to handle telegram payment
---

# answerPreCheckoutQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answerprecheckoutquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an [Update](https://core.telegram.org/bots/api#update) with the field *pre\_checkout\_query*. Use this method to respond to such pre-checkout queries. On success, *True* is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.

## Parameters

<ApiParam name="pre_checkout_query_id" type="String" required description="Unique identifier for the query to be answered" />

<ApiParam name="ok" type="Boolean" required description="Specify *True* if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use *False* if there are any problems." />

<ApiParam name="error_message" type="String" description="Required if *ok* is *False*. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. &quot;Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!&quot;). Telegram will display this message to the user." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Handle pre_checkout_query — confirm the order is still valid
bot.preCheckoutQuery(async (ctx) => {
  const query = ctx.preCheckoutQuery;

  // Check stock / inventory before approving
  const available = await checkInventory(
    query.invoice_payload,
    query.total_amount,
    query.currency
  );

  if (available) {
    // Approve — payment will proceed
    await ctx.answerPreCheckoutQuery({ ok: true });
  } else {
    // Reject — payment is cancelled with this message shown to the user
    await ctx.answerPreCheckoutQuery({
      ok: false,
      error_message:
        "Sorry, this item is no longer available. Please try a different option.",
    });
  }
});

// Direct API call
await bot.api.answerPreCheckoutQuery({
  pre_checkout_query_id: "query_id_here",
  ok: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: query is too old and response timeout expired or query id is invalid` | Did not answer within 10 seconds — call this immediately, before any async inventory checks |
| 400 | `Bad Request: error_message is required when ok is False` | `ok: false` sent without an `error_message` — always provide a user-facing reason for rejection |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Answer within 10 seconds — this is a hard deadline.** The pre-checkout query expires after 10 seconds. Start your validation immediately. If your inventory check might be slow, consider pre-caching availability or running checks before the payment step.
- **Answering `ok: true` immediately triggers the charge.** After your bot sends `ok: true`, Telegram charges the user's payment method. There is no additional confirmation step — make sure your validation is complete before approving.
- **`error_message` is shown directly to the user** when `ok: false`. Write a clear, friendly, human-readable message explaining why the order can't proceed. Avoid technical jargon.
- **Always handle `successful_payment` updates too.** After `ok: true`, Telegram sends a `successful_payment` message to the chat. Use this to fulfill the order, generate receipts, and update your database. Never rely solely on the pre-checkout step to record orders.
- **`invoice_payload` is your order reference.** The payload you set in `sendInvoice` comes back in the pre-checkout query. Use it to identify which order is being confirmed (e.g., order ID, product SKU, user-specific data).
- **Race conditions are possible.** Multiple users can initiate checkout for the same item simultaneously. Check and reserve stock atomically in your backend before approving.

## See Also

- [`sendInvoice`](/telegram/methods/sendInvoice) — Send the payment invoice that triggers this flow
- [`answerShippingQuery`](/telegram/methods/answerShippingQuery) — Handle shipping address validation (sent before pre-checkout)
- [`PreCheckoutQuery`](/telegram/types/PreCheckoutQuery) — The update object with full order details
