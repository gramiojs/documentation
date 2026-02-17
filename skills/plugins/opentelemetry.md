---
name: opentelemetry
description: Distributed tracing and observability with @gramio/opentelemetry — wraps bot API calls and update handling in OpenTelemetry spans.
---

# OpenTelemetry Plugin

Package: `@gramio/opentelemetry`

Wraps all API calls and update processing in OpenTelemetry spans for distributed tracing. Uses the `onApiCall` hook internally.

## Setup

```typescript
import { Bot } from "gramio";
import { opentelemetry } from "@gramio/opentelemetry";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(opentelemetry())
    .command("start", (context) => context.send("Hello!"));
```

## How It Works

The plugin creates two types of spans:

1. **Update spans** — wraps each incoming update (message, callback_query, etc.)
2. **API call spans** — wraps each outgoing Telegram API call (sendMessage, etc.)

Span hierarchy:
```
[update: message]
  └── [api: sendMessage]
  └── [api: answerCallbackQuery]
```

## Context Methods

The plugin adds tracing methods to the context:

```typescript
bot.on("message", (context) => {
    // Record custom events/exceptions in the current span
    context.record("custom-event", { key: "value" });

    // Get the current span for manual instrumentation
    const span = context.getCurrentSpan();

    // Set custom attributes on the current span
    context.setAttributes({ "user.id": context.from.id });
});
```

| Method | Description |
|--------|-------------|
| `context.record(name, attributes?)` | Record an event on the current span |
| `context.getCurrentSpan()` | Get the active OpenTelemetry span |
| `context.setAttributes(attrs)` | Set attributes on the current span |

## Requirements

Requires an OpenTelemetry SDK setup (e.g., `@opentelemetry/sdk-node`) with a configured exporter (Jaeger, Zipkin, OTLP, etc.).
