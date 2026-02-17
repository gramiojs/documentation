# Sentry

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/sentry?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/sentry)
[![JSR](https://jsr.io/badges/@gramio/sentry)](https://jsr.io/@gramio/sentry)
[![JSR Score](https://jsr.io/badges/@gramio/sentry/score)](https://jsr.io/@gramio/sentry)

</div>

Sentry error tracking for GramIO with automatic error capture, user identification, breadcrumbs, and optional tracing. Uses `@sentry/core` for runtime-agnostic support (Bun + Node.js).

### Installation

::: code-group

```bash [npm]
npm install @gramio/sentry
```

```bash [yarn]
yarn add @gramio/sentry
```

```bash [pnpm]
pnpm add @gramio/sentry
```

```bash [bun]
bun install @gramio/sentry
```

:::

### Usage

```typescript
import { Bot } from "gramio";
import { sentryPlugin } from "@gramio/sentry";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(sentryPlugin({
        setUser: true,
        breadcrumbs: true,
        tracing: false,
    }))
    .command("test", (context) => {
        context.sentry.captureMessage("Something happened");
        context.sentry.setTag("custom", "value");
    });

await bot.start();
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `setUser` | `boolean` | Automatically set the Sentry user from `context.from` |
| `breadcrumbs` | `boolean` | Add a breadcrumb for each update and API call |
| `tracing` | `boolean` | Enable per-update isolation scopes and spans |

## Methods

All methods are available on `context.sentry`:

### `captureMessage(msg)`

Sends a message event to Sentry:

```typescript
context.sentry.captureMessage("User reached step 3");
```

### `captureException(error)`

Captures an exception and sends it to Sentry:

```typescript
try {
    await riskyOperation();
} catch (error) {
    context.sentry.captureException(error);
}
```

### `setTag(key, value)`

Sets a tag on the current Sentry scope:

```typescript
context.sentry.setTag("feature", "onboarding");
```

### `setExtra(key, value)`

Attaches extra data to the current Sentry scope:

```typescript
context.sentry.setExtra("payload", context.message);
```
