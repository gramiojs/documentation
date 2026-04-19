---
name: context
description: Context injection with derive (scoped/global) and decorate, middleware with next(), type narrowing with context.is(), camelCase getters (never ctx.payload), and bot.start()/stop() options.
---

# Context & Updates

## Context Properties — camelCase Getters (IMPORTANT)

All context (`ctx`) properties are exposed as **camelCase getters** that mirror the Telegram API fields. **Never access `ctx.payload` OR `ctx.update.*` directly** — both are raw snake_case internal objects (the first is the update's inner payload, the second is the wrapping Telegram update). Always use the typed camelCase getters instead.

```typescript
// ✅ Correct — use camelCase getters
bot.on("message", (ctx) => {
    ctx.id;           // message_id
    ctx.from;         // TelegramUser (camelCase inside too)
    ctx.from?.id;
    ctx.from?.firstName;     // first_name
    ctx.from?.lastName;      // last_name
    ctx.from?.isBot;         // is_bot
    ctx.chat.id;
    ctx.text;
    ctx.date;
    ctx.chatId;              // shortcut for ctx.chat.id
    ctx.senderId;            // shortcut for ctx.from?.id
});

// ❌ Wrong — raw payload / update, avoid
bot.on("message", (ctx) => {
    ctx.payload.message_id;                // don't do this
    ctx.payload.from?.first_name;          // don't do this
    ctx.payload.chat.id;                   // don't do this
    ctx.update?.callback_query?.data;      // don't do this (raw snake_case)
    ctx.update?.message?.text;             // don't do this
});
```

The rule applies to **all** context types: `MessageContext`, `CallbackQueryContext`, `InlineQueryContext`, etc. Every field from the Telegram API is available as a camelCase getter on the context object.

```typescript
bot.callbackQuery("vote", (ctx) => {
    ctx.id;         // callback query id
    ctx.data;       // callback data string
    ctx.from.id;
    ctx.from.firstName;
    ctx.message?.id;
    ctx.chatInstance;  // chat_instance
});

bot.inlineQuery(/search/, (ctx) => {
    ctx.id;         // inline query id
    ctx.query;      // query string
    ctx.from.id;
    ctx.offset;
});
```

## bot.start() Options

```typescript
await bot.start({
    // Webhook mode
    webhook: {
        url: "https://example.com/webhook",
        path: "/webhook",
        port: 3000,
    },
    // OR use existing webhook
    webhook: true,

    // Long polling options
    longPolling: { timeout: 10 },

    // Common options
    dropPendingUpdates: true,
    allowedUpdates: ["message", "callback_query"],
    deleteWebhook: true, // or "on-conflict-with-polling" (default)
});
```

## bot.stop()

```typescript
await bot.stop();        // default 3000ms timeout
await bot.stop(5000);    // custom timeout
```

Stops polling/webhook, waits for pending updates, fires `onStop` hook.

## Middleware

```typescript
bot.use(async (context, next) => {
    console.log("Before handler");
    await next(); // pass to next middleware/handler
    console.log("After handler");
});
```

## Listening to Updates

```typescript
// Single type
bot.on("message", (context) => { /* MessageContext */ });

// Multiple types
bot.on(["message", "callback_query"], (context) => {
    // Union context — use .is() to narrow
});
```

## Context Injection: derive

Adds computed properties to context. Runs per-update.

```typescript
// Global — runs on every update
bot.derive((context) => ({
    timestamp: Date.now(),
}));

// Scoped — runs only for specific update types
bot.derive("message", async (context) => ({
    user: await findUser(context.from?.id),
}));

// Multi-scoped
bot.derive(["message", "callback_query"], (context) => ({
    fromId: context.from?.id,
}));
```

Scoped values are only available when the context matches:

```typescript
bot.derive("message", () => ({ messageExtra: true }));
bot.use((context) => {
    if (context.is("message")) {
        context.messageExtra; // typed, available
    }
    // context.messageExtra — NOT available outside is() check
});
```

## Context Injection: decorate

Adds static values (evaluated once, not per-update):

```typescript
bot.decorate("db", database);
bot.decorate("config", { maxRetries: 3 });
// Or batch:
bot.decorate({ db: database, config: { maxRetries: 3 } });

bot.command("test", (context) => {
    context.db;     // typed
    context.config; // typed
});
```

## Context Typing After derive/decorate (no `as unknown as` casts)

Every `.derive()` / `.decorate()` / `.extend(plugin)` call updates the inferred context type automatically. The right way to pass that enriched context into handlers defined in separate files is to **export the bot's context type** and consume it — never cast.

```typescript
// bot.ts
import { Bot } from "gramio";
import { authPlugin } from "./plugins/auth.js";

export const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(authPlugin)                       // derives { user: User, isAdmin: boolean }
    .decorate("db", db);

// Export a single source of truth for handler signatures
export type BotContext = Parameters<Parameters<typeof bot.on<"message">>[1]>[0];
// or more simply, for callback_query handlers:
export type CallbackCtx = Parameters<Parameters<typeof bot.callbackQuery<string>>[1]>[0];
```

```typescript
// handlers/menu.ts
import type { BotContext } from "../bot.js";

export async function handleMenu(ctx: BotContext) {
    ctx.user;     // ✅ typed from authPlugin.derive()
    ctx.isAdmin;  // ✅ typed
    ctx.db;       // ✅ typed from .decorate()
    // no `as unknown as { user: User }` anywhere
}
```

When a handler is registered at the bot level, TS already knows the enriched context type — so prefer defining handlers inline or importing the exported `BotContext` alias, never hand-rolling generic wrappers:

```typescript
// handlers/menu.ts
import type { BotContext } from "../bot.js";

export function handleMenu(ctx: BotContext) {
    // ctx.user / ctx.isAdmin / ctx.db — all typed from bot's derives & decorates
}

// bot.ts
bot.command("menu", handleMenu); // registration still gets full inference
```

If you need a narrower shape for a specific update type, use `ContextType`:

```typescript
import type { ContextType } from "gramio";
import type { BotContext } from "../bot.js";

type CallbackCtx = ContextType<typeof bot, "callback_query">;
// ...use CallbackCtx in render/helper functions
```

**Anti-pattern — do not do this:**

```typescript
// ❌ Casting through unknown means TS is not helping you
bot.callbackQuery(nav, (ctx) => {
    const { auth } = ctx as unknown as { auth: AuthResult };
    // if authPlugin stops exposing `auth`, this keeps compiling but breaks at runtime
});
```

If you are tempted to write `as unknown as { … }`, it almost always means the plugin wasn't `.extend()`ed on the bot that owns this handler, or the plugin's derive isn't typed. Fix the root cause — do not paper over it.

## Type Narrowing: context.is()

```typescript
bot.use((context) => {
    if (context.is("message")) {
        context.text;    // available
        context.chat;    // MessageChat type
    }
    if (context.is("callback_query")) {
        context.data;    // callback data string
        context.answer;  // answer method
    }
});
```

<!--
Source: https://gramio.dev/updates/overview
-->
