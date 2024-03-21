# preRequest

This hook called `before sending a request` to Telegram Bot API (allows us to impact the sent parameters).

## Parameters

-   method - API method name
-   params - API method params

> [!IMPORTANT]
> Return context from hook handler is required!

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.TOKEN!).preRequest((context) => {
    if (context.method === "sendMessage") {
        context.params.text = "mutate params";
    }

    return context;
});

bot.start();
```

### Add hook only to specified API methods

```ts
bot.preRequest("sendMessage", (context) => {
    context.params.text = "mutate params";

    return context;
});
// or array
bot.preRequest(["sendMessage", "sendPhoto"], (context) => {
    if (context.method === "sendMessage") {
        context.params.text = "mutate params";
    } else context.params.caption = "method is sendPhoto";

    return context;
});
```
