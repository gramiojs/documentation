---
title: onResponseError hook in GramIO - API request error handling

head:
    - - meta
      - name: "description"
        content: "The onResponseError hook in GramIO is called after receiving an error response from the Telegram Bot API. Learn how to handle failed requests to the Telegram API."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onResponseError, API error handling, TelegramError, API error tracking, request monitoring, request error logging, HTTP error handling, request failures, retry_after, handling 429, API error interception, request error analysis"
---

# onResponseError

This hook is called `after receiving an error response` from the Telegram Bot API.

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
