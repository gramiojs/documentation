---
name: triggers
description: All GramIO trigger types — command, hears, callbackQuery, inlineQuery, chosenInlineResult, reaction — with matchers and context properties.
---

# Triggers

## command

```typescript
bot.command("start", (context) => {
    context.args; // everything after "/start " (string)
    return context.send("Welcome!");
});
```

- Do NOT include `/` in the command name.
- Automatically handles `/start@bot_username` (deep linking).
- `context.args` contains text after the command.

## hears

Matches message text. Accepts RegExp, string, or function:

```typescript
// RegExp — captures available via context.args
bot.hears(/hello (.*)/i, (context) => {
    return context.send(`Hello, ${context.args![1]}!`);
});

// Exact string match
bot.hears("start", (context) => context.send("Matched 'start'"));

// Function matcher — return boolean
bot.hears(
    (context) => context.from?.is_premium === true,
    (context) => context.send("Premium user detected!")
);
```

## callbackQuery

Matches callback button presses. Accepts string, RegExp, or `CallbackData` instance:

```typescript
// String match
bot.callbackQuery("approve", (context) => {
    return context.answer("Approved!");
});

// RegExp
bot.callbackQuery(/action_(\d+)/, (context) => {
    return context.answer(`Action: ${context.data}`);
});

// Type-safe CallbackData (see callback-data reference)
const itemData = new CallbackData("item").number("id").string("action");
bot.callbackQuery(itemData, (context) => {
    // context.queryData is typed: { id: number, action: string }
    return context.answer(`Item ${context.queryData.id}: ${context.queryData.action}`);
});
```

## inlineQuery

Matches inline queries. Requires enabling inline mode via @BotFather `/setinline`.

```typescript
import { InlineQueryResult, InputMessageContent } from "gramio";

bot.inlineQuery(/find (.*)/i, async (context) => {
    await context.answer(
        [
            InlineQueryResult.article(
                "id-1",
                `Result for ${context.args![1]}`,
                InputMessageContent.text(
                    format`Found: ${bold(context.args![1])}`
                )
            ),
        ],
        { cache_time: 0 }
    );
}, {
    // Optional: handle when user picks this result
    onResult: (context) => context.editText("You selected this!"),
});
```

## chosenInlineResult

Fires when user picks an inline result. Requires @BotFather `/setinlinefeedback`.

```typescript
bot.chosenInlineResult(/search (.*)/i, async (context) => {
    await context.editText(`You chose: ${context.resultId}`);
});
```

Can only edit messages that contain an InlineKeyboard.

## reaction

```typescript
// Single emoji
bot.reaction("👍", (context) => context.reply("Thanks!"));

// Multiple emojis
bot.reaction(["👍", "❤️"], (context) => context.reply("Appreciated!"));
```

## Generic Update Handlers

```typescript
// All updates
bot.use((context, next) => {
    console.log("Update received:", context.updateId);
    return next();
});

// Specific update type
bot.on("message", (context) => { /* message context */ });

// Multiple types
bot.on(["message", "callback_query"], (context) => { /* union context */ });
```

<!--
Source: https://gramio.dev/triggers/
-->
