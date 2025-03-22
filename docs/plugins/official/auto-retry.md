---
title: Auto retry Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "A plugin that catches errors with the retry_after field (rate limit errors), waits for the specified time and repeats the API request."

    - - meta
      - name: "keywords"
        content: "Telegram bot, GramIO, auto retry plugin, rate limiting, error handling, 429 errors, retry_after, too many requests, API throttling, automatic retries, bot reliability, error recovery, request management, flood control, API stabilization, TypeScript, Deno, Bun, Node.js"
---

# Auto retry plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/auto-retry?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/auto-retry)
[![JSR](https://jsr.io/badges/@gramio/auto-retry)](https://jsr.io/@gramio/auto-retry)
[![JSR Score](https://jsr.io/badges/@gramio/auto-retry/score)](https://jsr.io/@gramio/auto-retry)

</div>

A plugin that catches errors with the `retry_after` field (**rate limit** errors), **waits** for the specified time and **repeats** the API request.

### Installation

::: code-group

```bash [npm]
npm install @gramio/auto-retry
```

```bash [yarn]
yarn add @gramio/auto-retry
```

```bash [pnpm]
pnpm add @gramio/auto-retry
```

```bash [bun]
bun install @gramio/auto-retry
```

:::

### Usage

```ts
import { Bot } from "gramio";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(autoRetry())
    .command("start", async (context) => {
        for (let index = 0; index < 100; index++) {
            await context.reply(`some ${index}`);
        }
    })
    .onStart(console.log);

bot.start();
```
