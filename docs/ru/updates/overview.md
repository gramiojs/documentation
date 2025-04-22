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

# Обработка обновлений

## Start

Метод `start` запускает процесс получения обновлений от Telegram для вашего бота. В зависимости от переданных параметров, бот может использовать long-polling или webhook для получения событий. Этот метод инициализирует бота, подгружает [lazy плагины](/ru/plugins/lazy-load) и вызывает хук [`onStart`](/ru/hooks/on-start).

**Сигнатура:**

```ts
start(options?): Promise<BotInfo>
```

**Параметры:**

-   `options` — объект с настройками запуска:
    -   `webhook` — параметры для запуска через webhook (`true`, строка-URL или объект с параметрами).
    -   `longPolling` — параметры для long-polling (например, таймауты).
    -   `dropPendingUpdates` — сбрасывать ли неотправленные обновления при запуске.
    -   `allowedUpdates` — список типов обновлений, которые бот будет получать.
    -   `deleteWebhook` — как поступать с существующим webhook при запуске long-polling.

> [!IMPORTANT]
>
> **Особенности параметров:**
>
> -   Если указать `webhook: true`, GramIO не будет пытаться установить webhook самостоятельно — предполагается, что вы уже настроили его. В этом случае бот просто начнёт принимать обновления через уже существующий webhook.
>
> -   Параметр `deleteWebhook` управляет тем, что делать с существующим webhook при запуске long-polling:
>     -   Если `deleteWebhook: true`, бот всегда удаляет webhook перед запуском long-polling.
>     -   Если `deleteWebhook: "on-conflict-with-polling"`, webhook будет удалён только если он мешает запуску long-polling (когда Telegram отвечает на запрос `getUpdates` с ошибкой конфликта).
>     -   Если не указано, используется поведение по умолчанию (`on-conflict-with-polling`).

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN)
    .command("start", (ctx) => ctx.send("Привет!"))
    .onStart(console.log);

await bot.start({
    longPolling: { timeout: 10 },
    dropPendingUpdates: true,
});
```

**Описание работы:**

-   Если не указан webhook, запускается long-polling.
-   Если указан webhook, настраивается webhook и бот начинает принимать обновления через HTTP.
-   Вызывает хук [`onStart`](/ru/hooks/on-start).
-   Можно сбросить старые обновления при запуске.

## Stop

Метод `stop` завершает приём обновлений и корректно останавливает все внутренние процессы бота. Вызывается хук [`onStop`](/ru/hooks/on-stop), очищается очередь обновлений.

**Сигнатура:**

```ts
stop(timeout?): Promise<void>
```

**Параметры:**

-   `timeout` — время ожидания завершения обработки очереди обновлений (по умолчанию 3000 мс).

**Пример использования:**

```ts
await bot.stop();
```

**Описание работы:**

-   Останавливает long-polling или webhook (если был запущен).
-   Дожидается завершения обработки всех текущих обновлений.
-   Вызывает хук [`onStop`](/ru/hooks/on-stop).

## Контекст

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
