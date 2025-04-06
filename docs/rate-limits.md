---
title: How to solve rate limit errors from Telegram Bot API with GramIO
head:
    - - meta
      - name: "description"
        content: How to solve rate limit (too many requests) errors from Telegram Bot API with GramIO using auto-retry plugin or a broadcast queue.

    - - meta
      - name: "keywords"
        content: Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, 429, rate-limit, error-code, retry later, retry_after, too many requests, limits, messages, how to solve, redis, bull, queue, 30 messages per second
---

# Rate limits

This is a guide that shows how to solve rate limit errors (`Error code 429, Error: Too many requests: retry later`) from Telegram Bot API.

Generally speaking, if you avoid **broadcast-like** behavior in your bot, there is no need to worry about rate limits. But it's better to use the [auto-retry](/plugins/official/auto-retry) plugin just in case. if you reach these limits without broadcasting, then most likely something is wrong on your side.

# How to Broadcast

For a start, we can solve rate-limit errors when broadcasting without using **queues**.

Let's use the [built-in `withRetries` function](/bot-api#Handling-Rate-Limit) which catches errors with the `retry_after` field (**rate limit** errors), **waits** for the specified time and **repeats** the API request.

Next, we need to make a loop and adjust the **delay** so that we are least likely to fall for a `rate-limit` error, and if we catch it, we will wait for the specified time (and the [built-in `withRetries` function](/bot-api#Handling-Rate-Limit) will repeat it)

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

## Queue Implementation (@gramio/broadcast)

Persistent even when server restarts and ready to horizontal-scaling broadcasting sample.

GramIO has a convenient library for broadcasting in its ecosystem - [@gramio/broadcast](https://github.com/gramiojs/broadcast)

Pre-requirements:

-   [Redis](https://redis.io/)

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

This library provides a convenient interface for broadcasting without losing type safety. You create types of broadcasts and pass data to functions, then call `broadcast.start` with an array of arguments.

## Own Implementation

Pre-requirements:

-   [Redis](https://redis.io/)
-   ioredis, bullmq, [jobify](https://github.com/kravetsone/jobify)

// TODO: more text about it

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

### Read also

-   [So your bot is rate limited...](https://telegra.ph/So-your-bot-is-rate-limited-01-26)
-   [Broadcasting to Users](https://core.telegram.org/bots/faq#broadcasting-to-users)
