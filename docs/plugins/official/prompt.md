---
title: Prompt Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "Easy way to prompt users for input in your Telegram bot"

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, prompt plugin, user input handling, dialog interface, multi-step scenarios, response validation, answer transformation, wait method, message waiting, callback query handling, user surveys, bot conversation"
---

# Prompt Plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/prompt?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/prompt)
[![JSR](https://jsr.io/badges/@gramio/prompt)](https://jsr.io/@gramio/prompt)
[![JSR Score](https://jsr.io/badges/@gramio/prompt/score)](https://jsr.io/@gramio/prompt)

</div>

A plugin that provides [Prompt](#prompt) and [Wait](#wait) methods

> [!NOTE]
> We recommend considering `scenes` instead. Please see the [comparison of `prompt` and `scenes`](/plugins/official/scenes#vs-prompt)

### Installation

::: code-group

```bash [npm]
npm install @gramio/prompt
```

```bash [yarn]
yarn add @gramio/prompt
```

```bash [pnpm]
pnpm add @gramio/prompt
```

```bash [bun]
bun install @gramio/prompt
```

:::

## Usage

```ts
import { Bot, format, bold } from "gramio";
import { prompt } from "@gramio/prompt";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(prompt())
    .command("start", async (context) => {
        const answer = await context.prompt(
            "message",
            format`What's your ${bold`name`}?`
        );

        return context.send(`✨ Your name is ${answer.text}`);
    })
    .onStart(console.log);

bot.start();
```

## Prompt

### Prompt with text + params

```ts
const answer = await context.prompt("What's your name?");
// or with SendMessageParams
const answer = await context.prompt("True or false?", {
    reply_markup: new Keyboard().text("true").row().text("false"),
});
```

answer is `MessageContext` or `CallbackQueryContext`

### Prompt with text + params and the specified event

```ts
const answer = await context.prompt("message", "What's your name?");

const answer = await context.prompt("callback_query", "True or false?", {
    reply_markup: new InlineKeyboard()
        .text("true", "true")
        .row()
        .text("false", "false"),
});
```

answer is `CallbackQueryContext`

### Validation

You can define a handler in params to validate the user's answer.
If handler returns false, the message will be repeated.

```ts
const answer = await context.prompt(
    "message",
    "Enter a string that contains russian letter",
    {
        validate: (context) => /[а-яА-Я]/.test(context.text),
        //... and some SendMessageParams
    }
);
```

### Transform

```ts
const name = await context.prompt(
    "message",
    format`What's your ${bold`name`}?`,
    {
        transform: (context) => context.text || context.caption || "",
    }
);
```

name is `string`

## Wait

### Wait for the next event from the user

```ts
const answer = await context.wait();
```

answer is `MessageContext` or `CallbackQueryContext`

### Wait for the next event from the user ignoring events not listed

```ts
const answer = await context.wait("message");
```

answer is `CallbackQueryContext`

### Wait for the next event from the user ignoring non validated answers

You can define a handler in params to validate the user's answer.
If handler return `false`, the **message** will be ignored

```ts
const answer = await context.wait((context) => /[а-яА-Я]/.test(context.text));
// or combine with event
const answer = await context.wait("message", (context) =>
    /[а-яА-Я]/.test(context.text)
);
```

### Wait for the next event from the user ignoring non validated answers with transformer

You can define a handler in params to **transform** the user's answer.

```ts
const answer = await context.wait((context) => /[а-яА-Я]/.test(context.text));
// or combine with event
const answer = await context.wait("message", {
    validate: (context) => /[а-яА-Я]/.test(context.text),
    transform: (context) => c.text || "",
});
```

answer is `string`

## waitWithAction

This function is similar to `wait`, but allows you to perform an action while waiting for an event and get both results.

```ts
const [answer, sentMessage] = await context.waitWithAction(
    "message",
    () => context.send("Please enter your name"),
    {
        validate: (ctx) => !!ctx.text,
        transform: (ctx) => ctx.text.toUpperCase(),
        onValidateError: "Please enter a valid name!",
    }
);

// answer has type `string`
// sentMessage has type `MessageContext`
```
