---
name: "@gramio/rate-limit"
description: "Rate limiting plugin for GramIO using sliding-window algorithm and macro-based per-handler options."
---

# @gramio/rate-limit

Rate limiting plugin for GramIO. Protects handlers from spam using sliding-window algorithm. Uses the macro system — no imperative if-checks needed in handler bodies.

## Setup

```ts
import { Bot } from "gramio";
import { rateLimit } from "@gramio/rate-limit";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            // storage: redisStorage(redis), // optional: Redis, SQLite, Cloudflare KV
            onLimitExceeded: async (ctx) => {
                if (ctx.is("message")) await ctx.reply("Too many requests!");
            },
        }),
    );
```

## Per-handler throttle (macro options)

Pass as the third argument to any handler:

```ts
// Simple: 3 requests per 60 seconds
bot.command("pay", handler, { rateLimit: { limit: 3, window: 60 } });

// Full options
bot.command("help", handler, {
    rateLimit: {
        id: "help",              // custom key (default: eventType:userId)
        limit: 20,
        window: 60,
        onLimitExceeded: (ctx) => ctx.reply("Too many /help!"),
    },
});
```

## Plugin options

| Option | Type | Description |
|---|---|---|
| `storage` | `Storage` | Storage adapter (default: in-memory) |
| `key` | `(ctx) => string` | Custom key function |
| `onLimitExceeded` | `(ctx) => unknown` | Global callback when limit exceeded |

## Custom storage (Redis example)

```ts
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const bot = new Bot(token).extend(
    rateLimit({
        storage: redisStorage(new Redis()),
        onLimitExceeded: async (ctx) => {
            if (ctx.is("message")) await ctx.reply("Slow down!");
        },
    }),
);
```

## Notes

- The macro runs **before** the handler body
- Multiple macros compose in registration order
- `id` defaults to `${eventType}:${ctx.from?.id}`
- Uses sliding-window (not fixed buckets), so requests are tracked per-second
