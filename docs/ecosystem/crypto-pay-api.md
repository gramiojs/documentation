---
title: Crypto Pay API - TypeScript Client for Crypto Bot Payments

head:
    - - meta
      - name: "description"
        content: "Fully-typed TypeScript client for the Crypto Pay (Crypto Bot) API. Create invoices, transfers, and checks with webhook support for 8 web frameworks."

    - - meta
      - name: "keywords"
        content: "Crypto Pay API, Crypto Bot API, Telegram payments crypto, cryptocurrency invoices, USDT payments Telegram, TON payments, BTC payments bot, crypto transfer API, webhook crypto payments, TypeScript crypto API, gramio ecosystem, Telegram bot payments, invoice creation API, crypto check voucher"
---

# Crypto Pay API

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/crypto-pay-api?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/crypto-pay-api)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/crypto-pay-api?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/crypto-pay-api)
[![JSR](https://jsr.io/badges/@gramio/crypto-pay-api)](https://jsr.io/@gramio/crypto-pay-api)
[![JSR Score](https://jsr.io/badges/@gramio/crypto-pay-api/score)](https://jsr.io/@gramio/crypto-pay-api)

</div>

Fully-typed TypeScript client for the [Crypto Pay (Crypto Bot) API](https://help.crypt.bot/crypto-pay-api). Create and manage cryptocurrency invoices, transfers, and checks with webhook support for **8 web frameworks**.

Works on **Node.js**, **Bun**, and **Deno**.

## Installation

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

## Quick start

```ts
import { CryptoPayAPI, webhookHandler } from "@gramio/crypto-pay-api";

const api = new CryptoPayAPI("your-api-key", "testnet");

// Listen for paid invoices
api.on("invoice_paid", ({ payload: invoice }) => {
    console.log(invoice.amount, invoice.payload);
});

// Create an invoice
const invoice = await api.createInvoice({
    amount: "100",
    asset: "USDT",
});
console.log(invoice.bot_invoice_url);

// Start webhook server (Bun example)
Bun.serve({
    routes: {
        "/webhook": {
            POST: webhookHandler(api, "Bun.serve"),
        },
    },
});
```

## Constructor

```ts
import { CryptoPayAPI } from "@gramio/crypto-pay-api";

// Mainnet (default)
const api = new CryptoPayAPI("your-api-key");

// Testnet (get token from @CryptoTestnetBot)
const api = new CryptoPayAPI("your-api-key", "testnet");
```

## Methods

### `getMe`

Test authentication and get app info.

```ts
const me = await api.getMe();
// { app_id: number, name: string, bot_username: string }
```

### `createInvoice`

Create a payment request.

```ts
const invoice = await api.createInvoice({
    amount: "100",
    asset: "USDT",
    description: "Premium subscription",
    payload: "user_123_premium",
    paid_btn_name: "openBot",
    paid_btn_url: "https://t.me/YourBot",
    // Optional:
    // currency_type: "fiat",
    // fiat: "USD",
    // accepted_assets: ["USDT", "TON"],
    // allow_comments: true,
    // allow_anonymous: true,
    // expires_in: 3600,
});

console.log(invoice.bot_invoice_url); // send to user
```

### `createCheck`

Create a crypto check (voucher) another user can redeem.

```ts
const check = await api.createCheck({
    asset: "TON",
    amount: "5",
});
console.log(check.bot_check_url); // share with recipient
```

### `transfer`

Transfer funds to a Telegram user.

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

Retrieve invoices with optional filtering.

```ts
const invoices = await api.getInvoices({
    status: "paid",
    offset: 0,
    count: 10,
});
```

### `getBalance`

Get current app wallet balances.

```ts
const balances = await api.getBalance();
// [{ currency_code: "USDT", available: "100.50", onhold: "0" }, ...]
```

### `getExchangeRates`

Get current exchange rates.

```ts
const rates = await api.getExchangeRates();
```

### `getStats`

Get aggregated app statistics.

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

## Webhooks

Register event listeners and use `webhookHandler` with your web framework.

```ts
api.on("invoice_paid", ({ payload: invoice }) => {
    console.log(`Invoice ${invoice.invoice_id} paid!`);
    console.log(`Amount: ${invoice.paid_amount} ${invoice.paid_asset}`);
});
```

### Supported frameworks

| Framework | Adapter key |
|---|---|
| Bun.serve | `"Bun.serve"` |
| Elysia | `"elysia"` |
| Fastify | `"fastify"` |
| Hono | `"hono"` |
| Express | `"express"` |
| Koa | `"koa"` |
| Node.js HTTP | `"http"` |
| Deno std/http | `"std/http"` |

### Examples

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

## Supported assets

`USDT` | `TON` | `BTC` | `ETH` | `LTC` | `BNB` | `TRX` | `USDC` | `JET`
