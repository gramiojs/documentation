---
title: Хук onStart в GramIO - Обработка события запуска бота

head:
    - - meta
      - name: "description"
        content: "Хук onStart в GramIO вызывается при запуске бота. Получите информацию о боте, подключенных плагинах и способе получения обновлений при старте."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onStart, запуск бота, инициализация бота, старт бота, жизненный цикл бота, обработка запуска, события запуска, webhook setup, long polling setup, плагины при запуске, информация о боте, начальная настройка, getMe данные"
---

# onStart

Этот хук вызывается при `запуске` бота.

## Параметры

```ts
{
		plugins: string[];
		info: TelegramUser;
		updatesFrom: "webhook" | "long-polling";
}
```

- plugins - массив плагинов
- info - информация об аккаунте бота
- updatesFrom - webhook/polling

## Пример

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onStart(
    ({ plugins, info, updatesFrom }) => {
        console.log(`список плагинов - ${plugins.join(", ")}`);
        console.log(`имя пользователя бота @${info.username}`);
        console.log(`обновления из ${updatesFrom}`);
    }
);

bot.start();
``` 