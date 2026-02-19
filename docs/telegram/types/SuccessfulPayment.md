---
title: SuccessfulPayment — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SuccessfulPayment Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SuccessfulPayment, telegram bot api types, gramio SuccessfulPayment, SuccessfulPayment object, SuccessfulPayment typescript
---

# SuccessfulPayment

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#successfulpayment" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains basic information about a successful payment. Note that if the buyer initiates a chargeback with the relevant payment provider following this transaction, the funds may be debited from your balance. This is outside of Telegram's control.

## Fields

<ApiParam name="currency" type="String" required description="Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90)" />

<ApiParam name="total_amount" type="Integer" required description="Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies)." />

<ApiParam name="invoice_payload" type="String" required description="Bot-specified invoice payload" />

<ApiParam name="subscription_expiration_date" type="Integer" description="_Optional_. Expiration date of the subscription, in Unix time; for recurring payments only" />

<ApiParam name="is_recurring" type="Boolean" description="_Optional_. _True_, if the payment is a recurring payment for a subscription" />

<ApiParam name="is_first_recurring" type="Boolean" description="_Optional_. _True_, if the payment is the first payment for a subscription" />

<ApiParam name="shipping_option_id" type="String" description="_Optional_. Identifier of the shipping option chosen by the user" />

<ApiParam name="order_info" type="OrderInfo" description="_Optional_. Order information provided by the user" />

<ApiParam name="telegram_payment_charge_id" type="String" required description="Telegram payment identifier" />

<ApiParam name="provider_payment_charge_id" type="String" required description="Provider payment identifier" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
