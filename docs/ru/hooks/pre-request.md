---
title: Хук preRequest в GramIO - Модификация запросов перед отправкой

head:
    - - meta
      - name: "description"
        content: "Хук preRequest в GramIO вызывается перед отправкой запроса в Telegram Bot API. Узнайте как изменять параметры запросов для кастомизации поведения вашего бота."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, preRequest, модификация запросов, изменение параметров API, перехват запросов, предобработка запросов, middlewares для API, кастомизация запросов, перехватчик запросов, параметры методов API, валидация запросов, логирование перед отправкой"
---

# preRequest

Этот хук вызывается `перед отправкой запроса` в Telegram Bot API (позволяет нам влиять на отправляемые параметры).

## Параметры

- method - название метода API
- params - параметры метода API

> [!IMPORTANT]
> Возврат контекста из обработчика хука обязателен!

## Пример

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).preRequest((context) => {
    if (context.method === "sendMessage") {
        context.params.text = "измененные параметры";
    }

    return context;
});

bot.start();
```

### Добавление хука только для определенных методов API

```ts
bot.preRequest("sendMessage", (context) => {
    context.params.text = "измененные параметры";

    return context;
});
// или массив
bot.preRequest(["sendMessage", "sendPhoto"], (context) => {
    if (context.method === "sendMessage") {
        context.params.text = "измененные параметры";
    } else context.params.caption = "метод sendPhoto";

    return context;
});
``` 