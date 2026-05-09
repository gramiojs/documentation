---
title: Auto answer callback query Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "Automatically respond to Telegram inline button presses by answering callback queries when your handler doesn't, removing the loading indicator."

    - - meta
      - name: "keywords"
        content: "Telegram bot, GramIO, callback query, auto answer plugin, inline buttons, answerCallbackQuery, remove loading indicator, button click handling, automatic response, inline keyboard, user interaction, button press feedback, callback handling, TypeScript, Deno, Bun, Node.js, Telegram UI, bot responsiveness"
---

# Auto answer callback query plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/auto-answer-callback-query?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/auto-answer-callback-query)
[![JSR](https://jsr.io/badges/@gramio/auto-answer-callback-query)](https://jsr.io/@gramio/auto-answer-callback-query)
[![JSR Score](https://jsr.io/badges/@gramio/auto-answer-callback-query/score)](https://jsr.io/@gramio/auto-answer-callback-query)

</div>

This plugin auto answer on `callback_query` events with `answerCallbackQuery` method if you haven't done it yet.

### Installation

::: pm-add @gramio/auto-answer-callback-query
:::

```ts
import { Bot, InlineKeyboard } from "gramio";
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(autoAnswerCallbackQuery())
    .command("start", (context) =>
        context.send("Hello!", {
            reply_markup: new InlineKeyboard()
                .text("test", "test")
                .text("test2", "test2"),
        })
    )
    .callbackQuery("test", () => {
        // The plugin will call an answerCallbackQuery method since you didn't do it
        return context.send("Hii");
    })
    .callbackQuery("test2", (context) => {
        // you already answered so plugin won't try to answer
        return context.answer("HII");
    });
```

### Params

You can pass params for [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery) method

```ts
bot.extend(
    autoAnswerCallbackQuery({
        text: "Auto answer",
        show_alert: true,
    })
);
```

> [!IMPORTANT]
> This plugin hijack the `context.answerCallbackQuery` (`context.answer` too) method to determine if the callback query was already answered or not. Please avoid global usage of `bot.api.answerCallbackQuery` method in context because plugin can not work properly in this case.

### Throw safety (since v0.0.3)

Even when your handler throws, the plugin still calls `answerCallbackQuery` — so the user never ends up with a stuck spinner on the button. The middleware wraps the handler in `try/finally`, so the auto-answer runs in the `finally` branch regardless of the error:

```ts
bot.callbackQuery("test", async (context) => {
    throw new Error("boom");
    // The plugin still answers the callback query —
    // the spinner clears, then the error reaches your bot.onError handler.
});
```
