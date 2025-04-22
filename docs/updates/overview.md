# Update handling

## Start

The `start` method launches the process of receiving updates from Telegram for your bot. Depending on the parameters provided, the bot can use long-polling or webhook to receive events. This method initializes the bot, loads [lazy plugins](/plugins/lazy-load), and calls the [`onStart`](/plugins/hooks#onstart) hook.

**Signature:**

```ts
start(options?): Promise<BotInfo>
```

**Parameters:**

-   `options` — an object with launch settings:
    -   `webhook` — parameters for starting via webhook (`true`, a URL string, or an object with parameters).
    -   `longPolling` — parameters for long-polling (for example, timeouts).
    -   `dropPendingUpdates` — whether to drop pending updates on start.
    -   `allowedUpdates` — a list of update types the bot will receive.
    -   `deleteWebhook` — how to handle an existing webhook when starting long-polling.

> [!IMPORTANT] > **Parameter details:**
>
> -   If you set `webhook: true`, GramIO will not attempt to set the webhook itself — it assumes you have already configured it. In this case, the bot will simply start receiving updates via the existing webhook.
>
> -   The `deleteWebhook` parameter controls what to do with an existing webhook when starting long-polling:
>     -   If `deleteWebhook: true`, the bot will always delete the webhook before starting long-polling.
>     -   If `deleteWebhook: "on-conflict-with-polling"`, the webhook will only be deleted if it interferes with starting long-polling (when Telegram responds to `getUpdates` with a conflict error).
>     -   If not specified, the default behavior (`on-conflict-with-polling`) is used.

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN)
    .command("start", (ctx) => ctx.send("Hi!"))
    .onStart(console.log);

await bot.start({
    longPolling: { timeout: 10 },
    dropPendingUpdates: true,
});
```

**How it works:**

-   If webhook is not specified, long-polling is started.
-   If webhook is specified, the webhook is set up and the bot starts receiving updates via HTTP.
-   Calls the [`onStart`](/plugins/hooks#onstart) hook.
-   You can drop old updates on start.

## Stop

The `stop` method stops receiving updates and gracefully shuts down all internal bot processes. The [`onStop`](/plugins/hooks#onstop) hook is called, and the update queue is cleared.

**Signature:**

```ts
stop(timeout?): Promise<void>
```

**Parameters:**

-   `timeout` — the time to wait for the update queue to finish processing (default is 3000 ms).

**Example usage:**

```ts
await bot.stop();
```

**How it works:**

-   Stops long-polling or webhook (if it was running).
-   Waits for all current updates to finish processing.
-   Calls the [`onStop`](/plugins/hooks#onstop) hook.

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
