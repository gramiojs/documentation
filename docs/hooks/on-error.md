---
title: onError hook in GramIO - Error handling for Telegram bots

head:
    - - meta
      - name: "description"
        content: "The onError hook in GramIO allows you to catch and handle errors that occur in Telegram bot middleware. Learn how to effectively manage exceptions."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, error handling, onError hook, exception handling, try catch, bot debugging, error logging, reliability improvement, error reporting, error separation, error types, error recovery, PLUGIN error kind, API error kind, OTHER error kind, error resilience"
---

# onError (Error Handling)

Errors can occur in middleware, and we need to handle them.
That's exactly what the `onError` hook is designed for.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---

bot.on("message", () => {
    bot.api.sendMessage({
        chat_id: "@not_found",
        text: "Chat not exists....",
    });
});

bot.onError(({ context, kind, error }) => {
    if (context.is("message")) return context.send(`${kind}: ${error.message}`);
});
```

### Add hook only to specified contexts

```ts
bot.onError("message", ({ context, kind, error }) => {
    return context.send(`${kind}: ${error.message}`);
});
// or array
bot.onError(["message", "message_reaction"], ({ context, kind, error }) => {
    return context.send(`${kind}: ${error.message}`);
});
```

## Error kinds

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

const bot = new Bot(process.env.BOT_TOKEN as string)
    .error("NO_RIGHTS", NoRights)
    .onError("message", ({ context, kind, error }) => {
        if (kind === "NO_RIGHTS")
            return context.send(
                format`You don't have enough rights! You need to have a «${bold(
                    error.needRole
                    //    ^^^^^^^^
                )}» role.`
            );
    });

bot.on("message", (context) => {
    if (context.text === "ban") throw new NoRights("admin");
});
```

> [!IMPORTANT]
> We recommend following the **convention** of naming error kinds in **SCREAMING_SNAKE_CASE**

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

This error is any unknown error, whether it's your custom class or just a standard Error.

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
