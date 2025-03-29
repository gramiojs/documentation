---
title: Построитель клавиатур - Создание интерактивных кнопок

head:
    - - meta
      - name: "description"
        content: "Научитесь создавать интерактивные клавиатуры для вашего Telegram бота с помощью GramIO. Освойте обычные клавиатуры, инлайн-клавиатуры, настраиваемые макеты и продвинутые шаблоны клавиатур."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, клавиатуры в телеграме, создание кнопок, InlineKeyboard, Keyboard, Reply keyboard, ForceReplyKeyboard, RemoveKeyboard, кнопки бота, разметка кнопок, матрица кнопок, URL кнопки, WebApp кнопки, CallbackQuery, чанки кнопок, ряды кнопок, колонки кнопок"
---

# Обзор

[`@gramio/keyboards`](https://github.com/gramiojs/keyboards) - это встроенный пакет GramIO. Вы также можете использовать его вне этого фреймворка, так как он не зависит от него.

Смотрите также [API Reference](https://jsr.io/@gramio/keyboards/doc).

### Установка (не требуется для пользователей GramIO)

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

## Использование

::: code-group

```ts twoslash [с GramIO]
import { Keyboard } from "gramio";

const keyboard = new Keyboard()
    .text("первая строка")
    .row()
    .text("вторая строка");
```

```ts twoslash [без GramIO]
import { Keyboard } from "@gramio/keyboards";

const keyboard = new Keyboard()
    .text("первая строка")
    .row()
    .text("вторая строка")
    .build();
```

:::

### Отправка через [GramIO](https://gramio.dev/)

```ts
import { Bot, Keyboard } from "gramio"; // импорт из пакета GramIO!!

const bot = new Bot(process.env.BOT_TOKEN as string);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.send("тест", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("простая клавиатура")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla"),
    });
});

bot.start();
```

### Отправка через [Grammy](https://grammy.dev/)

```ts
import { Keyboard } from "@gramio/keyboards";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN as string);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.reply("тест", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("простая клавиатура")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});

bot.start();
```

### Отправка через [Telegraf](https://github.com/telegraf/telegraf)

> [!WARNING] > `Telegraf` не поддерживает последнюю версию Bot API

```ts
import { Keyboard } from "@gramio/keyboards";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.reply("тест", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("простая клавиатура")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});

bot.launch();
```

### Отправка через [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api)

> [!WARNING] > `node-telegram-bot-api` не поддерживает последнюю версию Bot API, и типы написаны плохо, поэтому типы могут не совпадать

```ts
import { Keyboard } from "@gramio/keyboards";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TOKEN as string, { polling: true });

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (msg) => {
    return bot.sendMessage(msg.chat.id, "тест", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("простая клавиатура")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});
```

### Отправка через [puregram](https://puregram.cool/)

> [!WARNING] > `puregram` не поддерживает последнюю версию Bot API

```ts
import { Telegram } from "puregram";
import { Keyboard } from "@gramio/keyboards";

const bot = new Telegram({
    token: process.env.TOKEN as string,
});

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.send("тест", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("простая клавиатура")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
    });
});

bot.updates.startPolling();
```

#### Результат

```json
{
    "keyboard": [
        [
            {
                "text": "простая клавиатура"
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
