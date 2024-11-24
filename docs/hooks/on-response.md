# onResponse

This hook called `after receiving a successful response` from Telegram Bot API.

## Parameters

Object with:

-   method - API method name
-   params - API method params
-   response - response

<!-- > [!IMPORTANT] -->

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onResponse((context) => {
    console.log("response for", context.method, context.response);
});
```

### Add hook only to specified API methods

```ts
bot.onResponse("sendMessage", (context) => {
    console.log("response for sendMessage", context.response);
});
// or array
bot.preRequest(["sendMessage", "sendPhoto"], (context) => {
    console.log("response for", context.method, context.response);
});
```
