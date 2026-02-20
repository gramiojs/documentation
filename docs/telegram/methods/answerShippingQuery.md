---
title: answerShippingQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Reply to Telegram shipping queries using GramIO and TypeScript. Provide shipping options or decline with an error message. Complete reference for flexible-price invoices.
  - - meta
    - name: keywords
      content: answerShippingQuery, telegram bot api, telegram payments shipping, answer shipping query, gramio answerShippingQuery, answerShippingQuery typescript, answerShippingQuery example, shipping_query_id, shipping_options, ShippingOption, is_flexible, how to handle shipping telegram bot
---

# answerShippingQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answershippingquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

If you sent an invoice requesting a shipping address and the parameter *is\_flexible* was specified, the Bot API will send an [Update](https://core.telegram.org/bots/api#update) with a *shipping\_query* field to the bot. Use this method to reply to shipping queries. On success, *True* is returned.

## Parameters

<ApiParam name="shipping_query_id" type="String" required description="Unique identifier for the query to be answered" />

<ApiParam name="ok" type="Boolean" required description="Pass *True* if delivery to the specified address is possible and *False* if there are any problems (for example, if delivery to the specified address is not possible)" />

<ApiParam name="shipping_options" type="ShippingOption[]" description="Required if *ok* is *True*. A JSON-serialized array of available shipping options." />

<ApiParam name="error_message" type="String" description="Required if *ok* is *False*. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Handle shipping_query — provide available shipping methods
bot.shippingQuery(async (ctx) => {
  const query = ctx.shippingQuery;
  const address = query.shipping_address;

  // Determine if we can ship to this address
  const canShip = await checkShippingAvailability(address.country_code);

  if (canShip) {
    await ctx.answerShippingQuery({
      ok: true,
      shipping_options: [
        {
          id: "standard",
          title: "Standard Shipping (5-7 days)",
          prices: [{ label: "Shipping", amount: 499 }], // amount in smallest currency unit
        },
        {
          id: "express",
          title: "Express Shipping (1-2 days)",
          prices: [{ label: "Express shipping", amount: 1499 }],
        },
      ],
    });
  } else {
    await ctx.answerShippingQuery({
      ok: false,
      error_message: `Sorry, we don't deliver to ${address.country_code} at this time.`,
    });
  }
});

// Direct API call
await bot.api.answerShippingQuery({
  shipping_query_id: "query_id_here",
  ok: true,
  shipping_options: [
    {
      id: "free",
      title: "Free Shipping",
      prices: [{ label: "Free shipping", amount: 0 }],
    },
  ],
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: query is too old and response timeout expired or query id is invalid` | Did not answer within 10 seconds, or query was already answered — respond immediately upon receiving the update |
| 400 | `Bad Request: shipping_options is required when ok is True` | Approved shipping but omitted `shipping_options` — always provide at least one option when `ok: true` |
| 400 | `Bad Request: error_message is required when ok is False` | Declined shipping without a user-facing explanation — always provide `error_message` when `ok: false` |
| 400 | `Bad Request: SHIPPING_OPTIONS_EMPTY` | `shipping_options` is an empty array — must contain at least one option |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **This method is only triggered when `is_flexible: true` was set in `sendInvoice`.** Without that flag, Telegram handles shipping internally and never sends a `shipping_query` update to your bot.
- **Answer within 10 seconds.** Like all query-answer methods in the payments flow, shipping queries expire quickly. Run shipping availability checks ahead of time or use cached results when possible.
- **Prices are in the smallest currency unit.** `amount` in `ShippingOption.prices` is in cents for USD, pence for GBP, etc. A value of `499` means $4.99 for USD.
- **Provide multiple shipping options when possible.** Showing standard and express options gives users a real choice and increases conversion. Each option's ID is sent back in the pre-checkout query for order fulfillment.
- **`error_message` is shown directly to the user.** Write a clear, actionable explanation (e.g., mention supported countries). Avoid generic error messages like "delivery not available" with no context.
- **The `shipping_address` in the query is user-entered.** Always validate country code and postal format server-side — users can enter partial or incorrect addresses.

## See Also

- [`sendInvoice`](/telegram/methods/sendInvoice) — Send the invoice that triggers this flow (with `is_flexible: true`)
- [`answerPreCheckoutQuery`](/telegram/methods/answerPreCheckoutQuery) — Final payment confirmation step (sent after shipping)
- [`ShippingQuery`](/telegram/types/ShippingQuery) — The update object containing the user's address
- [`ShippingOption`](/telegram/types/ShippingOption) — Structure for a single shipping option with prices
