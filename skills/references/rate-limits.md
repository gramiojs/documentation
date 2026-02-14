---
name: rate-limits
description: Rate limit handling, withRetries utility, broadcasting patterns, @gramio/broadcast with Redis, and custom BullMQ queues.
---

# Rate Limits & Broadcasting

## withRetries Utility

Handles 429 errors automatically:

```typescript
import { withRetries } from "gramio/utils";

const response = await withRetries(() =>
    bot.api.sendMessage({ chat_id: chatId, text: "Hello!" })
);
```

## Simple Broadcasting

```typescript
import { scheduler } from "node:timers/promises";
import { withRetries } from "gramio/utils";

for (const chatId of chatIds) {
    const result = await withRetries(() =>
        bot.api.sendMessage({
            chat_id: chatId,
            text: "Broadcast message!",
            suppress: true, // don't throw on blocked users
        })
    );

    if (result instanceof TelegramError) {
        console.log(`Failed for ${chatId}:`, result.message);
    }

    await scheduler.wait(100); // 100ms delay between requests
}
```

## @gramio/broadcast — Persistent Queue

Persistent, horizontally-scalable broadcasting with Redis:

```typescript
import { Broadcast } from "@gramio/broadcast";

const broadcast = new Broadcast(redis)
    .type("announcement", (chatId: number) =>
        bot.api.sendMessage({
            chat_id: chatId,
            text: "Important announcement!",
        })
    );

// Start broadcast
await broadcast.start("announcement", chatIds.map((id) => [id]));

// Graceful shutdown
await broadcast.job.queue.close();
```

## Custom Queue with BullMQ + Jobify

```typescript
import { defineJob } from "jobify";
import { TelegramError } from "gramio";

const sendMailing = defineJob("send-mailing")
    .input<{ chatId: number }>()
    .options({
        limiter: { max: 20, duration: 1000 }, // 20 per second
    })
    .action(async ({ data: { chatId } }) => {
        const response = await bot.api.sendMessage({
            chat_id: chatId,
            text: "Mailing message",
            suppress: true,
        });

        if (response instanceof TelegramError && response.payload?.retry_after) {
            await sendMailing.worker.rateLimit(
                response.payload.retry_after * 1000
            );
            throw Worker.RateLimitError();
        }
    });

// Queue all recipients
await sendMailing.addBulk(
    chatIds.map((id) => ({ name: "mailing", data: { chatId: id } }))
);
```

<!--
Source: https://gramio.dev/rate-limits
-->
