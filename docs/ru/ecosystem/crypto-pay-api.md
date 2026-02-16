---
title: Crypto Pay API - TypeScript-клиент для платежей Crypto Bot

head:
    - - meta
      - name: "description"
        content: "Полностью типизированный TypeScript-клиент для Crypto Pay (Crypto Bot) API. Создание инвойсов, переводов и чеков с поддержкой вебхуков для 8 веб-фреймворков."

    - - meta
      - name: "keywords"
        content: "Crypto Pay API, Crypto Bot API, Telegram платежи крипта, криптовалютные инвойсы, USDT платежи Telegram, TON платежи, BTC платежи бот, крипто перевод API, вебхук крипто платежи, TypeScript крипто API, gramio экосистема, Telegram бот платежи, создание инвойсов API, крипто чек ваучер"
---

# Crypto Pay API

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/crypto-pay-api?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/crypto-pay-api)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/crypto-pay-api?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/crypto-pay-api)
[![JSR](https://jsr.io/badges/@gramio/crypto-pay-api)](https://jsr.io/@gramio/crypto-pay-api)
[![JSR Score](https://jsr.io/badges/@gramio/crypto-pay-api/score)](https://jsr.io/@gramio/crypto-pay-api)

</div>

Полностью типизированный TypeScript-клиент для [Crypto Pay (Crypto Bot) API](https://help.crypt.bot/crypto-pay-api). Создание и управление криптовалютными инвойсами, переводами и чеками с поддержкой вебхуков для **8 веб-фреймворков**.

Работает на **Node.js**, **Bun** и **Deno**.

## Установка

::: code-group

```bash [npm]
npm install @gramio/crypto-pay-api
```

```bash [yarn]
yarn add @gramio/crypto-pay-api
```

```bash [pnpm]
pnpm add @gramio/crypto-pay-api
```

```bash [bun]
bun install @gramio/crypto-pay-api
```

:::

## Быстрый старт

```ts
import { CryptoPayAPI, webhookHandler } from "@gramio/crypto-pay-api";

const api = new CryptoPayAPI("your-api-key", "testnet");

// Слушаем оплаченные инвойсы
api.on("invoice_paid", ({ payload: invoice }) => {
    console.log(invoice.amount, invoice.payload);
});

// Создаём инвойс
const invoice = await api.createInvoice({
    amount: "100",
    asset: "USDT",
});
console.log(invoice.bot_invoice_url);

// Запускаем вебхук-сервер (пример для Bun)
Bun.serve({
    routes: {
        "/webhook": {
            POST: webhookHandler(api, "Bun.serve"),
        },
    },
});
```

## Конструктор

```ts
import { CryptoPayAPI } from "@gramio/crypto-pay-api";

// Mainnet (по умолчанию)
const api = new CryptoPayAPI("your-api-key");

// Testnet (получите токен у @CryptoTestnetBot)
const api = new CryptoPayAPI("your-api-key", "testnet");
```

## Методы

### `getMe`

Проверка аутентификации и получение информации о приложении.

```ts
const me = await api.getMe();
// { app_id: number, name: string, bot_username: string }
```

### `createInvoice`

Создание платёжного запроса.

```ts
const invoice = await api.createInvoice({
    amount: "100",
    asset: "USDT",
    description: "Premium subscription",
    payload: "user_123_premium",
    paid_btn_name: "openBot",
    paid_btn_url: "https://t.me/YourBot",
    // Опционально:
    // currency_type: "fiat",
    // fiat: "USD",
    // accepted_assets: ["USDT", "TON"],
    // allow_comments: true,
    // allow_anonymous: true,
    // expires_in: 3600,
});

console.log(invoice.bot_invoice_url); // отправьте пользователю
```

### `createCheck`

Создание крипто-чека (ваучера), который другой пользователь может активировать.

```ts
const check = await api.createCheck({
    asset: "TON",
    amount: "5",
});
console.log(check.bot_check_url); // поделитесь с получателем
```

### `transfer`

Перевод средств пользователю Telegram.

```ts
const transfer = await api.transfer({
    user_id: "123456789",
    asset: "USDT",
    amount: "10",
    spend_id: "unique_transfer_001",
    comment: "Contest prize",
});
```

### `getInvoices`

Получение инвойсов с фильтрацией.

```ts
const invoices = await api.getInvoices({
    status: "paid",
    offset: 0,
    count: 10,
});
```

### `getBalance`

Получение текущих балансов кошелька приложения.

```ts
const balances = await api.getBalance();
// [{ currency_code: "USDT", available: "100.50", onhold: "0" }, ...]
```

### `getExchangeRates`

Получение текущих курсов обмена.

```ts
const rates = await api.getExchangeRates();
```

### `getStats`

Получение агрегированной статистики приложения.

```ts
const stats = await api.getStats({
    start_at: "2025-01-01T00:00:00Z",
});
// { volume, conversion, unique_users_count, ... }
```

### `deleteInvoice` / `deleteCheck`

```ts
await api.deleteInvoice({ invoice_ids: [123, 456] });
await api.deleteCheck({ check_ids: [789] });
```

## Вебхуки

Регистрируйте обработчики событий и используйте `webhookHandler` с вашим веб-фреймворком.

```ts
api.on("invoice_paid", ({ payload: invoice }) => {
    console.log(`Invoice ${invoice.invoice_id} paid!`);
    console.log(`Amount: ${invoice.paid_amount} ${invoice.paid_asset}`);
});
```

### Поддерживаемые фреймворки

| Фреймворк | Ключ адаптера |
|---|---|
| Bun.serve | `"Bun.serve"` |
| Elysia | `"elysia"` |
| Fastify | `"fastify"` |
| Hono | `"hono"` |
| Express | `"express"` |
| Koa | `"koa"` |
| Node.js HTTP | `"http"` |
| Deno std/http | `"std/http"` |

### Примеры

::: code-group

```ts [Bun.serve]
Bun.serve({
    routes: {
        "/webhook": {
            POST: webhookHandler(api, "Bun.serve"),
        },
    },
});
```

```ts [Express]
import express from "express";

const app = express();
app.use(express.json());
app.post("/webhook", webhookHandler(api, "express"));
app.listen(3000);
```

```ts [Hono]
import { Hono } from "hono";

const app = new Hono();
app.post("/webhook", webhookHandler(api, "hono"));
```

```ts [Fastify]
import Fastify from "fastify";

const fastify = Fastify();
fastify.post("/webhook", webhookHandler(api, "fastify"));
fastify.listen({ port: 3000 });
```

```ts [Node.js HTTP]
import http from "node:http";

const handler = webhookHandler(api, "http");

http.createServer((req, res) => {
    if (req.url === "/webhook" && req.method === "POST") {
        handler(req, res);
    }
}).listen(3000);
```

```ts [Deno]
Deno.serve((req) => {
    if (new URL(req.url).pathname === "/webhook") {
        return webhookHandler(api, "std/http")(req);
    }
    return new Response("Not found", { status: 404 });
});
```

:::

## Поддерживаемые активы

`USDT` | `TON` | `BTC` | `ETH` | `LTC` | `BNB` | `TRX` | `USDC` | `JET`
