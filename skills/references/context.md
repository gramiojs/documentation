---
name: context
description: Context injection with derive (scoped/global) and decorate, middleware with next(), type narrowing with context.is(), and bot.start()/stop() options.
---

# Context & Updates

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
