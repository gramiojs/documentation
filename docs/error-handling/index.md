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

bot.onError(({ context, kind, error }) => {
    if (context.is("message")) return context.send(`${kind}: ${error.message}`);
});
```

## Errors kinds

### Custom

You can catch an error of a certain class inherited from Error.

```ts twoslash
import { Bot, format, bold } from "gramio";
// ---cut---
export class NoRights extends Error {
    needRole: "admin" | "moderator";

    constructor(role: "admin" | "moderator") {
        super();
        this.needRole = role;
    }
}

const bot = new Bot(process.env.TOKEN!)
    .error("NO_RIGHTS", NoRights)
    .onError("message", ({ context, kind, error }) => {
        if (kind === "NO_RIGHTS")
            return context.send(
                format`You don't have enough rights! You need to have an «${bold(
                    error.needRole
                    //    ^^^^^^^^
                )}» role.`
            );
    });

bot.updates.on("message", (context) => {
    if (context.text === "ban") throw new NoRights("admin");
});
```

> [!IMPORTANT]
> We recommend following **convention** and naming kind errors in **SCREAMING_SNAKE_CASE**

### Telegram

This error is the result of a failed request to the Telegram Bot API.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.onError(({ context, kind, error }) => {
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
bot.onError(({ context, kind, error }) => {
    if (kind === "UNKNOWN") {
        console.log(error.message);
    }
});
```
