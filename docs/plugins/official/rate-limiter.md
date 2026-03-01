# Rate Limiter

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/rate-limit?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/rate-limit)

</div>

`@gramio/rate-limit` protects your bot handlers from spam and abuse using **sliding-window rate limiting**. Unlike a manual `if (!await ctx.rateLimit(...)) return` pattern, this plugin uses GramIO's **macro system** — handlers declare their limit inline as an options object. No boilerplate, no clutter.

### Installation

::: code-group

```bash [npm]
npm install @gramio/rate-limit
```

```bash [yarn]
yarn add @gramio/rate-limit
```

```bash [pnpm]
pnpm add @gramio/rate-limit
```

```bash [bun]
bun add @gramio/rate-limit
```

:::

### Usage

```ts
import { Bot } from "gramio";
import { rateLimit } from "@gramio/rate-limit";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            onLimitExceeded: async (ctx) => {
                if (ctx.is("message")) await ctx.reply("Too many requests, slow down!");
            },
        }),
    );

// Each handler declares its own throttle limits via the options object:
bot.command("pay", (ctx) => {
    // process payment...
}, { rateLimit: { limit: 3, window: 60 } });

bot.command("help", (ctx) => ctx.reply("Here is the help text"), {
    rateLimit: {
        id: "help",          // explicit key — defaults to event type + user id
        limit: 20,
        window: 60,
        onLimitExceeded: (ctx) => ctx.reply("Too many /help requests!"),
    },
});

await bot.start();
```

### Custom storage

The plugin ships with **in-memory storage** out of the box (no external dependencies needed for development). For production, plug in any `@gramio/storages`-compatible adapter:

::: code-group

```ts [Redis]
import { rateLimit } from "@gramio/rate-limit";
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            storage: redisStorage(new Redis()),
            onLimitExceeded: async (ctx) => {
                if (ctx.is("message")) await ctx.reply("Slow down!");
            },
        }),
    );
```

```ts [In-memory (default)]
import { rateLimit } from "@gramio/rate-limit";
import { inMemoryStorage } from "@gramio/storage";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            storage: inMemoryStorage(), // explicit, same as default
        }),
    );
```

:::

## API

### `rateLimit(options?)`

Returns a GramIO plugin that registers the `rateLimit` macro.

| Option | Type | Description |
|---|---|---|
| `storage` | `Storage` | Key-value storage adapter. Default: in-memory |
| `key` | `(ctx) => string` | Custom key function. Default: `"${eventType}:${from.id}"` |
| `onLimitExceeded` | `(ctx) => unknown` | Default callback when limit is exceeded |

### Per-handler options (`rateLimit` macro)

Pass as the third argument to any handler method:

```ts
bot.command("pay", handler, {
    rateLimit: {
        id?: string;           // Key override. Defaults to eventType:userId
        limit: number;         // Max requests per window
        window: number;        // Window size in seconds
        onLimitExceeded?: (ctx) => unknown; // Override global callback
    }
});
```

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | event type + user id | Custom rate limit key |
| `limit` | `number` | — | Maximum allowed requests |
| `window` | `number` | — | Window size in seconds |
| `onLimitExceeded` | function | global option | Per-handler override callback |
