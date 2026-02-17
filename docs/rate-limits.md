---
title: How to solve rate limit errors from Telegram Bot API with GramIO
head:
    - - meta
      - name: "description"
        content: How to solve rate limit (too many requests) errors from Telegram Bot API with GramIO using auto-retry plugin or a broadcast queue.

    - - meta
      - name: "keywords"
        content: Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, 429, rate-limit, error-code, retry later, retry_after, too many requests, limits, messages, how to solve, redis, bull, queue, 30 messages per second, broadcast, mailing, flood control
---

# Rate limits

Telegram Bot API enforces strict rate limits to protect its infrastructure and other bots from abuse. If your bot sends too many requests in a short period, the API will respond with **HTTP 429 — Too Many Requests** and a `retry_after` field indicating how many seconds the bot must wait before making any API calls.

## Key limits to know

Telegram **does not officially publish** exact rate limit numbers. The values below are approximate and come from community experience — they are safe to follow, but the real limits are **dynamic** and depend on factors like your bot's age, history, and the type of requests.

| Limit | Approximate value |
|---|---|
| Messages to the **same chat** | ~1 per second |
| Messages to **different chats** | ~30 per second |
| Bulk notifications / broadcasts | ~30 per second total |
| Group/channel operations | Lower, depends on members |

> [!NOTE]
> In practice the limits are more nuanced than a simple "30 per second" — they can change dynamically and may differ between bots. If your bot needs higher throughput, you can **contact [@BotSupport](https://t.me/BotSupport)** and request a limit increase for your bot.

> [!TIP]
> If you're not doing broadcasts — just responding to user messages — you almost certainly won't hit these limits. But it's still good practice to add the [auto-retry](/plugins/official/auto-retry) plugin as a safety net.

## What happens when you exceed the limit

When you go over the rate limit, Telegram returns:

```json
{
  "ok": false,
  "error_code": 429,
  "description": "Too Many Requests: retry after 35",
  "parameters": {
    "retry_after": 35
  }
}
```

Your bot is **completely blocked** for the duration of `retry_after` (up to 35+ seconds). No API calls will succeed during this time — not just for the users you were broadcasting to, but for **all** users interacting with your bot.

## The problem: broadcasting without delays

A common mistake is iterating over a list of users and sending messages as fast as possible:

```ts
// DON'T do this!
for (const chatId of chatIds) {
    await bot.api.sendMessage({ chat_id: chatId, text: "Hi!" });
    // No delay → instant 429 after ~30 messages
}
```

This fires requests at maximum speed. After roughly 30 messages, Telegram blocks your bot entirely.

<BroadcastVisualizer />

## How to broadcast correctly

### Simple approach: loop with delay

Use the [built-in `withRetries` function](/bot-api#Handling-Rate-Limit) which catches `retry_after` errors, waits the specified time, and retries the request automatically. Combine it with a base delay between each request to stay under the limit:

```ts twoslash
// experimental API available since Node.js@16.14.0
import { scheduler } from "node:timers/promises";
import { Bot, TelegramError } from "gramio";
import { withRetries } from "gramio/utils";

const bot = new Bot(process.env.BOT_TOKEN as string);
const chatIds: number[] = [
    /** some chat ids */
];

for (const chatId of chatIds) {
    const result = await withRetries(() =>
        bot.api.sendMessage({
            suppress: true,
            chat_id: chatId,
            text: "Hi!",
        })
    );

    await scheduler.wait(100); // Base delay between successful requests to avoid rate limits
}
```

This is a good starting point for small broadcasts (up to a few thousand users). But it has downsides:

- **Not persistent** — if the server restarts, you lose your position in the list
- **Not scalable** — a single loop can't be parallelized across multiple servers
- **No progress tracking** — you don't know which users have already received the message

### Production-ready: @gramio/broadcast

For real-world broadcasting, use [@gramio/broadcast](https://github.com/gramiojs/broadcast) — a queue-based solution built into the GramIO ecosystem. It's **persistent** (survives restarts), **horizontally scalable**, and handles rate limiting automatically.

**Requirements:** [Redis](https://redis.io/)

```ts
import { Bot, InlineKeyboard } from "gramio";
import Redis from "ioredis";
import { Broadcast } from "@gramio/broadcast";

const redis = new Redis({
    maxRetriesPerRequest: null,
});

const bot = new Bot(process.env.BOT_TOKEN as string);

const broadcast = new Broadcast(redis).type("test", (chatId: number) =>
    bot.api.sendMessage({
        chat_id: chatId,
        text: "test",
    })
);

console.log("prepared to start");

const chatIds = [617580375];

await broadcast.start(
    "test",
    chatIds.map((x) => [x])
);

// graceful shutdown
async function gracefulShutdown() {
    console.log(`Process ${process.pid} go to sleep`);

    await broadcast.job.queue.close();

    console.log("closed");
    process.exit(0);
}

process.on("SIGTERM", gracefulShutdown);

process.on("SIGINT", gracefulShutdown);
```

You define broadcast **types** with full type safety — each type specifies what data the broadcast function receives. Then call `broadcast.start` with an array of arguments and the library handles queuing, rate limiting, retries, and persistence.

### Custom implementation with BullMQ

If you need full control over the queue behavior, you can build your own solution using [BullMQ](https://docs.bullmq.io/) with [jobify](https://github.com/kravetsone/jobify):

**Requirements:** [Redis](https://redis.io/), ioredis, bullmq, [jobify](https://github.com/kravetsone/jobify)

```ts
import { Worker } from "bullmq";
import { Bot, TelegramError } from "gramio";
import { Redis } from "ioredis";
import { initJobify } from "jobify";

const bot = new Bot(process.env.BOT_TOKEN as string);

const redis = new Redis({
    maxRetriesPerRequest: null,
});

const defineJob = initJobify(redis);

const text = "Hello, world!";

const sendMailing = defineJob("send-mailing")
    .input<{ chatId: number }>()
    .options({
        limiter: {
            max: 20,
            duration: 1000,
        },
    })
    .action(async ({ data: { chatId } }) => {
        const response = await bot.api.sendMessage({
            chat_id: chatId,
            suppress: true,
            text,
        });

        if (response instanceof TelegramError) {
            if (response.payload?.retry_after) {
                await sendMailing.worker.rateLimit(
                    response.payload.retry_after * 1000
                );

                // use this only if you did not use auto-retry
                // because it re-run this job again
                throw Worker.RateLimitError();
            } else throw response;
        }
    });

const chats: number[] = []; // pick chats from database

await sendMailing.addBulk(
    chats.map((x) => ({
        name: "mailing",
        data: {
            chatId: x,
        },
    }))
);
```

The `limiter` option ensures BullMQ processes at most 20 jobs per second. If a 429 error occurs, the worker pauses for the time specified in `retry_after` and then resumes.

### Read also

-   [So your bot is rate limited...](https://telegra.ph/So-your-bot-is-rate-limited-01-26)
-   [Broadcasting to Users](https://core.telegram.org/bots/faq#broadcasting-to-users)
