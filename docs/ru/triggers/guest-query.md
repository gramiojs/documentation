---
title: guestQuery - Обработка гостевых сообщений Telegram Bot API 10.0 в GramIO

head:
    - - meta
      - name: "description"
        content: "Узнайте, как обрабатывать гостевые сообщения в вашем Telegram-боте на GramIO. Триггер guestQuery отвечает на апдейт guest_message из Bot API 10.0 и отвечает через ctx.answerGuestQuery()."

    - - meta
      - name: "keywords"
        content: "telegram bot, фреймворк, как создать бота, Telegram, Telegram Bot API, Bot API 10.0, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, гостевое сообщение, гостевой запрос, guestQuery, answerGuestQuery, апдейт guest_message, guestQueryId, supportsGuestQueries"
---

# guestQuery

Метод `guestQuery` обрабатывает **гостевые сообщения** — фичу из [Telegram Bot API 10.0](https://core.telegram.org/bots/api-changelog). Гостевое сообщение позволяет пользователю достучаться до бота без обычного чата и приходит как новый апдейт `guest_message`. GramIO маппит этот апдейт в `MessageContext` и даёт отдельный метод ответа `ctx.answerGuestQuery()`.

> [!NOTE]
> `bot.guestQuery(...)` требует **gramio v0.10.0+** (Bot API 10.0). Это аналог [`inlineQuery`](/ru/triggers/inline-query) для гостевых сообщений — та же форма триггера, другая семантика ответа.

## Базовое использование

Форма повторяет [`inlineQuery`](/ru/triggers/inline-query): триггер (строка, RegExp, предикат или ничего), за которым идёт хендлер. Передай **без триггера**, чтобы ловить любое гостевое сообщение:

```ts
// Ловим любое гостевое сообщение
bot.guestQuery(async (context) => {
    await context.answerGuestQuery();
});
```

Фильтруй по тексту гостевого запроса строкой, RegExp или функцией — захваты попадают в `context.args`, ровно как у остальных текстовых триггеров:

```ts
// RegExp — захваты через context.args
bot.guestQuery(/^order (.+)/i, async (context) => {
    const orderId = context.args![1];
    await context.answerGuestQuery();
});

// Функция-матчер — возвращает boolean
bot.guestQuery(
    (context) => context.from?.is_premium === true,
    (context) => context.answerGuestQuery(),
);
```

## Почему он отдельно от `command` / `hears`

У гостевых сообщений **другая семантика ответа**, чем у обычных: отвечаешь через `ctx.answerGuestQuery()`, а не `ctx.send()` / `ctx.reply()`. Оставив `guestQuery` отдельным триггером (а не подмешав гостевые сообщения в `command` / `hears` / `startParameter`), мы делаем это различие явным и держим обработчики гостевого флоу в одном месте.

## Хелперы контекста

На контексте гостевого сообщения доступны новые геттеры Bot API 10.0:

| Геттер / метод | Описание |
|---|---|
| `context.guestQueryId` | id гостевого запроса, на который нужно ответить |
| `context.guestBotCallerUser` | пользователь, инициировавший гостевое сообщение |
| `context.guestBotCallerChat` | чат, из которого пришло гостевое сообщение |
| `context.answerGuestQuery()` | ответить на гостевой запрос |

`User.supportsGuestQueries()` позволяет проверить, может ли конкретный пользователь принимать гостевые запросы, до старта флоу.

## Включаем гостевые запросы

`guest_message` — один из типов апдейтов, которые Telegram доставляет только когда они перечислены в `allowed_updates`. [`AllowedUpdatesFilter`](/api/gramio/classes/AllowedUpdatesFilter) в GramIO выводит его автоматически, когда ты регистрируешь хендлер `guestQuery`, так что дефолтный `bot.start()` опт-инит сам.

## Смотрите также

- [`inlineQuery`](/ru/triggers/inline-query) — аналог для инлайн-режима с такой же формой триггера.
- [`chosenInlineResult`](/ru/triggers/chosen-inline-result) — обработка того, какой инлайн-результат выбрал пользователь.
