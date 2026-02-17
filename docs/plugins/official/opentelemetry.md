# OpenTelemetry

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/opentelemetry?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/opentelemetry)
[![JSR](https://jsr.io/badges/@gramio/opentelemetry)](https://jsr.io/@gramio/opentelemetry)
[![JSR Score](https://jsr.io/badges/@gramio/opentelemetry/score)](https://jsr.io/@gramio/opentelemetry)

</div>

Distributed tracing for GramIO via the OpenTelemetry API. Each incoming update becomes a root span, and each Telegram API call becomes a child span. Works with any OTEL-compatible backend (Jaeger, Grafana Tempo, Axiom, etc.) and integrates with Elysia webhooks.

### Installation

::: code-group

```bash [npm]
npm install @gramio/opentelemetry
```

```bash [yarn]
yarn add @gramio/opentelemetry
```

```bash [pnpm]
pnpm add @gramio/opentelemetry
```

```bash [bun]
bun install @gramio/opentelemetry
```

:::

### Usage

```typescript
import { Bot } from "gramio";
import { opentelemetryPlugin } from "@gramio/opentelemetry";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(opentelemetryPlugin({
        recordApiParams: true,
    }))
    .command("start", (context) => context.send("Hello!"));

await bot.start();
```

### Trace Hierarchy

Each update produces a trace tree like the following:

```
gramio.update.message (CONSUMER)
  ├── telegram.api/sendMessage (CLIENT)
  ├── telegram.api/deleteMessage (CLIENT)
  └── custom spans via record()
```

## Methods

### `record(name, fn)`

Creates a custom child span inside the current update trace:

```typescript
bot.command("heavy", async (context) => {
    await context.record("fetch-data", async () => {
        // expensive work tracked as its own span
    });
});
```

### `getCurrentSpan()`

Returns the active OpenTelemetry span for the current update:

```typescript
bot.on("message", (context) => {
    const span = context.getCurrentSpan();
    span?.addEvent("custom-event");
});
```

### `setAttributes(attrs)`

Adds custom attributes to the current span:

```typescript
bot.command("order", (context) => {
    context.setAttributes({
        "order.id": orderId,
        "order.total": total,
    });
});
```
