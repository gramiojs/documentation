# preRequest

This hook called `before sending a request` to Telegram Bot API (allows us to impact the sent parameters).

## Parameters

-   method - API method name
-   params - API method params

> ![IMPORTANT]
> Return { method, params } from hook handler is required!

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.TOKEN!).preRequest(({ method, params }) => {
    if (method === "sendMessage") {
        params.text = "mutate params";
    }

    return { method, params };
});

bot.start();
```

### add hook only to specified updates

```ts
bot.preRequest("sendMessage", ({ method, params }) => {
    params.text = "mutate params";

    return { method, params };
});
// or array
bot.preRequest(["sendMessage", "sendPhoto"], ({ method, params }) => {
    if (method === "sendMessage") {
        params.text = "mutate params";
    } else {
        params.caption = "method is sendPhoto";
    }

    return { method, params };
});
```
