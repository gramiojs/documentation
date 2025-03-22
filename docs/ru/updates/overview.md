---
title: Обработка обновлений Telegram Bot API - Работа с контекстом и событиями

head:
    - - meta
      - name: "description"
        content: "Научитесь эффективно работать с обновлениями Telegram Bot API в GramIO. Узнайте, как обрабатывать различные типы событий, использовать контекст и создавать обработчики для сообщений, нажатий кнопок и других типов взаимодействий."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, обработка обновлений, context объект, middleware, события бота, Update типы, обработчики событий, next функция, цепочка middleware, message события, callback_query события, фильтрация обновлений, маршрутизация событий, edited_message, channel_post, inline_query, polling, webhook, типы обновлений, регистрация обработчиков"
---

# Контекст

## Прослушивание всех событий

```ts
bot.use((context, next) => {
    // ...
});
```

## Прослушивание только определенных событий

```ts
bot.on("message", (context, next) => {
    // ...
});
// или
bot.on(["message", "callback_query"], (context, next) => {
    // ...
});
```

Вы можете ознакомиться с API Reference для контекстов [здесь](https://jsr.io/@gramio/contexts/doc).

# Внедрение в контекст

## Derive

`Derive` позволяет внедрить в контекст что угодно, с доступом к существующим данным контекста и с проверкой типов.
Обработчик будет вызываться при **каждом** обновлении.

#### Глобальный derive

```ts twoslash
// @errors: 2339 1003
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive((context) => {
        return {
            key: 1,
        };
    })
    .on("message", (context) => {
        context.key;
        //        ^?
    })
    .use((context, next) => {
        context.key;
        //       ^?

        return next();
    })
    .on("callback_query", (context) => {
        context.key;
        //         ^?
    });
```

#### Ограниченный (scoped) derive

Вы можете ограничить derive для конкретного **обновления** (или **обновлений**) с полной поддержкой типов.

```ts twoslash
// @errors: 2339 1003
import { Bot } from "gramio";

// Простой пример
export function findOrRegisterUser(id: number) {
    return {} as Promise<{ id: number; name: string; balance: number }>;
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive(["message", "callback_query"], async (context) => {
        const fromId = context?.from?.id;

        if(!fromId) throw new Error("No from id");

        return {
            fromId,
        }
    })
    .derive("message", async (context) => {
        const user = await findOrRegisterUser(context.fromId);
        //                                              ^?

        return {
            user,
        };
    })
    .on("message", (context) => {
        context.user.;
        //           ^|
        //
    })
    .use((context, next) => {
        if (context.is("message")) context.user;
        //                                  ^?

        return next();
    })
    .on("callback_query", (context) => {
        context.user;
        //         ^?
        context.fromId
        //          ^?
    });
```

## Decorate

С помощью `decorate` вы можете внедрить **статические значения**, и они будут внедрены в контексты **только когда вызывается `decorate`** (т.е. они не будут вычисляться при каждом обновлении).

```ts twoslash
// @errors: 2339

import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .decorate("TEST", "привет!! ты милашка" as const)
    .decorate({
        key: "значение",
        key2: "значение",
    })
    .use((context) => {
        context.TEST;
        //         ^?
        //

        context.k;
        //       ^|
    });
``` 