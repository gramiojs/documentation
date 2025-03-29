---
title: Плагин автоматического повтора для GramIO

head:
    - - meta
      - name: "description"
        content: "Плагин, который ловит ошибки с полем retry_after (ошибки превышения лимита запросов), ждёт указанное время и повторяет API-запрос."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин авто-повтора, обработка ошибок 429, лимиты API телеграм, превышение лимита запросов, retry_after, flood wait, automatical retry, отправка массовых сообщений, rate limit, автоматическая повторная отправка, обработка флуда"
---

# Плагин автоматического повтора

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/auto-retry?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/auto-retry)
[![JSR](https://jsr.io/badges/@gramio/auto-retry)](https://jsr.io/@gramio/auto-retry)
[![JSR Score](https://jsr.io/badges/@gramio/auto-retry/score)](https://jsr.io/@gramio/auto-retry)

</div>

Плагин, который ловит ошибки с полем `retry_after` (**ошибки превышения лимита запросов**), **ждёт** указанное время и **повторяет** API-запрос.

### Установка

::: code-group

```bash [npm]
npm install @gramio/auto-retry
```

```bash [yarn]
yarn add @gramio/auto-retry
```

```bash [pnpm]
pnpm add @gramio/auto-retry
```

```bash [bun]
bun install @gramio/auto-retry
```

:::

### Использование

```ts
import { Bot } from "gramio";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(autoRetry())
    .command("start", async (context) => {
        for (let index = 0; index < 100; index++) {
            await context.reply(`сообщение ${index}`);
        }
    })
    .onStart(console.log);

bot.start();
``` 