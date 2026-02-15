---
name: sentry
description: Error tracking and performance monitoring with @gramio/sentry — captures errors, wraps API calls in spans, adds Sentry context methods.
---

# Sentry Plugin

Package: `@gramio/sentry`

Integrates Sentry for error tracking and performance monitoring. Captures unhandled errors, wraps API calls in Sentry spans, and provides context methods for manual instrumentation.

## Setup

```typescript
import { Bot } from "gramio";
import { sentry } from "@gramio/sentry";
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(sentry())
    .command("start", (context) => context.send("Hello!"));
```

## Options

```typescript
bot.extend(sentry({
    setUser: true,   // auto-set Sentry user from context.from (default: true)
    setContext: true, // auto-set Sentry context with update data (default: true)
}));
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `setUser` | `boolean` | `true` | Auto-set Sentry user from `context.from` |
| `setContext` | `boolean` | `true` | Auto-set Sentry context with update data |

## Context Methods

```typescript
bot.on("message", (context) => {
    // Access the underlying Sentry instance
    context.sentry;

    // Capture a custom message
    context.sentry.captureMessage("Something happened");

    // Capture an exception
    context.sentry.captureException(new Error("Something went wrong"));

    // Add breadcrumb
    context.sentry.addBreadcrumb({
        category: "bot",
        message: "User sent /start",
        level: "info",
    });
});
```

## What Gets Captured

- **Unhandled errors** in handlers are automatically sent to Sentry
- **API calls** are wrapped in Sentry spans (performance monitoring)
- **User info** (`from.id`, `from.username`) is set as Sentry user
- **Update data** is attached as Sentry context for debugging
