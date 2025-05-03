---
title: Telegram Stars Payments Guide with GramIO - Accept Digital Goods Payments

head:
    - - meta
      - name: "description"
        content: "Complete guide to implementing Telegram Stars payments in your GramIO bot. Learn to handle digital goods transactions, create invoices, process payments, and comply with Telegram's policies."

    - - meta
      - name: "keywords"
        content: "telegram bot, gramio, telegram stars, bot payments, digital goods, telegram payments api, stars payments, gramio payment handling, telegram invoice, pre checkout query, payment disputes, stars refunds"
---

# Telegram Stars Payments in GramIO

> [Official Telegram Documentation](https://core.telegram.org/bots/payments-stars)

Telegram Stars is an in-app virtual currency that allows users to purchase digital goods and services directly in bots. This guide will show you how to implement Stars payments in your GramIO bot.

## Implementation Overview

### 1. Create Payment Handler

```typescript
bot.command("buy", async (context) => {
    const invoice = await context.bot.api.sendInvoice({
        chat_id: context.chat.id,
        title: "Premium Subscription",
        description: "1 month of premium features",
        payload: "sub_123",
        currency: "XTR",
        prices: [{ label: "1 Month", amount: 500 }], // 500 Stars = $5
    });

    return context.send("Invoice created!");
});
```

### 2. Handle Pre-Checkout Queries

```typescript
bot.on("pre_checkout_query", async (context) => {
    // Validate inventory/availability here
    await context.bot.api.answerPreCheckoutQuery({
        pre_checkout_query_id: context.id,
        ok: true,
    });
});
```

### 3. Process Successful Payments

```typescript
bot.on("successful_payment", async (context) => {
    await context.send("Payment received! Delivering goods...");
    // Implement your delivery logic here
});
```

## Key Implementation Details

### Creating Invoices

#### Pay Button

```typescript
// Substrings “⭐” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.
const keyboard = new InlineKeyboard().pay("XTR Buy Now");

context.send("Premium Features", {
    reply_markup: keyboard,
    // ... other message parameters
});
```

#### Link

```ts
const link = await context.bot.api.createInvoiceLink({
    title: "Premium Subscription",
    description: "1 month of premium features",
    payload: "sub_123",
    currency: "XTR",
    subscription_period: 2592000,
    prices: [{ label: "1 Month", amount: 500 }], // 500 Stars = $5
});
```

### Inline Query Message

```ts
context.anser(
    [
        InlineQueryResult.article(
            "id-1",
            "Premium Subscription",
            InputMessageContent.invoice({
                title: "Premium Subscription",
                description: "1 month of premium features",
                payload: "sub_123",
                currency: "XTR",
                prices: [{ label: "1 Month", amount: 500 }], // 500 Stars = $5
            })
        ),
    ],
    {
        cache_time: 0,
    }
);
```

### Testing Payments

Enable test environment:

```typescript
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        useTest: true, // Use Telegram's test environment
    },
});
```

### Handling Disputes

Implement refund logic using Telegram's API:

```typescript
bot.command("refund", async (context) => {
    const result = await context.api.refundStarPayment({
        user_id: context.from.id,
        telegram_payment_charge_id: paymentId,
    });
});
```

> Always check current rates in [Telegram's official documentation](https://core.telegram.org/bots/payments)

[Learn more about monetization](https://promote.telegram.org/)
