---
title: createInvoiceLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Create Telegram payment invoice links with GramIO. Complete createInvoiceLink TypeScript reference for regular payments and Telegram Stars, with subscriptions, tip support, and shipping options.
  - - meta
    - name: keywords
      content: createInvoiceLink, telegram bot api, telegram bot payment, telegram invoice link, gramio createInvoiceLink, createInvoiceLink typescript, telegram stars payment, XTR currency, LabeledPrice, subscription invoice, telegram payment link, how to create invoice link telegram bot, provider_token, pre_checkout_query
---

# createInvoiceLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createinvoicelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a link for an invoice. Returns the created invoice link as _String_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the link will be created. For payments in [Telegram Stars](https://t.me/BotNews/90) only." />

<ApiParam name="title" type="String" required description="Product name, 1-32 characters" />

<ApiParam name="description" type="String" required description="Product description, 1-255 characters" />

<ApiParam name="payload" type="String" required description="Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes." />

<ApiParam name="provider_token" type="String" required description="Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass "XTR" for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="prices" type="LabeledPrice[]" required description="Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="subscription_period" type="Integer" required description="The number of seconds the subscription will be active for before the next payment. The currency must be set to "XTR" (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars." />

<ApiParam name="max_tip_amount" type="Integer" required description="The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90)." :max="1" />

<ApiParam name="suggested_tip_amounts" type="Integer[]" required description="A JSON-serialized array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_." />

<ApiParam name="provider_data" type="String" required description="JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider." />

<ApiParam name="photo_url" type="String" required description="URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service." />

<ApiParam name="photo_size" type="Integer" required description="Photo size in bytes" />

<ApiParam name="photo_width" type="Integer" required description="Photo width" />

<ApiParam name="photo_height" type="Integer" required description="Photo height" />

<ApiParam name="need_name" type="Boolean" required description="Pass _True_ if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_phone_number" type="Boolean" required description="Pass _True_ if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_email" type="Boolean" required description="Pass _True_ if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_shipping_address" type="Boolean" required description="Pass _True_ if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="send_phone_number_to_provider" type="Boolean" required description="Pass _True_ if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="send_email_to_provider" type="Boolean" required description="Pass _True_ if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="is_flexible" type="Boolean" required description="Pass _True_ if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a Telegram Stars invoice link (no provider token needed)
const link = await bot.api.createInvoiceLink({
  title: "Premium Access",
  description: "30 days of premium features",
  payload: "premium_30d_user123",
  provider_token: "", // empty string for Stars
  currency: "XTR",
  prices: [{ label: "Premium Access", amount: 100 }],
});
console.log(link); // https://t.me/$...
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a fiat currency invoice link with tip support
const link = await bot.api.createInvoiceLink({
  title: "Coffee Donation",
  description: "Support the project",
  payload: "donation_coffee",
  provider_token: "YOUR_PROVIDER_TOKEN",
  currency: "USD",
  prices: [{ label: "Coffee", amount: 500 }], // $5.00 in cents
  max_tip_amount: 2000, // max $20 tip
  suggested_tip_amounts: [300, 500, 1000], // $3, $5, $10 suggested
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a recurring Stars subscription invoice link
const link = await bot.api.createInvoiceLink({
  title: "Monthly Newsletter",
  description: "Exclusive monthly content for subscribers",
  payload: "newsletter_monthly",
  provider_token: "",
  currency: "XTR",
  prices: [{ label: "Monthly subscription", amount: 50 }],
  subscription_period: 2592000, // must be exactly 30 days
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create an invoice with shipping and contact info collection
const link = await bot.api.createInvoiceLink({
  title: "Physical Product",
  description: "Hand-crafted item shipped to your door",
  payload: "shop_item_42",
  provider_token: "YOUR_PROVIDER_TOKEN",
  currency: "EUR",
  prices: [
    { label: "Item", amount: 1500 }, // €15.00
    { label: "Shipping", amount: 500 }, // €5.00
  ],
  need_name: true,
  need_shipping_address: true,
  is_flexible: true, // final price depends on chosen shipping
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: CURRENCY_TOTAL_AMOUNT_INVALID` | Total price amount is out of range for the selected currency |
| 400 | `Bad Request: INVOICE_PAYLOAD_INVALID` | `payload` is empty or exceeds 128 bytes |
| 400 | `Bad Request: provider_token is empty` | `provider_token` is empty but `currency` is not `"XTR"` — empty token is only valid for Stars |
| 400 | `Bad Request: SUBSCRIPTION_PERIOD_INVALID` | `subscription_period` is not `2592000` — the only currently supported value |
| 400 | `Bad Request: SUBSCRIPTION_CURRENCY_INVALID` | `subscription_period` is set but `currency` is not `"XTR"` |
| 400 | `Bad Request: PRICES_TOO_MANY` | Stars payments must have exactly 1 item in `prices` |
| 400 | `Bad Request: SUGGESTED_TIP_AMOUNTS_TOO_MANY` | More than 4 suggested tip amounts provided |
| 400 | `Bad Request: TIP_AMOUNTS_SORTED_INVALID` | `suggested_tip_amounts` must be in strictly increasing order |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **For Telegram Stars, use `currency: "XTR"` and `provider_token: ""`** (empty string). All shipping, contact data, and tip parameters are silently ignored for Stars.
- **Stars invoices must have exactly 1 item in `prices`.** Multiple price components (e.g., item + tax) are only supported for fiat currencies.
- **`payload` is bot-internal — users never see it.** Encode order context here (user ID, product ID, plan) so your `pre_checkout_query` handler knows what to fulfil.
- **Amounts are in the smallest currency unit.** For USD/EUR, 500 = $5.00 / €5.00 (divide by 100). Check the `exp` field in [currencies.json](https://core.telegram.org/bots/payments/currencies.json) for other currencies.
- **`subscription_period` must be exactly `2592000` (30 days).** No other value is currently accepted; subscriptions auto-renew monthly.
- **`max_tip_amount` defaults to 0 (tips disabled).** Explicitly set a positive integer to enable tips; fiat-only, not supported for Stars.
- **The returned string is a `t.me/$` invoice deep link** that opens the payment UI when clicked — share it in messages, websites, or embed in QR codes.

## See Also

- [`sendInvoice`](/telegram/methods/sendInvoice) — Send a payment invoice directly into a chat
- [`answerPreCheckoutQuery`](/telegram/methods/answerPreCheckoutQuery) — Confirm or reject a checkout before final payment
- [`LabeledPrice`](/telegram/types/LabeledPrice) — Price component type used in the `prices` array
- [Telegram Stars payments guide](/guides/telegram-stars) — End-to-end guide: invoices, pre-checkout, successful payment, refunds
