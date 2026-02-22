---
title: Session Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "Implement persistent data storage for your Telegram bot users with the GramIO session plugin, with optional lazy loading, custom keys, and any storage adapter."

    - - meta
      - name: "keywords"
        content: "Telegram bot, GramIO, session plugin, user data storage, persistent state, Redis integration, session management, lazy session, getSessionKey, session clearing, user preferences, context storage, stateful bots, user settings, memory adapters, data persistence, session middleware, storage adapters, TypeScript, Deno, Bun, Node.js"
---

# Session Plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/session?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/session)
[![JSR](https://jsr.io/badges/@gramio/session)](https://jsr.io/@gramio/session)
[![JSR Score](https://jsr.io/badges/@gramio/session/score)](https://jsr.io/@gramio/session)

</div>

Session plugin for GramIO.

### Installation

::: code-group

```bash [npm]
npm install @gramio/session
```

```bash [yarn]
yarn add @gramio/session
```

```bash [pnpm]
pnpm add @gramio/session
```

```bash [bun]
bun install @gramio/session
```

:::

## Usage

```ts twoslash
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "sessionKey",
            initial: () => ({ apple: 1 }),
        })
    )
    .on("message", (context) => {
        context.send(`apple count is ${++context.sessionKey.apple}`);
        //                                        ^?
    })
    .onStart(console.log);

bot.start();
```

You can use this plugin with any storage ([Read more](/storages))

### Redis example

[More info](https://github.com/gramiojs/storages/tree/master/packages/redis)

```ts
import { Bot } from "gramio";
import { session } from "@gramio/session";
import { redisStorage } from "@gramio/storage-redis";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "sessionKey",
            initial: () => ({ apple: 1 }),
            storage: redisStorage(),
        })
    )
    .on("message", (context) => {
        context.send(`apple count is ${++context.sessionKey.apple}`);
    })
    .onStart(console.log);

bot.start();
```

## Lazy Sessions

By default the session is loaded from storage on every update, even if the handler never reads it. Enabling `lazy: true` defers the load until the session is actually accessed, which can significantly reduce unnecessary storage reads on high-traffic bots.

```ts
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "sessionKey",
            lazy: true,
            initial: () => ({ count: 0 }),
        })
    )
    .on("message", async (context) => {
        // Storage is not read until here:
        const s = await context.sessionKey;
        s.count++;
        await context.send(`count: ${s.count}`);
    });
```

In lazy mode `context.sessionKey` is a `Promise` — always `await` it before accessing data.

## Session Clearing

Call `$clear()` on the session object to delete it from storage and reset to the initial state on the next access.

```ts
bot.on("message", async (context) => {
    if (context.text === "/reset") {
        await context.sessionKey.$clear();
    }
});
```

In lazy mode, resolve the promise first:

```ts
bot.on("message", async (context) => {
    if (context.text === "/reset") {
        const s = await context.sessionKey;
        await s.$clear();
    }
});
```

## Custom Session Keys

Sessions are keyed by `senderId` by default. Use `getSessionKey` to change the scoping strategy.

```ts
// Per-chat session
session({
    getSessionKey: (ctx) => `chat:${ctx.chatId}`,
    initial: () => ({ topic: "" }),
})

// Per-user-per-chat session
session({
    getSessionKey: (ctx) => `${ctx.senderId}:${ctx.chatId}`,
    initial: () => ({ preferences: {} }),
})
```

## TypeScript

Session data is automatically typed from the `initial` return type. You can also pass an explicit interface.

```ts
interface MySessionData {
    apple: number;
    some?: "maybe-empty";
}

// Eager mode — ctx.sessionKey: MySessionData & { $clear(): Promise<void> }
bot.extend(
    session({
        key: "sessionKey",
        initial: (): MySessionData => ({ apple: 1 }),
    })
);

// Lazy mode — ctx.sessionKey: Promise<MySessionData & { $clear(): Promise<void> }>
bot.extend(
    session({
        key: "sessionKey",
        lazy: true,
        initial: (): MySessionData => ({ apple: 1 }),
    })
);
```
