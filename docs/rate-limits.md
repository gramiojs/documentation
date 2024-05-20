---
head:
    - - meta
      - property: "title"
        content: How to solve rate limit errors from Telegram Bot API with GramIO

    - - meta
      - name: "description"
        content: Read more about how to solve rate limit (too many requests) errors from Telegram Bot API with GramIO. How to use auto-retry plugin or build a broadcast queue and more.

    - - meta
      - name: "keywords"
        content: Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, 429, rate-limit, error-code, retry later, retry_after, too many requests, limits, messages, how to solve, redis, bull, queue, 30 messages per second
---

# Rate limits

This is a guide that shows how to solve rate limit errors (`Error code 429, Error: Too many requests: retry later`) from Telegram Bot API.

Generally speaking, if you avoid **broadcast-like** behavior in your bot, there is no need to worry about rate limits. But it's better to use the [auto-retry](/plugins/official/auto-retry) plugin just in case. if you reach these limits without broadcasting, then most likely something is wrong on your side.

# How to Broadcast

For a start, we can solve rate-limit errors when broadcasting without using **queues**.

Let's use the [auto-retry](/plugins/official/auto-retry) plugin which catches errors with the `retry_after` field (**rate limit** errors), **waits** for the specified time and **repeats** the API request.

Next, we need to make a loop and adjust the **delay** so that we are least likely to fall for a `rate-limit` error, and if we catch it, we will wait for the specified time (and the [auto-retry](/plugins/official/auto-retry) plugin will repeat it)

```ts twoslash
// experimental API available since Node.js@16.14.0
import { scheduler } from "node:timers/promises";
import { Bot, TelegramError } from "gramio";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.TOKEN as string).extend(autoRetry());
const chatIds: number[] = [
    /** some chat ids */
];

for (const chatId of chatIds) {
    const result = await bot.api.sendMessage({
        suppress: true,
        chat_id: chatId,
        text: "Hi!",
    });

    await scheduler.wait(
        result instanceof TelegramError && result.payload?.retry_after
            ? result.payload.retry_after * 1000
            : 1000
    );
}
```

With queue:

```ts
// TODO
```

### Read also

-   [So your bot is rate limited...](https://telegra.ph/So-your-bot-is-rate-limited-01-26)
-   [Broadcasting to Users](https://core.telegram.org/bots/faq#broadcasting-to-users)
