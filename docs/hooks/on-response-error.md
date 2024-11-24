# onResponseError

This hook called `after receiving a error response` from Telegram Bot API.

## Parameters

[TelegramError](https://jsr.io/@gramio/core@latest/doc/~/TelegramError)

<!-- > [!IMPORTANT] -->

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onResponseError(
    (context) => {
        console.log("Error for", context.method, context.message);
    }
);
```

### Add hook only to specified API methods

```ts
bot.onResponseError("sendMessage", (context) => {
    console.log("Error for sendMessage", context.message);
});
// or array
bot.onResponseError(["sendMessage", "sendPhoto"], (context) => {
    console.log("Error for", context.method, context.message);
});
```
