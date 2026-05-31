---
title: chosenInlineResult - Обработка обновлений, когда пользователь выбирает один из результатов, возвращенных инлайн-запросом

head:
    - - meta
      - name: "description"
        content: "Этот метод особенно полезен, когда вам нужно выполнить дополнительные действия после того, как пользователь выбрал определенный результат из предложений инлайн-запроса.

Вам следует включить сбор обратной связи в @BotFather."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, chosen inline result, инлайн-запросы, обработка выбора результата, InlineQuery, inline mode, inline feedback, сбор обратной связи, inline tracking, статистика инлайн запросов, инлайн результаты, inline_query_id, result_id, выбор пользователя, inline бот, обработка инлайн выбора"
---

# chosenInlineResult

Метод `chosenInlineResult` в GramIO позволяет вашему боту обрабатывать обновления, когда пользователь выбирает один из результатов, возвращенных [инлайн-запросом](/ru/triggers/inline-query). Этот метод особенно полезен, когда вам нужно выполнить дополнительные действия после того, как пользователь выбрал определенный результат из предложений инлайн-запроса.

Вам следует включить [Feedback](https://core.telegram.org/bots/inline#collecting-feedback) в [@BotFather](https://telegram.me/botfather).

> Чтобы узнать, какие из предоставленных результатов ваши пользователи отправляют своим собеседникам, отправьте [@Botfather](https://telegram.me/botfather) команду `/setinlinefeedback`. После включения этой функции вы будете получать обновления о результатах, выбранных вашими пользователями.

> Обратите внимание, что это может создать проблемы с нагрузкой для популярных ботов – вы можете получить больше результатов, чем фактических запросов, из-за кэширования (см. параметр cache_time в [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)). Для таких случаев мы рекомендуем регулировать настройку вероятности, чтобы получать 1/10, 1/100 или 1/1000 часть результатов.

Мы рекомендуем установить значение `100%` (каждый клик по результату [инлайн-запроса](/ru/triggers/inline-query) будет создавать это событие).

## Основное использование

> [!WARNING]
> Вы должны указать тот же тип триггера (String, Regex, Function), что и в [InlineQuery](/ru/triggers/inline-query), чтобы получить результаты нажатия на него, или использовать опцию `onResult` в триггере [InlineQuery](/ru/triggers/inline-query).

### Обработка выбранных инлайн-результатов

Метод `chosenInlineResult` регистрирует обработчик, который вызывается всякий раз, когда пользователь выбирает результат из ответа на инлайн-запрос. Вы можете определить триггер, который определяет, когда должен быть вызван обработчик, аналогично тому, как вы определяете триггеры в методе `inlineQuery`.

```ts
bot.chosenInlineResult(/search (.*)/i, async (context) => {
    const selectedResult = context.resultId;
    const queryParams = context.args;

    // Вы можете редактировать сообщения только с InlineKeyboard
    if (queryParams && context.inlineMessageId) {
        await context.editText(
            `Вы выбрали результат с ID: ${selectedResult} для запроса: ${queryParams[1]}`
        );
    }
});
```

В этом примере:

-   Бот прослушивает любой выбор результата, соответствующий регулярному выражению `search (.*)`.
-   Если выбран результат, соответствующий триггеру, бот извлекает ID результата и параметры запроса.
-   Затем бот редактирует сообщение, чтобы указать, какой результат был выбран.

### Типы триггеров

Метод `chosenInlineResult` поддерживает те же типы триггеров, что и метод `inlineQuery`:

-   **Строковый триггер**: Обработчик вызывается, если `query` точно соответствует указанной строке.
-   **RegExp триггер**: Обработчик вызывается, если `query` соответствует регулярному выражению.
-   **Функциональный триггер**: Обработчик вызывается на основе пользовательской функции, которая возвращает `true` или `false`.
-   **CallbackData триггер** (gramio v0.10+): передай инстанс [`CallbackData`](/ru/triggers/callback-query), чтобы матчиться по выбранному **`result_id`** и распаковывать его в типизированный `context.queryData`.

### CallbackData триггер — типизированный `result_id` (gramio v0.10+)

Ровно как [`callbackQuery`](/ru/triggers/callback-query), `chosenInlineResult` теперь принимает схему `CallbackData`. Вместо матчинга по инлайн-`query` он фильтрует по **`result_id`**, который ты назначил каждому результату, и декодирует его в полностью типизированный `context.queryData`:

```ts
import { CallbackData } from "gramio";

const card = new CallbackData("card").number("id");

// Зашиваем схему в id каждого результата
bot.inlineQuery(/cards/, (context) =>
    context.answer([
        InlineQueryResult.article(
            card.pack({ id: 42 }), // ← result_id несёт типизированный payload
            "Карточка #42",
            InputMessageContent.text("Карточка #42"),
            { reply_markup: new InlineKeyboard().text("Открыть", "open") }
        ),
    ])
);

// Декодируем обратно, когда пользователь выбрал этот результат
bot.chosenInlineResult(card, (context) => {
    context.queryData.id; // ✅ типизирован как number
});
```

Это делает роутинг инлайн-результатов таким же типобезопасным, как роутинг callback-кнопок — без ручного парсинга строки `result_id`.
