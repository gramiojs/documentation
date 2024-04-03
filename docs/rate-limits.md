# Rate limits

https://core.telegram.org/bots/faq#broadcasting-to-users

# How to Broadcast

Without queue:

```ts
// experimental API available since Node.js@16.14.0
import { scheduler } from "node:timers/promises";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.TOKEN!).extend(autoRetry());

for (const chatId of chatIds) {
    // need suppress API
    try {
        await bot.api.sendMessage({ chatId, text });
        await scheduler.wait(1000);
    } catch (error) {
        if (error instanceof TelegramError && error.payload?.retry_after)
            await scheduler.wait(error.payload.retry_after * 1000);
    }
}
```

With queue:

```ts
// TODO
```
