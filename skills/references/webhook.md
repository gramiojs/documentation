---
name: webhook
description: Webhook setup with various frameworks (Elysia, Fastify, Hono, Express, Koa, Bun.serve, Deno.serve), tunneling for development, and custom update handling.
---

# Webhook

## Built-in Webhook

```typescript
bot.start({
    webhook: {
        url: "https://example.com/webhook",
        path: "/webhook",   // optional, default "/"
        port: 3000,         // optional
    },
});
```

## Framework Integration

GramIO provides `webhookHandler` for popular frameworks:

```typescript
import { Bot, webhookHandler } from "gramio";

// Elysia
import { Elysia } from "elysia";
new Elysia()
    .post("/webhook", webhookHandler(bot, "elysia"))
    .listen(3000);

// Fastify
import Fastify from "fastify";
const app = Fastify();
app.post("/webhook", webhookHandler(bot, "fastify"));
app.listen({ port: 3000, host: "::" });

// Hono
import { Hono } from "hono";
const app = new Hono();
app.post("/webhook", webhookHandler(bot, "hono"));

// Express
import express from "express";
const app = express();
app.use(express.json());
app.post("/webhook", webhookHandler(bot, "express"));

// Koa
import Koa from "koa";
const app = new Koa();
app.use(webhookHandler(bot, "koa"));

// node:http
import { createServer } from "node:http";
createServer(webhookHandler(bot, "node")).listen(3000);

// Bun.serve
Bun.serve({ fetch: webhookHandler(bot, "Bun.serve") });

// Deno.serve
Deno.serve(webhookHandler(bot, "std/http"));
```

Always call `bot.start()` with webhook option:

```typescript
bot.start({
    webhook: { url: `https://example.com/${process.env.BOT_TOKEN}` },
});
```

## Webhook Only in Production

```typescript
await bot.start({
    webhook: process.env.NODE_ENV === "production"
        ? { url: `${process.env.API_URL}/${process.env.BOT_TOKEN}` }
        : undefined, // falls back to long polling in dev
});
```

## Local Dev with Tunnel

```typescript
import { startTunnel } from "untun";

const tunnel = await startTunnel({ port: 3000 });
bot.start({
    webhook: { url: await tunnel.getURL() },
});
```

## Custom Update Handling

For frameworks not listed, handle raw updates:

```typescript
await bot.init(); // Required: loads plugins + bot info
await bot.updates.handleUpdate(requestBody); // requestBody is the Telegram Update JSON
```

## Pre-configured Webhook

If webhook is already set via `setWebhook`:

```typescript
bot.start({ webhook: true }); // does NOT call setWebhook
```

<!--
Source: https://gramio.dev/updates/webhook
-->
