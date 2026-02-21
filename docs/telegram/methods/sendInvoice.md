---
title: sendInvoice — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send payment invoices using GramIO with TypeScript. Complete sendInvoice reference with Telegram Stars (XTR), LabeledPrice, provider_token, pre-checkout flow, and error handling examples.
  - - meta
    - name: keywords
      content: sendInvoice, telegram bot api, send invoice telegram bot, gramio sendInvoice, sendInvoice typescript, sendInvoice example, telegram payments, telegram stars payment, XTR currency, LabeledPrice, provider_token, answerPreCheckoutQuery, telegram bot payment, how to accept payment telegram bot
---

# sendInvoice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendinvoice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send invoices. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="title" type="String" required description="Product name, 1-32 characters" :minLen="1" :maxLen="32" />

<ApiParam name="description" type="String" required description="Product description, 1-255 characters" :minLen="1" :maxLen="255" />

<ApiParam name="payload" type="String" required description="Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes." />

<ApiParam name="provider_token" type="String" description="Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="currency" type="Currencies" required description="Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass &quot;XTR&quot; for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="prices" type="LabeledPrice[]" required description="Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="max_tip_amount" type="Integer" description="The maximum accepted amount for tips in the *smallest units* of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the *exp* parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90)." :defaultValue="0" />

<ApiParam name="suggested_tip_amounts" type="Integer[]" description="A JSON-serialized array of suggested amounts of tips in the *smallest units* of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed *max\_tip\_amount*." />

<ApiParam name="start_parameter" type="String" description="Unique deep-linking parameter. If left empty, **forwarded copies** of the sent message will have a *Pay* button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a *URL* button with a deep link to the bot (instead of a *Pay* button), with the value used as the start parameter" />

<ApiParam name="provider_data" type="String" description="JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider." />

<ApiParam name="photo_url" type="String" description="URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for." />

<ApiParam name="photo_size" type="Integer" description="Photo size in bytes" />

<ApiParam name="photo_width" type="Integer" description="Photo width" />

<ApiParam name="photo_height" type="Integer" description="Photo height" />

<ApiParam name="need_name" type="Boolean" description="Pass *True* if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_phone_number" type="Boolean" description="Pass *True* if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_email" type="Boolean" description="Pass *True* if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_shipping_address" type="Boolean" description="Pass *True* if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="send_phone_number_to_provider" type="Boolean" description="Pass *True* if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="send_email_to_provider" type="Boolean" description="Pass *True* if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="is_flexible" type="Boolean" description="Pass *True* if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Pay `total price`' button will be shown. If not empty, the first button must be a Pay button." docsLink="/keyboards/overview" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a Telegram Stars invoice (no provider_token needed)
bot.command("buy", (ctx) =>
    ctx.sendInvoice({
        title: "Premium Access",
        description: "Unlock all premium features for 30 days",
        payload: "premium_30d",
        currency: "XTR",
        prices: [{ label: "Premium (30 days)", amount: 100 }],
    })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send an invoice with fiat currency and tipping options
bot.command("donate", (ctx) =>
    ctx.sendInvoice({
        title: "Support the project",
        description: "Help us keep the bot running",
        payload: `donation_${ctx.from?.id}`,
        provider_token: "PROVIDER_TOKEN_FROM_BOTFATHER",
        currency: "USD",
        // Prices are in smallest units: 100 = $1.00
        prices: [{ label: "Donation", amount: 500 }],
        max_tip_amount: 1000,
        suggested_tip_amounts: [100, 300, 500, 1000],
    })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Handle pre-checkout: MUST answer within 10 seconds
bot.on("pre_checkout_query", async (ctx) => {
    // Validate the order (check stock, verify payload, etc.)
    const isValid = ctx.payload.invoice_payload.startsWith("premium_");

    if (isValid) {
        await bot.api.answerPreCheckoutQuery({
            pre_checkout_query_id: ctx.payload.id,
            ok: true,
        });
    } else {
        await bot.api.answerPreCheckoutQuery({
            pre_checkout_query_id: ctx.payload.id,
            ok: false,
            error_message: "This product is no longer available.",
        });
    }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Handle successful payment
bot.on("message", (ctx) => {
    if (!ctx.payload.successful_payment) return;
    const payment = ctx.payload.successful_payment;
    // payment.telegram_payment_charge_id — save for refund support
    // payment.invoice_payload — your bot-defined identifier
    return ctx.send(`✅ Payment received! Order: ${payment.invoice_payload}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — send invoice to a channel
await bot.api.sendInvoice({
    chat_id: "@mychannel",
    title: "Channel Subscription",
    description: "Support the channel with a Stars donation",
    payload: "channel_sub",
    currency: "XTR",
    prices: [{ label: "Subscription", amount: 50 }],
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access |
| 400 | `Bad Request: CURRENCY_INVALID` | `currency` code is not in the [supported list](https://core.telegram.org/bots/payments#supported-currencies) |
| 400 | `Bad Request: INVOICE_PAYLOAD_INVALID` | `payload` is empty or exceeds 128 bytes |
| 400 | `Bad Request: prices must be non-empty` | `prices` array is empty — at least one `LabeledPrice` is required |
| 400 | `Bad Request: XTR invoices must have exactly one price` | For `currency: "XTR"`, the `prices` array must contain exactly one item |
| 400 | `Bad Request: provider_token is required` | Non-XTR currencies need a `provider_token` from BotFather |
| 400 | `Bad Request: TITLE_INVALID` | `title` is empty or longer than 32 characters |
| 400 | `Bad Request: DESCRIPTION_INVALID` | `description` is empty or longer than 255 characters |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **For Telegram Stars (`currency: "XTR"`), omit `provider_token`.** Pass an empty string `""` or simply omit it. Stars payments don't go through an external provider.
- **`XTR` invoices must have exactly one price item.** The `prices` array must contain a single `LabeledPrice`. Multiple items cause a `400` error.
- **Prices are in the smallest currency unit.** For USD, `amount: 100` = $1.00 (cents). For XTR (Stars), `amount: 50` = 50 Stars. Check the `exp` field in [currencies.json](https://core.telegram.org/bots/payments/currencies.json).
- **You MUST answer `pre_checkout_query` within 10 seconds.** Failure to call `answerPreCheckoutQuery` in time causes the payment to fail on the user's side — always handle this event promptly.
- **The `payload` is your order identifier — store it.** Use `payload` to link the payment to your internal order. It's returned in both `pre_checkout_query` and `successful_payment` events.
- **`need_name`, `need_email`, etc. are silently ignored for XTR payments.** These data-collection flags only apply to fiat currency payments with a provider token.
- **If `start_parameter` is empty, forwarded invoices remain payable.** Setting a `start_parameter` converts the Pay button in forwarded copies to a deep link, preventing others from paying the same forwarded invoice.

## See Also

- [answerPreCheckoutQuery](/telegram/methods/answerPreCheckoutQuery) — confirm or reject a payment before charging
- [LabeledPrice](/telegram/types/LabeledPrice) — price item type used in `prices`
- [Invoice](/telegram/types/Invoice) — the Invoice type in received messages
- [SuccessfulPayment](/telegram/types/SuccessfulPayment) — payment confirmation message type
- [Keyboards overview](/keyboards/overview) — how to build inline keyboards
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` handling
