---
title: Хук onError в GramIO - Обработка ошибок в Telegram боте

head:
    - - meta
      - name: "description"
        content: "Хук onError в GramIO позволяет перехватывать и обрабатывать ошибки, возникающие в middleware ботов Telegram. Узнайте как эффективно обрабатывать исключения."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, обработка ошибок, onError хук, перехват исключений, try catch, отладка бота, логирование ошибок, улучшение надежности, отчеты об ошибках, разделение ошибок, типы ошибок, восстановление после ошибок, PLUGIN error kind, API error kind, OTHER error kind, устойчивость к ошибкам"
---

# onError (Обработка ошибок)

Бывает, что в middleware возникают ошибки, и нам нужно их обрабатывать.
Для этого был создан хук `onError`.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---

bot.on("message", () => {
    bot.api.sendMessage({
        chat_id: "@not_found",
        text: "Чат не существует....",
    });
});

bot.onError(({ context, kind, error }) => {
    if (context.is("message")) return context.send(`${kind}: ${error.message}`);
});
```

### Добавление хука только для определенных контекстов

```ts
bot.onError("message", ({ context, kind, error }) => {
    return context.send(`${kind}: ${error.message}`);
});
// или массив
bot.onError(["message", "message_reaction"], ({ context, kind, error }) => {
    return context.send(`${kind}: ${error.message}`);
});
```

## Типы ошибок

### Пользовательские

Вы можете отловить ошибку определенного класса, унаследованного от Error.

```ts twoslash
import { Bot, format, bold } from "gramio";
// ---cut---
export class NoRights extends Error {
    needRole: "admin" | "moderator";

    constructor(role: "admin" | "moderator") {
        super();
        this.needRole = role;
    }
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .error("NO_RIGHTS", NoRights)
    .onError("message", ({ context, kind, error }) => {
        if (kind === "NO_RIGHTS")
            return context.send(
                format`У вас недостаточно прав! Вам нужно иметь роль «${bold(
                    error.needRole
                    //    ^^^^^^^^
                )}».`
            );
    });

bot.on("message", (context) => {
    if (context.text === "ban") throw new NoRights("admin");
});
```

> [!IMPORTANT]
> Мы рекомендуем следовать **соглашению** и называть типы ошибок в формате **SCREAMING_SNAKE_CASE**

### Telegram

Эта ошибка является результатом неудачного запроса к Telegram Bot API.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.onError(({ context, kind, error }) => {
    if (kind === "TELEGRAM" && error.method === "sendMessage") {
        error.params; // это параметры sendMessage
    }
});
```

### Unknown

Эта ошибка - любая неизвестная ошибка, будь то ваш класс или просто Error.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.onError(({ context, kind, error }) => {
    if (kind === "UNKNOWN") {
        console.log(error.message);
    }
});
```
