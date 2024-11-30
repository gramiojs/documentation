---
title: Auto answer callback query plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "This plugin auto answer on callback_query events with answerCallbackQuery method if you haven't done it yet."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, plugin, callback_query, answerCallbackQuery, auto answer, how to answer on callback query, telegram button loading"
---

# Auto answer callback query plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/auto-answer-callback-query?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/auto-answer-callback-query)
[![JSR](https://jsr.io/badges/@gramio/auto-answer-callback-query)](https://jsr.io/@gramio/auto-answer-callback-query)
[![JSR Score](https://jsr.io/badges/@gramio/auto-answer-callback-query/score)](https://jsr.io/@gramio/auto-answer-callback-query)

</div>

This plugin auto answer on `callback_query` events with `answerCallbackQuery` method if you haven't done it yet.

### Installation

::: code-group

```bash [npm]
npm install @gramio/auto-answer-callback-query
```

```bash [yarn]
yarn add @gramio/auto-answer-callback-query
```

```bash [pnpm]
pnpm add @gramio/auto-answer-callback-query
```

```bash [bun]
bun install @gramio/auto-answer-callback-query
```

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
