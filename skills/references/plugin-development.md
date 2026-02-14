---
name: plugin-development
description: "Writing custom GramIO plugins — Plugin class with derive/decorate/error/group, scaffolding with create-gramio-plugin, lazy loading (async vs await), middleware order."
---

# Plugin Development

## Plugin Class

Create reusable, type-safe extensions with `Plugin`:

```typescript
import { Plugin, Bot } from "gramio";

export class PluginError extends Error {
    wow: "type" | "safe" = "type";
}

const plugin = new Plugin("gramio-example")
    .error("PLUGIN", PluginError)
    .derive(() => ({
        some: ["derived", "props"] as const,
    }));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(plugin)
    .onError(({ context, kind, error }) => {
        if (context.is("message") && kind === "PLUGIN") {
            error.wow; // typed as "type" | "safe"
        }
    })
    .use((context) => {
        context.some; // typed as readonly ["derived", "props"]
    });
```

## Plugin Methods

| Method | Purpose |
|--------|---------|
| `.derive(fn)` | Add computed context properties (runs per-update) |
| `.derive("message", fn)` | Scoped derive — only runs for matching update types |
| `.decorate(key, value)` | Add static values to context (evaluated once) |
| `.error(kind, ErrorClass)` | Register a custom error type for `onError` matching |
| `.group(fn)` | Group handlers under a shared prefix or middleware |

## Scaffolding

```bash
npm create gramio-plugin ./plugin
```

Creates a ready-to-publish plugin project with TypeScript config, linter (Biome/ESLint), and optional Husky git hooks.

## Lazy Loading

Async plugins (returning a Promise) are **lazy-loaded** at `bot.start()`:

```typescript
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(autoload())     // async — loaded lazily at bot.start()
    .command("start", () => {
        // registered BEFORE autoload handlers
    });

bot.start(); // autoload resolves here
```

Use `await` for immediate loading:

```typescript
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(await autoload())  // resolved immediately
    .command("start", () => {
        // registered AFTER autoload handlers
    });
```

## Middleware Order

Registration order determines execution order. Plugins registered via `.extend()` inject their middleware at the point of registration:

```typescript
bot.use(middlewareA)         // 1st
   .extend(plugin)           // 2nd — plugin's derive/middleware
   .use(middlewareB)         // 3rd
   .command("start", fn);   // 4th
```

<!--
Source: https://gramio.dev/plugins/how-to-write, https://gramio.dev/plugins/lazy-load
-->
