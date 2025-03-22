---
title: Хук onResponseError в GramIO - Обработка ошибок API-запросов

head:
    - - meta
      - name: "description"
        content: "Хук onResponseError в GramIO вызывается после получения ответа с ошибкой от Telegram Bot API. Узнайте как обрабатывать неудачные запросы к API Telegram."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onResponseError, обработка ошибок API, TelegramError, отслеживание ошибок API, мониторинг запросов, логирование ошибок запросов, обработка HTTP ошибок, ошибки запросов, retry_after, обработка 429, перехват ошибок API, анализ ошибок запросов"
---

# onResponseError

Этот хук вызывается `после получения ответа с ошибкой` от Telegram Bot API.

## Параметры

[TelegramError](https://jsr.io/@gramio/core@latest/doc/~/TelegramError)

<!-- > [!IMPORTANT] -->

## Пример

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onResponseError(
    (context) => {
        console.log("Ошибка для", context.method, context.message);
    }
);
```

### Добавление хука только для определенных методов API

```ts
bot.onResponseError("sendMessage", (context) => {
    console.log("Ошибка для sendMessage", context.message);
});
// или массив
bot.onResponseError(["sendMessage", "sendPhoto"], (context) => {
    console.log("Ошибка для", context.method, context.message);
});
``` 