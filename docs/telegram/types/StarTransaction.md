---
title: StarTransaction — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: StarTransaction Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: StarTransaction, telegram bot api types, gramio StarTransaction, StarTransaction object, StarTransaction typescript
---

# StarTransaction

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#startransaction" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a Telegram Star transaction. Note that if the buyer initiates a chargeback with the payment provider from whom they acquired Stars (e.g., Apple, Google) following this transaction, the refunded Stars will be deducted from the bot's balance. This is outside of Telegram's control.

## Fields

<ApiParam name="id" type="String" required description="Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with _SuccessfulPayment.telegram\_payment\_charge\_id_ for successful incoming payments from users." />

<ApiParam name="amount" type="Integer" required description="Integer amount of Telegram Stars transferred by the transaction" />

<ApiParam name="nanostar_amount" type="Integer" description="_Optional_. The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999" />

<ApiParam name="date" type="Integer" required description="Date the transaction was created in Unix time" />

<ApiParam name="source" type="TransactionPartner" description="_Optional_. Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions" />

<ApiParam name="receiver" type="TransactionPartner" description="_Optional_. Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
