---
title: InputInvoiceMessageContent — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputInvoiceMessageContent Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputInvoiceMessageContent, telegram bot api types, gramio InputInvoiceMessageContent, InputInvoiceMessageContent object, InputInvoiceMessageContent typescript
---

# InputInvoiceMessageContent

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputinvoicemessagecontent" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of an invoice message to be sent as the result of an inline query.

## Fields

<ApiParam name="title" type="String" required description="Product name, 1-32 characters" :minLen="1" :maxLen="32" />

<ApiParam name="description" type="String" required description="Product description, 1-255 characters" :minLen="1" :maxLen="255" />

<ApiParam name="payload" type="String" required description="Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes." />

<ApiParam name="provider_token" type="String" description="*Optional*. Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass &quot;XTR&quot; for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="prices" type="LabeledPrice[]" required description="Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="max_tip_amount" type="Integer" description="*Optional*. The maximum accepted amount for tips in the *smallest units* of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the *exp* parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90)." :defaultValue="0" />

<ApiParam name="suggested_tip_amounts" type="Integer[]" description="*Optional*. A JSON-serialized array of suggested amounts of tip in the *smallest units* of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed *max\_tip\_amount*." />

<ApiParam name="provider_data" type="String" description="*Optional*. A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider." />

<ApiParam name="photo_url" type="String" description="*Optional*. URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service." />

<ApiParam name="photo_size" type="Integer" description="*Optional*. Photo size in bytes" />

<ApiParam name="photo_width" type="Integer" description="*Optional*. Photo width" />

<ApiParam name="photo_height" type="Integer" description="*Optional*. Photo height" />

<ApiParam name="need_name" type="Boolean" description="*Optional*. Pass *True* if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_phone_number" type="Boolean" description="*Optional*. Pass *True* if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_email" type="Boolean" description="*Optional*. Pass *True* if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="need_shipping_address" type="Boolean" description="*Optional*. Pass *True* if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="send_phone_number_to_provider" type="Boolean" description="*Optional*. Pass *True* if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="send_email_to_provider" type="Boolean" description="*Optional*. Pass *True* if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="is_flexible" type="Boolean" description="*Optional*. Pass *True* if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
