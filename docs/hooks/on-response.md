---
title: onResponse hook in GramIO - Handling successful API requests

head:
    - - meta
      - name: "description"
        content: "The onResponse hook in GramIO is called after receiving a successful response from the Telegram Bot API. Learn how to process successful API requests and track response parameters."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onResponse, API request handling, request monitoring, successful request logging, API response analysis, successful request interception, API interaction tracking, request analytics, API parameters, request optimization"
---

# onResponse

This hook is called `after receiving a successful response` from the Telegram Bot API.

## Parameters

Object with:

- method - API method name
- params - API method parameters
- response - response data

<!-- > [!IMPORTANT] -->

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onResponse((context) => {
    console.log("Response for", context.method, context.response);
});
```

### Add hook only to specified API methods

```ts
bot.onResponse("sendMessage", (context) => {
    console.log("Response for sendMessage", context.response);
});
// or array
bot.onResponse(["sendMessage", "sendPhoto"], (context) => {
    console.log("Response for", context.method, context.response);
});
```
