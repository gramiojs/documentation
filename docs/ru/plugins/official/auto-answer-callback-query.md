---
title: Плагин автоматического ответа на запросы обратного вызова для GramIO

head:
    - - meta
      - name: "description"
        content: "Этот плагин автоматически отвечает на события callback_query методом answerCallbackQuery, если вы этого еще не сделали."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин автоответа, callback_query, answerCallbackQuery, автоматический ответ на кнопки, обработка колбэков, ожидание на кнопках, индикатор загрузки, перехват методов, show_alert, убрать часы с кнопки, уведомление о нажатии на кнопку"
---

# Плагин автоматического ответа на запросы обратного вызова

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/auto-answer-callback-query?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/auto-answer-callback-query)
[![JSR](https://jsr.io/badges/@gramio/auto-answer-callback-query)](https://jsr.io/@gramio/auto-answer-callback-query)
[![JSR Score](https://jsr.io/badges/@gramio/auto-answer-callback-query/score)](https://jsr.io/@gramio/auto-answer-callback-query)

</div>

Этот плагин автоматически отвечает на события `callback_query` методом `answerCallbackQuery`, если вы этого еще не сделали.

### Установка

::: code-group

```bash [npm]
npm install @gramio/auto-answer-callback-query
```

```bash [yarn]
yarn add @gramio/auto-answer-callback-query
```

```bash [pnpm]
pnpm add @gramio/auto-answer-callback-query
```

```bash [bun]
bun install @gramio/auto-answer-callback-query
```

:::

```ts
import { Bot, InlineKeyboard } from "gramio";
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(autoAnswerCallbackQuery())
    .command("start", (context) =>
        context.send("Привет!", {
            reply_markup: new InlineKeyboard()
                .text("тест", "test")
                .text("тест2", "test2"),
        })
    )
    .callbackQuery("test", () => {
        // Плагин вызовет метод answerCallbackQuery, так как вы его не вызвали
        return context.send("Привет");
    })
    .callbackQuery("test2", (context) => {
        // вы уже ответили, поэтому плагин не будет пытаться ответить
        return context.answer("ПРИВЕТ");
    });
```

### Параметры

Вы можете передать параметры для метода [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery)

```ts
bot.extend(
    autoAnswerCallbackQuery({
        text: "Автоматический ответ",
        show_alert: true,
    })
);
```

> [!IMPORTANT]
> Этот плагин перехватывает методы `context.answerCallbackQuery` (и `context.answer`), чтобы понять, был ли уже отправлен ответ на запрос обратного вызова. Старайтесь не использовать напрямую метод `bot.api.answerCallbackQuery` в контексте - это может помешать корректной работе плагина. 