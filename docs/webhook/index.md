---
title: How to use webhook with Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "Telegram Bot API support two ways of getting updates: long-polling and webhook."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, webhook, express, hono, fastify, elysia, long-polling, http, std/http, Bun.serve, Deno.serve"
---

# How to use webhook

Telegram Bot API support two ways of getting updates: [long-polling](https://en.wikipedia.org/wiki/Push_technology#Long_polling) and [webhook](https://en.wikipedia.org/wiki/Webhook?useskin=vector). GramIO works well with both.

Here is an example of using webhooks

## Supported frameworks

-   [Elysia](https://elysiajs.com/)
-   [Fastify](https://fastify.dev/)
-   [Hono](https://hono.dev/)
-   [Express](https://expressjs.com/)
-   [Koa](https://koajs.com/)
-   [node:http](https://nodejs.org/api/http.html)
-   [Bun.serve](https://bun.sh/docs/api/http)
-   [std/http (Deno.serve)](https://docs.deno.com/runtime/manual/runtime/http_server_apis#http-server-apis)
-   [And any other framework](#write-you-own-updates-handler)

## Example

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

## Local development with webhook

For local development with webhook, we recommend using <a href="https://github.com/unjs/untun" target="_blank" rel="noopener noreferrer">
<img src="https://unjs.io/assets/logos/untun.svg" alt="untun Logo" width="24" height="24" style="vertical-align:middle; display: inline-block; margin-right: 5px;">unjs/untun</a>.

**Untun** is a tool for tunnel your **local** HTTP(s) server to the world!

> [!IMPORTANT]
> Examples of starting with a specific framework are omitted. See [this example](#example).

### via API

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

### via CLI

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

## Write you own updates handler

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
