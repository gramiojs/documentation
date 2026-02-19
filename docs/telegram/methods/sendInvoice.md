---
title: sendInvoice — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendInvoice Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendInvoice, telegram bot api, gramio sendInvoice, sendInvoice typescript, sendInvoice example
---

# sendInvoice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendinvoice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send invoices. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="title" type="String" required description="Product name, 1-32 characters" />

<ApiParam name="description" type="String" required description="Product description, 1-255 characters" />

<ApiParam name="payload" type="String" required description="Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes." />

<ApiParam name="provider_token" type="String" required description="Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="prices" type="LabeledPrice[]" required description="Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90)." />

<ApiParam name="max_tip_amount" type="Integer" required description="The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90)." :max="1" />

<ApiParam name="suggested_tip_amounts" type="Integer[]" required description="A JSON-serialized array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_." />

<ApiParam name="start_parameter" type="String" required description="Unique deep-linking parameter. If left empty, **forwarded copies** of the sent message will have a _Pay_ button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a _URL_ button with a deep link to the bot (instead of a _Pay_ button), with the value used as the start parameter" />

<ApiParam name="provider_data" type="String" required description="JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider." />

<ApiParam name="photo_url" type="String" required description="URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for." />

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

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" required description="Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" required description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" required description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" required description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Pay `total price`' button will be shown. If not empty, the first button must be a Pay button." />

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
