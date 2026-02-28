---
name: context
description: Context injection with derive (scoped/global) and decorate, middleware with next(), type narrowing with context.is(), camelCase getters (never ctx.payload), and bot.start()/stop() options.
---

# Context & Updates

## Context Properties — camelCase Getters (IMPORTANT)

All context (`ctx`) properties are exposed as **camelCase getters** that mirror the Telegram API fields. **Never access `ctx.payload` directly** — it is the raw snake_case Telegram object and is considered internal/unstable. Always use the typed camelCase getters instead.

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

// ❌ Wrong — raw payload, avoid
bot.on("message", (ctx) => {
    ctx.payload.message_id;          // don't do this
    ctx.payload.from?.first_name;    // don't do this
    ctx.payload.chat.id;             // don't do this
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
