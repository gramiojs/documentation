---
title: Хук onResponse в GramIO - Обработка успешных API-запросов

head:
    - - meta
      - name: "description"
        content: "Хук onResponse в GramIO вызывается после получения успешного ответа от Telegram Bot API. Узнайте как обрабатывать успешные запросы к API и отслеживать параметры ответа."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onResponse, обработка API-запросов, мониторинг запросов, логирование успешных запросов, анализ ответов API, перехват успешных запросов, отслеживание взаимодействия с API, аналитика запросов, параметры API, оптимизация запросов"
---

# onResponse

Этот хук вызывается `после получения успешного ответа` от Telegram Bot API.

## Параметры

Объект с:

- method - название метода API
- params - параметры метода API
- response - ответ

<!-- > [!IMPORTANT] -->

## Пример

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onResponse((context) => {
    console.log("ответ для", context.method, context.response);
});
```

### Добавление хука только для определенных методов API

```ts
bot.onResponse("sendMessage", (context) => {
    console.log("ответ для sendMessage", context.response);
});
// или массив
bot.onResponse(["sendMessage", "sendPhoto"], (context) => {
    console.log("ответ для", context.method, context.response);
});
``` 