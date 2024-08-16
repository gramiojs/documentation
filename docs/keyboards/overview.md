---
title: Keyboard builder for Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "Build keyboards for your Telegram Bot in a convenient way."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, keyboard, builder, inline keyboard, chunk, pattern, matrix, url, webapp"
---

# Overview

[`@gramio/keyboards`](https://github.com/gramiojs/keyboards) is built-in GramIO package. You can also use it outside of this framework because it is framework-agnostic.

See also [API Reference](https://jsr.io/@gramio/keyboards/doc).

### Installation (not required for GramIO users)

::: code-group

```bash [npm]
npm install @gramio/keyboards
```

```bash [yarn]
yarn add @gramio/keyboards
```

```bash [pnpm]
pnpm add @gramio/keyboards
```

```bash [bun]
bun install @gramio/keyboards
```

:::

## Usage

::: code-group

```ts twoslash [with GramIO]
import { Keyboard } from "gramio";

const keyboard = new Keyboard().text("first row").row().text("second row");
```

```ts twoslash [without GramIO]
import { Keyboard } from "@gramio/keyboards";

const keyboard = new Keyboard()
    .text("first row")
    .row()
    .text("second row")
    .build();
```

:::

### Send via [GramIO](https://gramio.dev/)

```ts
import { Bot, Keyboard } from "gramio"; // import from GramIO package!!

const bot = new Bot(process.env.BOT_TOKEN as string);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.send("test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla"),
    });
});
```

### Send via [Grammy](https://grammy.dev/)

```ts
import { Keyboard } from "@gramio/keyboards";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN as string);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.reply("test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});

bot.start();
```

### Send via [Telegraf](https://github.com/telegraf/telegraf)

> [!WARNING]
> The `Telegraf` does not support the latest version of Bot API

```ts
import { Keyboard } from "@gramio/keyboards";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.reply("test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});

bot.launch();
```

### Send via [puregram](https://puregram.cool/)

```ts
import { Telegram } from "puregram";
import { Keyboard } from "@gramio/keyboards";

const bot = new Telegram({
    token: process.env.TOKEN as string,
});

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.send("test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});

bot.updates.startPolling();
```

### Send via [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api)

> [!WARNING]
> The `node-telegram-bot-api` does not support the latest version of Bot API and the types are badly written, so the types may not match

```ts
import { Keyboard } from "@gramio/keyboards";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TOKEN as string, { polling: true });

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (msg) => {
    return bot.sendMessage(msg.chat.id, "test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});
```

#### Result

```json
{
    "keyboard": [
        [
            {
                "text": "simple keyboard"
            }
        ],
        [
            {
                "text": "Apple"
            }
        ],
        [
            {
                "text": "Realme"
            }
        ],
        [
            {
                "text": "Xiaomi"
            }
        ]
    ],
    "one_time_keyboard": false,
    "is_persistent": false,
    "selective": false,
    "resize_keyboard": true
}
```

![image](https://github.com/gramiojs/keyboards/assets/57632712/e65e2b0a-40f0-43ae-9887-04360e6dbeab)
