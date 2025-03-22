---
title: Плагин сессий для GramIO

head:
    - - meta
      - name: "description"
        content: "Как использовать сессии (возможно, с Redis) в GramIO"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин сессий, управление состоянием, хранение данных пользователя, redis-хранилище, постоянные данные, сессионные данные, типизация сессий, адаптеры хранилищ, персистентность данных, контекст пользователя, инициализация сессии"
---

# Плагин сессий

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/session?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/session)
[![JSR](https://jsr.io/badges/@gramio/session)](https://jsr.io/@gramio/session)
[![JSR Score](https://jsr.io/badges/@gramio/session/score)](https://jsr.io/@gramio/session)

</div>

Плагин сессий для GramIO.

**Пока не оптимизирован и находится в разработке.**

### Установка

::: code-group

```bash [npm]
npm install @gramio/session
```

```bash [yarn]
yarn add @gramio/session
```

```bash [pnpm]
pnpm add @gramio/session
```

```bash [bun]
bun install @gramio/session
```

:::

## Использование

```ts twoslash
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "sessionKey",
            initial: () => ({ apple: 1 }),
        })
    )
    .on("message", (context) => {
        context.send(`🍏 количество яблок: ${++context.sessionKey.apple}`);
        //                                              ^?
    })
    .onStart(console.log);

bot.start();
```

Этот плагин можно использовать с любым хранилищем ([Подробнее](/ru/storages/index))

### Пример с Redis

[Больше информации](https://github.com/gramiojs/storages/tree/master/packages/redis)

```ts
import { Bot } from "gramio";
import { session } from "@gramio/session";
import { redisStorage } from "@gramio/storage-redis";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "sessionKey",
            initial: () => ({ apple: 1 }),
            storage: redisStorage(),
        })
    )
    .on("message", (context) => {
        context.send(`🍏 количество яблок: ${++context.sessionKey.apple}`);
    })
    .onStart(console.log);

bot.start();
```

### TypeScript

Чтобы **типизировать** данные сессии, укажите тип как `ReturnType` начальной функции.

```ts
interface MySessionData {
    apple: number;
    some?: "maybe-empty";
}

bot.extend(
    session({
        key: "sessionKey",
        initial: (): MySessionData => ({ apple: 1 }),
    })
);
``` 