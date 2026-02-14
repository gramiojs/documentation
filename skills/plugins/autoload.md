---
name: autoload
description: File-based command loading with @gramio/autoload — auto-discover handlers from directory, with Bun.build support.
---

# Autoload Plugin

Package: `@gramio/autoload`

## Basic Usage

```typescript
import { autoload } from "@gramio/autoload";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(await autoload()); // loads from ./commands/ by default

export type BotType = typeof bot;
```

Each command file exports a default function:

```typescript
// commands/start.ts
import type { BotType } from "..";

export default (bot: BotType) =>
    bot.command("start", (context) => context.send("Hello!"));
```

## Configuration

```typescript
bot.extend(await autoload({
    path: "./handlers",           // default: "./commands"
    pattern: /\.(ts|js)$/,        // file pattern to match
    import: "default",            // export to use (default: "default")
    failGlob: true,               // throw if no files match
    skipImportErrors: false,      // skip files that fail to import
    onLoad: (path) => console.log(`Loading ${path}`),
    onFinish: (paths) => console.log(`Loaded ${paths.length} handlers`),
}));
```

## Lazy Loading

```typescript
// Loaded at bot.start() time (lazy)
bot.extend(autoload());

// Loaded immediately (eager)
bot.extend(await autoload());
```

## Bun.build Support

Use `esbuild-plugin-autoload` for single-executable compilation:

```typescript
// build.ts
import { autoloadPlugin } from "esbuild-plugin-autoload";

await Bun.build({
    entrypoints: ["./src/index.ts"],
    plugins: [autoloadPlugin()],
    // ...
});
```
