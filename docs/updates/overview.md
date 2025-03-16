# Context

## Listen to all events

```ts
bot.use((context, next) => {
    // ...
});
```

## Listen only to specific events

```ts
bot.on("message", (context, next) => {
    // ...
});
// or
bot.on(["message", "callback_query"], (context, next) => {
    // ...
});
```

You can read API Reference for contexts [here](https://jsr.io/@gramio/contexts/doc).

# Context injection

## Derive

`Derive` allows you to inject what's you want to context with access to existing context data and type-safety.
A handler will be called **every** update.

#### Global derive

```ts twoslash
// @errors: 2339 1003
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive((context) => {
        return {
            key: 1,
        };
    })
    .on("message", (context) => {
        context.key;
        //        ^?
    })
    .use((context, next) => {
        context.key;
        //       ^?

        return next();
    })
    .on("callback_query", (context) => {
        context.key;
        //         ^?
    });
```

#### Scoped derive

You can scope the derive to specific **update** (or **updates**) with full type support.

```ts twoslash
// @errors: 2339 1003
import { Bot } from "gramio";

// Simple example
export function findOrRegisterUser(id: number) {
    return {} as Promise<{ id: number; name: string; balance: number }>;
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive(["message", "callback_query"], async (context) => {
        const fromId = context?.from?.id;

        if(!fromId) throw new Error("No from id");

        return {
            fromId,
        }
    })
    .derive("message", async (context) => {
        const user = await findOrRegisterUser(context.fromId);
        //                                              ^?

        return {
            user,
        };
    })
    .on("message", (context) => {
        context.user.;
        //           ^|
        //
    })
    .use((context, next) => {
        if (context.is("message")) context.user;
        //                                  ^?

        return next();
    })
    .on("callback_query", (context) => {
        context.user;
        //         ^?
        context.fromId
        //          ^?
    });
```

## Decorate

With `decorate` you can inject **static values** and it will be injected to contexts **only when `decorate` called** (so it will not evaluate every update).

```ts twoslash
// @errors: 2339

import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .decorate("TEST", "hi!! you're cute" as const)
    .decorate({
        key: "value",
        key2: "value",
    })
    .use((context) => {
        context.TEST;
        //         ^?
        //

        context.k;
        //       ^|
    });
```
