---
title: Хук onStop в GramIO - Обработка события остановки бота

head:
    - - meta
      - name: "description"
        content: "Хук onStop в GramIO вызывается при остановке бота. Узнайте как корректно завершить работу бота и освободить ресурсы."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onStop, остановка бота, завершение работы бота, graceful shutdown, корректное завершение, освобождение ресурсов, закрытие соединений, жизненный цикл бота, событие остановки, очистка ресурсов, сохранение данных при остановке"
---

# onStop

Этот хук вызывается при остановке бота.

## Параметры

```ts
{
		plugins: string[];
		info: TelegramUser;
}
```

- plugins - массив плагинов
- info - информация об аккаунте бота

## Пример

```ts twoslash
// @noErrors
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onStop(
    ({ plugins, info }) => {
        console.log(`список плагинов - ${plugins.join(", ")}`);
        console.log(`имя пользователя бота @${info.username}`);
    }
);

bot.start();
bot.stop();
``` 