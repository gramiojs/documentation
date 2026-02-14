---
name: telegram-stars
description: Telegram Stars payments — sendInvoice with XTR currency, pay button, pre_checkout_query, successful_payment, subscription invoices, inline query invoices, refunds, and test mode.
---

# Telegram Stars Payments

Telegram Stars (`XTR`) is an in-app currency for digital goods. Currency must always be `"XTR"`.

## Send Invoice

```typescript
bot.command("buy", async (context) => {
    await context.bot.api.sendInvoice({
        chat_id: context.chat.id,
        title: "Premium Subscription",
        description: "1 month of premium features",
        payload: "sub_premium_1month",
        currency: "XTR",
        prices: [{ label: "1 Month Premium", amount: 500 }], // 500 Stars
    });
});
```

## Pay Button

Substrings `"⭐"` and `"XTR"` in the button text are replaced with the Star icon:

```typescript
const keyboard = new InlineKeyboard().pay("XTR Buy Now");
```

## Pre-Checkout Query

Must answer within 10 seconds:

```typescript
bot.on("pre_checkout_query", (context) => {
    return context.answer(true);
    // Reject: context.answer(false, { error_message: "Out of stock" });
});
```

## Successful Payment

```typescript
bot.on("successful_payment", async (context) => {
    const payment = context.event.successful_payment!;
    console.log(`Received ${payment.total_amount} Stars, payload: ${payment.invoice_payload}`);
});
```

## Invoice Link (Subscriptions)

Use `subscription_period` (seconds) for recurring payments — 2592000 = 30 days:

```typescript
const link = await bot.api.createInvoiceLink({
    title: "Monthly Plan",
    description: "Auto-renewing premium",
    payload: "sub_monthly",
    currency: "XTR",
    subscription_period: 2592000,
    prices: [{ label: "Monthly", amount: 500 }],
});
```

## Inline Query Invoice

Send invoices via inline mode:

```typescript
import { InlineQueryResult, InputMessageContent } from "gramio";

bot.on("inline_query", (context) => {
    return context.answer(
        [
            InlineQueryResult.article(
                "id-1",
                "Premium Subscription",
                InputMessageContent.invoice({
                    title: "Premium Subscription",
                    description: "1 month premium",
                    payload: "sub_inline",
                    currency: "XTR",
                    prices: [{ label: "1 Month", amount: 500 }],
                })
            ),
        ],
        { cache_time: 0 }
    );
});
```

## Refund

```typescript
await bot.api.refundStarPayment({
    user_id: userId,
    telegram_payment_charge_id: chargeId,
});
```

## Test Mode

Enable test environment to use test Stars:

```typescript
const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: { useTest: true },
});
```

<!--
Source: https://gramio.dev/guides/telegram-stars
-->
