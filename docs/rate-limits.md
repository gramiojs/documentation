# Rate limits

https://core.telegram.org/bots/faq#broadcasting-to-users

# How to Broadcast

Without queue:

```ts twoslash
// experimental API available since Node.js@16.14.0
import { scheduler } from "node:timers/promises";
import { Bot, TelegramError } from "gramio";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.TOKEN!).extend(autoRetry());

for (const chatId of chatIds) {
    const result = await bot.api.sendMessage({ suppress: true, chatId, text });

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
