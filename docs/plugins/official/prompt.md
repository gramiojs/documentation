---
title: Prompt Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "Easy to ask user for something in your Telegram Bot"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, plugin, prompt, wait, ask, conversation, dialog"
---

# Prompt Plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/prompt?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/prompt)
[![JSR](https://jsr.io/badges/@gramio/prompt)](https://jsr.io/@gramio/prompt)
[![JSR Score](https://jsr.io/badges/@gramio/prompt/score)](https://jsr.io/@gramio/prompt)

</div>

A plugin that provides [Prompt](#prompt) and [Wait](#wait) methods

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
