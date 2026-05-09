---
name: updates
description: "Update lifecycle — bot.start() options (webhook, longPolling, dropPendingUpdates, allowedUpdates, deleteWebhook), bot.stop() with timeout, and graceful shutdown via SIGINT/SIGTERM."
---

# Updates & Lifecycle

## bot.start()

Launches update receiving. Loads lazy plugins, then fires the `onStart` hook.

```typescript
await bot.start({
    // Long polling (default)
    longPolling: { timeout: 10 },
    dropPendingUpdates: true,
    allowedUpdates: ["message", "callback_query"],

    // deleteWebhook options:
    // true              — always delete webhook before polling
    // "on-conflict-with-polling" — only if Telegram returns a conflict error (default)
    deleteWebhook: "on-conflict-with-polling",
});
```

### Webhook Mode

```typescript
await bot.start({
    webhook: {
        url: "https://example.com/webhook",
        path: "/webhook",
        port: 3000,
    },
});

// Or if webhook is already configured externally:
await bot.start({ webhook: true });
```

When `webhook: true`, GramIO does not call `setWebhook` — it assumes the webhook is already set.

### `allowedUpdates` & `AllowedUpdatesFilter` (gramio 0.9+)

`chat_member`, `message_reaction`, and `message_reaction_count` are the three update types Telegram **excludes by default** — handlers register fine but updates never arrive unless they're listed in `allowed_updates`. Four ways to handle this:

```typescript
import { Bot, AllowedUpdatesFilter } from "gramio";

const bot = new Bot(token)
    .on("chat_member", chatMemberHandler)
    .on("message_reaction", reactionHandler);

// 1. Default — no `allowedUpdates` arg.
//    GramIO scans handlers and auto opt-ins to chat_member /
//    message_reaction / message_reaction_count when registered.
await bot.start();

// 2. Strict mode — request only update types your handlers register for.
//    Pass the literal string "strict".
await bot.start({ allowedUpdates: "strict" });

// 3. Explicit fluent builder.
await bot.start({
    allowedUpdates: AllowedUpdatesFilter.only("message", "callback_query"),
});

// 4. Default set with extras / exclusions.
await bot.start({
    allowedUpdates: AllowedUpdatesFilter.default
        .add("chat_member")
        .except("poll", "poll_answer"),
});
```

Available factories (all return immutable `Array<AllowedUpdateName>`):

| Factory / method | Description |
|---|---|
| `AllowedUpdatesFilter.all` | Every update type, opt-in types included |
| `AllowedUpdatesFilter.default` | Telegram's default set (opt-in types excluded) |
| `AllowedUpdatesFilter.only(...types)` | Exactly the listed types |
| `.add(...types)` / `.except(...types)` | Chainable mutations on any instance |

> [!WARNING]
> Auto-derivation in modes 1 and 2 only sees handlers registered via `.on(eventName, …)`, the trigger shorthands (`command`, `callbackQuery`, `hears`, `reaction`, `inlineQuery`, `chosenInlineResult`, `startParameter`), and event-specific `derive`. Filter-style `.on(filterFn, handler)` and global `.use()` middleware don't declare a specific event — `.add()` the relevant types manually if you rely on those.

## bot.stop()

Stops polling/webhook, waits for pending updates to finish, then fires the `onStop` hook.

```typescript
await bot.stop();       // default 3000ms timeout
await bot.stop(5000);   // custom timeout in ms
```

## Graceful Shutdown

Handle `SIGINT` (Ctrl+C) and `SIGTERM` (Docker/Kubernetes/systemd) to avoid killing in-flight updates.

**Shutdown order for webhook bots:**
1. Stop the HTTP server (no new requests)
2. `bot.stop()` (process pending updates, fire `onStop`)
3. Flush external services (analytics, DB connections)
4. `process.exit(0)`

```typescript
import { app } from "./webhook";
import { bot } from "./bot";
import { posthog } from "./analytics";

const signals = ["SIGINT", "SIGTERM"] as const;

for (const signal of signals) {
    process.on(signal, async () => {
        console.log(`Received ${signal}. Shutting down...`);
        await app.stop();          // 1. stop HTTP server
        await bot.stop();          // 2. process pending updates
        await posthog.shutdown();  // 3. flush analytics
        process.exit(0);
    });
}
```

For long-polling bots, skip the HTTP server step — just call `bot.stop()`.

<!--
Source: https://gramio.dev/updates/overview, https://gramio.dev/updates/graceful-shutdown
-->
