---
title: Плагин Prompt для GramIO

head:
    - - meta
      - name: "description"
        content: "Легкий способ запросить что-либо у пользователя в вашем Telegram-боте"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин prompt, запрос ввода от пользователя, диалоговый интерфейс, многошаговые сценарии, обработка ответов пользователя, валидация ввода, трансформация ответов, метод wait, ожидание сообщений, обработка callback query, опрос пользователей, анкетирование"
---

# Плагин Prompt

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/prompt?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/prompt)
[![JSR](https://jsr.io/badges/@gramio/prompt)](https://jsr.io/@gramio/prompt)
[![JSR Score](https://jsr.io/badges/@gramio/prompt/score)](https://jsr.io/@gramio/prompt)

</div>

Плагин, который предоставляет методы [Prompt](#prompt) и [Wait](#wait)

> [!NOTE]
> Рекомендуется выбирать `scenes`, поэтому ознакомьтесь с [сравнением `prompt` и `scenes`](/ru/plugins/official/scenes#vs-prompt)

### Установка

::: code-group

```bash [npm]
npm install @gramio/prompt
```

```bash [yarn]
yarn add @gramio/prompt
```

```bash [pnpm]
pnpm add @gramio/prompt
```

```bash [bun]
bun install @gramio/prompt
```

:::

## Использование

```ts
import { Bot, format, bold } from "gramio";
import { prompt } from "@gramio/prompt";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(prompt())
    .command("start", async (context) => {
        const answer = await context.prompt(
            "message",
            format`Как вас ${bold`зовут`}?`
        );

        return context.send(`✨ Ваше имя: ${answer.text}`);
    })
    .onStart(console.log);

bot.start();
```

## Prompt

### Prompt с текстом + параметрами

```ts
const answer = await context.prompt("Как вас зовут?");
// или с SendMessageParams
const answer = await context.prompt("Правда или ложь?", {
    reply_markup: new Keyboard().text("правда").row().text("ложь"),
});
```

ответ - это объект `MessageContext` или `CallbackQueryContext`

### Prompt с текстом + параметрами и указанным событием

```ts
const answer = await context.prompt("message", "Как вас зовут?");

const answer = await context.prompt("callback_query", "Правда или ложь?", {
    reply_markup: new InlineKeyboard()
        .text("правда", "true")
        .row()
        .text("ложь", "false"),
});
```

ответ - это объект `CallbackQueryContext`

### Валидация

Можно указать обработчик в параметрах для проверки ответа пользователя.
Если обработчик вернёт false, сообщение будет отправлено повторно.

```ts
const answer = await context.prompt(
    "message",
    "Введите строку, содержащую русскую букву",
    {
        validate: (context) => /[а-яА-Я]/.test(context.text),
        //... и другие SendMessageParams
    }
);
```

### Трансформация

```ts
const name = await context.prompt("message", format`Как вас ${bold`зовут`}?`, {
    transform: (context) => context.text || context.caption || "",
});
```

name имеет тип `string`

## Wait

### Ожидание следующего события от пользователя

```ts
const answer = await context.wait();
```

ответ - это объект `MessageContext` или `CallbackQueryContext`

### Ожидание события от пользователя с игнорированием других типов событий

```ts
const answer = await context.wait("message");
```

ответ - это объект `CallbackQueryContext`

### Ожидание события с отфильтрованными ответами

Можно указать обработчик в параметрах для проверки ответа пользователя.
Если обработчик вернёт `false`, **сообщение** будет проигнорировано

```ts
const answer = await context.wait((context) => /[а-яА-Я]/.test(context.text));
// или в сочетании с событием
const answer = await context.wait("message", (context) =>
    /[а-яА-Я]/.test(context.text)
);
```

### Ожидание события с проверкой и трансформацией ответа

Можно указать обработчик в параметрах для **трансформации** ответа пользователя.

```ts
const answer = await context.wait((context) => /[а-яА-Я]/.test(context.text));
// или в сочетании с событием
const answer = await context.wait("message", {
    validate: (context) => /[а-яА-Я]/.test(context.text),
    transform: (context) => c.text || "",
});
```

ответ имеет тип `string`

## waitWithAction

Эта функция похожа на `wait`, но позволяет выполнить какое-либо действие вместе с ожиданием события и получить результат.

```ts
const [answer, sentMessage] = await context.waitWithAction(
    "message",
    () => context.send("Пожалуйста, введите ваше имя"),
    {
        validate: (ctx) => !!ctx.text,
        transform: (ctx) => ctx.text.toUpperCase(),
        onValidateError: "Пожалуйста, введите ваше имя правильно!",
    }
);

// answer имеет тип `string`
// sentMessage имеет тип `MessageContext`
```

## Timeout

Позволяет указать, время на ответ. После истечения времени, будет вызвана ошибка `Timeout` (основываясь на `timeoutStrategy`). `timeout` (**время в миллисекундах**) можно передать в любом методе в дополнительных параметрах.

```ts
new Bot()
    .extend(
        prompt({
            timeoutStrategy: "on-timer", // или "on-answer" (по умолчанию)
        })
    )
    .onError("message", ({ error, kind, context }) => {
        if (kind === "prompt-cancel") {
            // На данный момент, содержит только Timeout ошибку, но это обязательно изменится
            return context.send("Время на ответ истекло :(");
        }

        console.error(error);

        return context.send("Произошла ошибка");
    })
    .command("start", async (context) => {
        const [answer, sentMessage] = await context.waitWithAction(
            "message",
            () => context.send("Пожалуйста, введите ваше имя"),
            {
                timeout: 10_000, // 10 seconds
            }
        );

        return Promise.all([
            sentMessage.delete(),
            context.send(`Спасибо, ${answer.text}!`),
        ]);
    });
```

## Настройки

```ts
import { prompt, type PromptsType } from "@gramio/prompt";

const mySharedMap: PromptsType = new Map();

new Bot().extend(
    prompt({
        timeoutStrategy: "on-timer",
        defaults: {
            timeout: 30_000, // 30 seconds
            validate: (ctx) => ctx.hasText(),
            transform: (ctx) => ctx.text.toUpperCase(),
            onValidateError: "Validation failed. Please try again.",
        },
        map: mySharedMap,
    })
);
```

### timeoutStrategy

Позволяет выбрать, как будет вызвана ошибка `Timeout`.

-   `"on-answer"` (**по умолчанию**) - `Timeout` ошибка будет вызвана, если пользователь отправит сообщение ПОСЛЕ того, как истечёт время.
-   `"on-timer"` - `Timeout` ошибка будет вызвана, если истечёт время благодаря `setTimeout`.

### defaults

Позволяет указать значения по умолчанию для методов.

### map

Позволяет передать свой Map для хранения состояний. Благодаря этому можно будет модифицировать его в любом месте.
