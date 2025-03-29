---
title: preRequest hook in GramIO - Modifying requests before sending

head:
    - - meta
      - name: "description"
        content: "The preRequest hook in GramIO is called before sending a request to the Telegram Bot API. Learn how to modify request parameters to customize your bot's behavior."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, preRequest, request modification, API parameter changes, request interception, request preprocessing, API middlewares, request customization, request interceptor, API method parameters, request validation, logging before sending"
---

# preRequest

This hook is called before sending a request to the Telegram Bot API (allowing you to modify the parameters being sent).

## Parameters

-   method - API method name
-   params - API method parameters

> [!IMPORTANT]
> You must return the context from the hook handler!

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).preRequest((context) => {
    if (context.method === "sendMessage") {
        context.params.text = "changed parameters";
    }

    return context;
});

bot.start();
```

### Add hook only to specified API methods

```ts
bot.preRequest("sendMessage", (context) => {
    context.params.text = "modified text";

    return context;
});
// or array
bot.preRequest(["sendMessage", "sendPhoto"], (context) => {
    if (context.method === "sendMessage") {
        context.params.text = "modified text";
    } else {
        context.params.caption = "this is a photo caption from sendPhoto method";
    }

    return context;
});
```
