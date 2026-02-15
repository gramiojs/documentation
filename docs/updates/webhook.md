---
title: Long Polling vs Webhook — How Telegram Bots Receive Updates

head:
    - - meta
      - name: "description"
        content: "Learn the difference between long polling and webhook for Telegram bots. Understand when to use each approach, scaling considerations, and how to configure webhook in GramIO."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, webhook, express, hono, fastify, elysia, long-polling, getUpdates, scaling, horizontal scaling, Kubernetes, load balancer, serverless, http, std/http, Bun.serve, Deno.serve"
---

# Long Polling vs Webhook

Telegram Bot API provides two ways for your bot to receive updates: **long polling** and **webhook**. Each approach has distinct trade-offs for development, performance, and scalability.

<PollingVsWebhook />

## How Long Polling Works

With long polling, your bot continuously calls the [`getUpdates`](https://core.telegram.org/bots/api#getupdates) method in a loop. Telegram holds the connection open until new updates are available (or a timeout is reached), then responds with them.

```
Bot                         Telegram
 │── getUpdates ──────────────►│
 │                             │ (waits for updates...)
 │◄─────────── [update] ───────│
 │── getUpdates ──────────────►│
 │                             │ (waits...)
 │◄─────────── [] ─────────────│  ← no updates
 │── getUpdates ──────────────►│
 ...
```

- Your bot initiates every request — Telegram never contacts your bot directly
- The `timeout` parameter controls how long Telegram holds the connection (default: 30, recommended: 25–30 seconds)
- No public URL or SSL certificate required
- Simple to run locally — just start the bot

In GramIO, long polling is the default behavior:

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("message", (context) => {
    return context.send("Hello!");
});

bot.start(); // ← uses long polling by default
```

## How Webhook Works

With webhook, you register an HTTPS URL with Telegram. When an update arrives, Telegram sends an HTTP POST request to that URL with the update payload.

```
Bot                         Telegram
 │                             │
 │    (idle — no traffic)      │
 │                             │
 │                             │ ← user sends message
 │◄──── POST /webhook ────────│
 │── 200 OK ──────────────────►│
 │                             │
 │    (idle — no traffic)      │
```

- Telegram pushes updates to your bot — no polling loop needed
- Requires a publicly accessible HTTPS URL with a valid SSL certificate
- Lower latency — updates arrive instantly, no waiting for the next poll cycle
- More efficient — no traffic when there are no updates

## Which to Choose?

### Development — Long Polling

Long polling is ideal for local development:

- **No domain or SSL needed** — works on `localhost` out of the box
- **Zero configuration** — just call `bot.start()`
- **Easy debugging** — restart the bot instantly, no tunnel setup
- **Firewall-friendly** — outbound connections only, no incoming ports to open

### Production — Webhook

Webhook is the recommended choice for production deployments:

- **Lower latency** — updates are pushed instantly, no poll interval delay
- **No idle connections** — no resources wasted when there are no updates
- **Horizontal scaling** — multiple server instances behind a load balancer
- **Serverless compatible** — works with Vercel, AWS Lambda, Cloudflare Workers, and similar platforms
- **Resource efficiency** — no background polling loop consuming CPU and memory

## Multiple Pods & Scaling

This is where the choice becomes critical.

### Long Polling: Single Instance Only

Telegram **rejects** concurrent `getUpdates` calls from the same bot token. If two processes poll at the same time, one gets a `409 Conflict` error. This means:

- You can only run **one** polling instance
- No horizontal scaling
- No Kubernetes replicas, no Docker Swarm services with `replicas > 1`
- If that single process crashes, updates are delayed until it restarts

### Webhook: Scale Horizontally

With webhook, Telegram sends updates to a **URL** — it doesn't care how many servers are behind it. This unlocks:

```
                  ┌─── Pod 1 (bot) ◄──┐
Telegram ──POST──►│ Load Balancer      │
                  ├─── Pod 2 (bot) ◄──┤
                  └─── Pod 3 (bot) ◄──┘
```

- **Load balancer** distributes incoming requests across pods
- Each pod processes a subset of updates independently
- Auto-scaling works naturally — add more pods as load increases
- Healthier deployments — zero-downtime rolling updates

> [!WARNING]
> When scaling with webhook, ensure your bot logic is stateless (or uses shared storage like Redis for sessions). Each update may arrive at a different pod.

## Comparison Table

| Feature | Long Polling | Webhook |
|---|---|---|
| Setup complexity | Minimal | Requires HTTPS URL + SSL |
| Public URL needed | No | Yes |
| Latency | Poll interval dependent | Instant push |
| Idle resource usage | Constant (polling loop) | Zero |
| Horizontal scaling | No (single instance) | Yes (load balancer) |
| Serverless support | No | Yes |
| Local development | Easy | Requires tunnel |
| Firewall issues | None (outbound only) | Must allow inbound HTTPS |

## Webhook Setup in GramIO

### Supported frameworks

-   [Elysia](https://elysiajs.com/)
-   [Fastify](https://fastify.dev/)
-   [Hono](https://hono.dev/)
-   [Express](https://expressjs.com/)
-   [Koa](https://koajs.com/)
-   [node:http](https://nodejs.org/api/http.html)
-   [Bun.serve](https://bun.sh/docs/api/http)
-   [std/http (Deno.serve)](https://docs.deno.com/runtime/manual/runtime/http_server_apis#http-server-apis)
-   [And any other framework](#write-you-own-updates-handler)

### Example

```ts
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/telegram-webhook", webhookHandler(bot, "fastify"));

fastify.listen({ port: 3445, host: "::" });

bot.on("message", (context) => {
    return context.send("Fastify!");
});

bot.start({
    webhook: {
        url: "https://example.com:3445/telegram-webhook",
    },
});
```

### Use webhook only in production

Instead of use a tunnels, you can just use polling in development environment!

```ts
const bot = new Bot(process.env.BOT_TOKEN);

await bot.start({
    webhook:
        process.env.NODE_ENV === "production"
            ? {
                  url: `${process.env.API_URL}/${process.env.BOT_TOKEN}`,
              }
            : undefined,
});
```

When `webhook` is `undefined`, GramIO falls back to long polling automatically.

### Local development with webhook

For local development with webhook, we recommend using <a href="https://github.com/unjs/untun" target="_blank" rel="noopener noreferrer">
<img src="https://unjs.io/assets/logos/untun.svg" alt="untun Logo" width="24" height="24" style="vertical-align:middle; display: inline-block; margin-right: 5px;">unjs/untun</a>.

**Untun** is a tool for tunnel your **local** HTTP(s) server to the world!

> [!IMPORTANT]
> Examples of starting with a specific framework are omitted. See [this example](#example).

#### via API

This method allows you to set a link to our tunnel directly in the script.

Install package:

::: code-group

```bash [npm]
npm install untun
```

```bash [yarn]
yarn add untun
```

```bash [pnpm]
pnpm install untun
```

```bash [bun]
bun install untun
```

:::

Start tunnel and set webhook:

```ts
import { startTunnel } from "untun";

const tunnel = await startTunnel({ port: 3000 });

bot.start({
    webhook: {
        url: await tunnel.getURL(),
    },
});
```

#### via CLI

We are listening to port `3000` locally. Therefore, we open the tunnel like this:

::: code-group

```bash [npm]
npx untun@latest tunnel http://localhost:3000
```

```bash [yarn]
yarn dlx untun@latest tunnel http://localhost:3000
```

```bash [pnpm]
pnpm dlx untun@latest tunnel http://localhost:3000
```

```bash [bun]
bunx untun@latest tunnel http://localhost:3000
```

:::

```bash
◐ Starting cloudflared tunnel to http://localhost:3000
ℹ Waiting for tunnel URL...
✔ Tunnel ready at https://unjs-is-awesome.trycloudflare.com
```

Now we use this link when installing the webhook:

```ts
bot.start({
    webhook: {
        url: "https://unjs-is-awesome.trycloudflare.com",
    },
});
```

### Write you own updates handler

```ts
// a non-existing framework for the example
import { App } from "some-http-framework";
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).on("message", (context) =>
    context.send("Hello!")
);

// init is required. It is used for lazy-load plugins, and also receives information about the bot.
await bot.init();

const app = new App().post("/telegram", async (req) => {
    // req.body must be json equivalent to TelegramUpdate
    await bot.updates.handleUpdate(req.body);
});

app.listen(80);
```
