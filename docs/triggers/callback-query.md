---
title: callbackQuery - Handle updates when users interact with Inline keyboard

head:
    - - meta
      - name: "description"
        content: "The `callbackQuery` method in GramIO is used to handle updates that occur when users interact with inline keyboard buttons in your Telegram bot. When a user clicks on a button with a callback data payload, Telegram sends a `callback_query` update to your bot. This method allows you to register a handler for these updates, enabling you to perform actions based on the user's interaction."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, callback query, button clicks, inline keyboard, callback data, button click response, answerCallbackQuery, regex callback, json callback, parse callback, callback validation, callback queries, callback handler, button interaction, safeUnpack, schema migration, CallbackData"
---

# `callbackQuery` Method

The `callbackQuery` method in GramIO is used to handle updates that occur when users interact with [inline keyboard](/keyboards/inline-keyboard) buttons in your Telegram bot. When a user clicks on a button with a callback data payload, Telegram sends a `callback_query` update to your bot. This method allows you to register a handler for these updates, enabling you to perform actions based on the user's interaction.

## Basic Usage

### Handling Callback Queries

To use the `callbackQuery` method, you need to define a trigger and a handler. The trigger determines when the handler should be executed based on the callback data received, and the handler performs the desired action.

```ts twoslash
import { CallbackData, Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const someData = new CallbackData("example").number("id");

bot.callbackQuery(someData, (context) => {
    return context.send(`You clicked button with ID: ${context.queryData.id}`);
    //                                                          ^?
});
```

In this example:

- `someData` is a `CallbackData` instance defining the schema for the callback data.
- The `callbackQuery` method registers a handler that is triggered when the callback data matches `someData`.
- Inside the handler, `context.queryData` provides type-safe access to the callback data.

### Trigger Types

The `callbackQuery` method supports several types of triggers:

- **String Trigger**: The handler is triggered if the callback data exactly matches the specified string.

```ts
bot.callbackQuery("my_callback", (context) => {
    return context.editText("Button clicked!");
});
```

- **RegExp Trigger**: The handler is triggered if the callback data matches the regular expression.

```ts
bot.callbackQuery(/my_(.*)/, (context) => {
    const match = context.queryData;
    context.send(`Matched data: ${match[1]}`);
});
```

- **CallbackData Instance**: The handler is triggered if the callback data matches the `CallbackData` schema.

```ts twoslash
import { CallbackData, Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const someData = new CallbackData("example").number("id");

bot.callbackQuery(someData, (context) => {
    context.send(`Data ID: ${context.queryData.id}`);
    //                                  ^?
});
```

### Handling Callback Data

When a callback query is received, the `context` object includes the following relevant properties:

- `context.data`: The raw callback data payload.
- `context.queryData`: The deserialized data, if a `CallbackData` instance was used for the trigger.

### Example Scenario

Consider a scenario where you want to send a message with an inline keyboard and handle button clicks:

```ts
const buttonData = new CallbackData("action").number("action_id");

bot.command("start", (context) =>
    context.send("Choose an action:", {
        reply_markup: new InlineKeyboard().text(
            "Do Action 1",
            buttonData.pack({ action_id: 1 })
        ),
    })
).callbackQuery(buttonData, (context) => {
    context.send(`You selected action with ID: ${context.queryData.action_id}`);
});
```

In this example:

1. A `/start` command sends a message with an inline keyboard button.
2. The button's callback data is packed using `buttonData.pack()`.
3. The `callbackQuery` method listens for callback queries that match `buttonData`.
4. The handler responds with the ID of the selected action.

## Schema Migrations & `safeUnpack()`

Inline keyboard buttons persist in Telegram's chat history — users can press a button days or weeks after it was sent. If your `CallbackData` schema changes between deployments, old buttons may carry data that no longer matches your schema.

### What's safe to change

| Operation | Safe? | Why |
|---|---|---|
| Add optional field to the end | ✅ Yes | Old data unpacks as `undefined` / default |
| Add default to existing optional | ✅ Yes | Only changes missing-value behavior |
| Add required field | ❌ No | Old data has no value for it |
| Remove a field | ❌ No | Shifts positions of all following fields |
| Reorder fields | ❌ No | Positional format — values land in wrong fields |
| Change field type | ❌ No | Deserialized by wrong algorithm |
| Rename `nameId` | ❌ No | `callbackQuery(schema)` won't match old buttons |

### `safeUnpack()` — for raw `callback_query` handlers

`bot.callbackQuery(schema, handler)` handles filtering and unpacking automatically — inside the handler you always have valid `ctx.queryData`. **You don't need `safeUnpack` there.**

`safeUnpack()` is useful when you handle `callback_query` with `bot.on()` and want to try multiple schemas or gracefully handle outdated buttons:

```ts
const v2Schema = new CallbackData("item").number("id").string("tab", { optional: true });

bot.on("callback_query", (ctx) => {
    const result = v2Schema.safeUnpack(ctx.data ?? "");

    if (!result.success) {
        // old button — schema changed or wrong nameId
        return ctx.answerCallbackQuery({ text: "This button is outdated, please use the new menu." });
    }

    // result.data is fully typed: { id: number; tab: string | undefined }
    return ctx.answerCallbackQuery({ text: `Item ${result.data.id}` });
});
```

The return type is `SafeUnpackResult<T>`, exported from `@gramio/callback-data`:

```ts
import type { SafeUnpackResult } from "@gramio/callback-data";

function handleData(raw: string): SafeUnpackResult<{ id: number }> {
    return mySchema.safeUnpack(raw);
}
```
