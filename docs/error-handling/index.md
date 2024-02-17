# Error Handling

It happens that errors occur in middleware and we need to handle them.
That's what the `onError` method was created for.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---

bot.updates.on("message", () => {
    bot.api.sendMessage({
        chat_id: "@not_found",
        text: "Chat not exists....",
    });
});

bot.updates.onError(({ context, kind, error }) => {
    if (context.is("message")) return context.send(`${kind}: ${error.message}`);
});
```

## Errors

### Telegram

This error is the result of a failed request to the Telegram Bot API

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.updates.onError(({ context, kind, error }) => {
    if (kind === "TELEGRAM" && error.method === "sendMessage") {
        error.params; // is sendMessage params
    }
});
```

### Unknown

This error is any unknown error, whether it's your class or just an Error.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.updates.onError(({ context, kind, error }) => {
    if (kind === "UNKNOWN") {
        console.log(error.message);
    }
});
```
