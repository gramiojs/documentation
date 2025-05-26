---
title: Прием платежей через Telegram Stars в GramIO - Руководство

head:
    - - meta
      - name: "description"
        content: "Полное руководство по реализации платежей через Telegram Stars в вашем боте на GramIO. Научитесь обрабатывать транзакции, создавать счета, управлять платежами и соблюдать политики Telegram."

    - - meta
      - name: "keywords"
        content: "telegram бот, gramio, telegram stars, платежи в ботах, цифровые товары, api платежей telegram, stars payments, обработка платежей в gramio, инвойсы в telegram, pre checkout query, споры по платежам, возвраты stars"
---

# Платежи через Telegram Stars в GramIO

> [Официальная документация Telegram](https://core.telegram.org/bots/payments-stars)

Telegram Stars - виртуальная валюта для покупки цифровых товаров и услуг прямо в ботах. Это руководство покажет, как реализовать прием Stars в вашем боте на GramIO.

## Обзор реализации

### 1. Создание обработчика платежей

```typescript
bot.command("buy", async (context) => {
    const invoice = await context.bot.api.sendInvoice({
        chat_id: context.chat.id,
        title: "Премиум подписка",
        description: "1 месяц премиум-функций",
        payload: "sub_123",
        currency: "XTR",
        prices: [{ label: "1 Месяц", amount: 500 }], // 500 Stars = $5
    });

    return context.send("Счет создан!");
});
```

### 2. Обработка pre-checkout запросов

```typescript
bot.on("pre_checkout_query", async (context) => {
    // Проверка наличия товара/услуги
    // answerPreCheckoutQuery
    return context.answer({
        ok: true,
    });
});
```

### 3. Обработка успешных платежей

```typescript
bot.on("successful_payment", async (context) => {
    await context.send("Платеж получен! Доставляем товар...");
    // Логика доставки цифрового товара
});
```

## Ключевые детали реализации

### Создание инвойсов

#### Кнопка оплаты

```typescript
// Подстроки "⭐" и "XTR" будут заменены на иконку Telegram Stars
const keyboard = new InlineKeyboard().pay("XTR Купить сейчас");

context.send("Премиум функции", {
    reply_markup: keyboard,
    // ... другие параметры сообщения
});
```

#### Ссылка для оплаты

```ts
const link = await context.bot.api.createInvoiceLink({
    title: "Премиум подписка",
    description: "1 месяц премиум-функций",
    payload: "sub_123",
    currency: "XTR",
    subscription_period: 2592000, // 30 дней в секундах
    prices: [{ label: "1 Месяц", amount: 500 }],
});
```

### Инвойсы в inline-режиме

```ts
context.answer(
    [
        InlineQueryResult.article(
            "id-1",
            "Премиум подписка",
            InputMessageContent.invoice({
                title: "Премиум подписка",
                description: "1 месяц премиум-функций",
                payload: "sub_123",
                currency: "XTR",
                prices: [{ label: "1 Месяц", amount: 500 }],
            })
        ),
    ],
    {
        cache_time: 0,
    }
);
```

### Тестирование платежей

Активируйте тестовый режим в конфигурации GramIO:

```typescript
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        useTest: true, // Используем тестовое окружение Telegram
    },
});
```

### Обработка возвратов

Реализация возврата средств:

```typescript
bot.command("refund", async (context) => {
    const result = await context.api.refundStarPayment({
        user_id: context.from.id,
        telegram_payment_charge_id: paymentId,
    });
});
```

> Актуальные курсы валют смотрите в [официальной документации Telegram](https://core.telegram.org/bots/payments)

[Узнать о монетизации](https://promote.telegram.org/)
