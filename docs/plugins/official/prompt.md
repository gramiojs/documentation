# Prompt Plugin

Prompt plugin.

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

```ts twoslash
import { Bot, format, bold } from "gramio";
import { prompt } from "@gramio/prompt";

const bot = new Bot(process.env.token!)
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
// or with SendMessageParams
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
