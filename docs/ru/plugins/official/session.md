---
title: Плагин сессий для GramIO

head:
    - - meta
      - name: "description"
        content: "Реализация постоянного хранения данных пользователей в Telegram-боте с помощью плагина сессий GramIO: ленивая загрузка, произвольные ключи и любые адаптеры хранилищ."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин сессий, управление состоянием, хранение данных пользователя, redis-хранилище, ленивые сессии, lazy session, getSessionKey, очистка сессии, постоянные данные, сессионные данные, типизация сессий, адаптеры хранилищ, персистентность данных, контекст пользователя, инициализация сессии"
---

# Плагин сессий

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/session?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/session)
[![JSR](https://jsr.io/badges/@gramio/session)](https://jsr.io/@gramio/session)
[![JSR Score](https://jsr.io/badges/@gramio/session/score)](https://jsr.io/@gramio/session)

</div>

Плагин сессий для GramIO.

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
        context.send(`количество яблок: ${++context.sessionKey.apple}`);
        //                                              ^?
    })
    .onStart(console.log);

bot.start();
```

Этот плагин можно использовать с любым хранилищем ([Подробнее](/ru/storages))

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
        context.send(`количество яблок: ${++context.sessionKey.apple}`);
    })
    .onStart(console.log);

bot.start();
```

## Ленивые сессии

По умолчанию сессия загружается из хранилища при каждом обновлении, даже если обработчик к ней не обращается. Опция `lazy: true` откладывает загрузку до момента первого обращения к сессии, что позволяет значительно сократить число лишних запросов к хранилищу на высоконагруженных ботах.

```ts
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(
        session({
            key: "sessionKey",
            lazy: true,
            initial: () => ({ count: 0 }),
        })
    )
    .on("message", async (context) => {
        // Хранилище не читается до этой строки:
        const s = await context.sessionKey;
        s.count++;
        await context.send(`счётчик: ${s.count}`);
    });
```

В ленивом режиме `context.sessionKey` является `Promise` — всегда используйте `await` перед обращением к данным.

## Очистка сессии

Вызов `$clear()` на объекте сессии удаляет её из хранилища и сбрасывает к начальному состоянию при следующем обращении.

```ts
bot.on("message", async (context) => {
    if (context.text === "/reset") {
        await context.sessionKey.$clear();
    }
});
```

В ленивом режиме сначала нужно разрешить промис:

```ts
bot.on("message", async (context) => {
    if (context.text === "/reset") {
        const s = await context.sessionKey;
        await s.$clear();
    }
});
```

## Произвольные ключи сессий

По умолчанию сессии хранятся по `senderId`. Используйте `getSessionKey`, чтобы изменить стратегию именования.

```ts
// Сессия на уровне чата
session({
    getSessionKey: (ctx) => `chat:${ctx.chatId}`,
    initial: () => ({ topic: "" }),
})

// Сессия на уровне пользователь + чат
session({
    getSessionKey: (ctx) => `${ctx.senderId}:${ctx.chatId}`,
    initial: () => ({ preferences: {} }),
})
```

## TypeScript

Тип данных сессии выводится автоматически из возвращаемого типа функции `initial`. При необходимости можно задать явный интерфейс.

```ts
interface MySessionData {
    apple: number;
    some?: "maybe-empty";
}

// Обычный режим — ctx.sessionKey: MySessionData & { $clear(): Promise<void> }
bot.extend(
    session({
        key: "sessionKey",
        initial: (): MySessionData => ({ apple: 1 }),
    })
);

// Ленивый режим — ctx.sessionKey: Promise<MySessionData & { $clear(): Promise<void> }>
bot.extend(
    session({
        key: "sessionKey",
        lazy: true,
        initial: (): MySessionData => ({ apple: 1 }),
    })
);
```
