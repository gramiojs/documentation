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
