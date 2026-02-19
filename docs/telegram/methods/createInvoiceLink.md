---
title: createInvoiceLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: createInvoiceLink Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: createInvoiceLink, telegram bot api, gramio createInvoiceLink, createInvoiceLink typescript, createInvoiceLink example
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

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="prices" type="LabeledPrice[]" required description="Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="subscription_period" type="Integer" required description="The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars." />

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

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
