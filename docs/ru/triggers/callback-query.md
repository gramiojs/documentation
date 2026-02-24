---
title: callbackQuery - Обработка обновлений, возникающих при взаимодействии пользователей с инлайн-клавиатурой

head:
    - - meta
      - name: "description"
        content: "Метод `callbackQuery` в GramIO используется для обработки обновлений, которые возникают, когда пользователи взаимодействуют с кнопками инлайн-клавиатуры в вашем Telegram боте. Когда пользователь нажимает на кнопку с полезной нагрузкой callback data, Telegram отправляет обновление `callback_query` вашему боту. Этот метод позволяет зарегистрировать обработчик для таких обновлений, давая возможность выполнять действия на основе взаимодействия пользователя."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, callback query, обработка нажатий, инлайн клавиатура, callback data, ответ на нажатие кнопки, answerCallbackQuery, regex callback, json callback, parse callback, валидация callback, колбек запросы, обработчик колбеков, взаимодействие с кнопками, safeUnpack, миграция схемы, CallbackData"
---

# Метод `callbackQuery`

Метод `callbackQuery` в GramIO используется для обработки обновлений, которые возникают, когда пользователи взаимодействуют с кнопками [инлайн-клавиатуры](/ru/keyboards/inline-keyboard) в вашем Telegram боте. Когда пользователь нажимает на кнопку с полезной нагрузкой (`callback_data`), Telegram отправляет обновление `callback_query` вашему боту. Этот метод позволяет зарегистрировать обработчик для таких обновлений, давая возможность выполнять действия на основе взаимодействия пользователя.

## Основное использование

### Обработка Callback Query

Чтобы использовать метод `callbackQuery`, вам нужно определить триггер и обработчик. Триггер определяет, когда обработчик должен выполняться на основе полученных `callback_data`, а обработчик выполняет нужное действие.

```ts twoslash
import { CallbackData, Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const someData = new CallbackData("example").number("id");

bot.callbackQuery(someData, (context) => {
    return context.send(`Вы нажали кнопку с ID: ${context.queryData.id}`);
    //                                                      ^?
});
```

В этом примере:

-   `someData` - это экземпляр `CallbackData`, определяющий схему для callback data.
-   Метод `callbackQuery` регистрирует обработчик, который вызывается, когда callback data соответствуют `someData`.
-   Внутри обработчика `context.queryData` предоставляет типо-безопасный доступ к callback data.

### Типы триггеров

Метод `callbackQuery` поддерживает несколько типов триггеров:

-   **Строковый триггер**: Обработчик вызывается, если `callback_data` точно соответствует указанной строке.

```ts
bot.callbackQuery("my_callback", (context) => {
    return context.editText("Кнопка нажата!");
});
```

-   **RegExp триггер**: Обработчик вызывается, если `callback_data` соответствует регулярному выражению.

```ts
bot.callbackQuery(/my_(.*)/, (context) => {
    const match = context.queryData;
    context.send(`Совпадающие данные: ${match[1]}`);
});
```

-   **Экземпляр CallbackData**: Обработчик вызывается, если `callback_data` соответствуют схеме `CallbackData`.

```ts twoslash
import { CallbackData, Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const someData = new CallbackData("example").number("id");

bot.callbackQuery(someData, (context) => {
    context.send(`Data ID: ${context.queryData.id}`);
    //                                  ^?
});
```

### Обработка Callback Data

Когда получен `callback_query`, объект `context` включает следующие релевантные свойства:

-   `context.data`: Сырая полезная нагрузка `callback_data`.
-   `context.queryData`: Десериализованные данные, если для триггера использовался экземпляр `CallbackData`.

### Пример сценария

Рассмотрим сценарий, где вы хотите отправить сообщение с инлайн-клавиатурой и обработать нажатия на кнопки:

```ts
const buttonData = new CallbackData("action").number("action_id");

bot.command("start", (context) =>
    context.send("Выберите действие:", {
        reply_markup: new InlineKeyboard().text(
            "Выполнить действие 1",
            buttonData.pack({ action_id: 1 })
        ),
    })
).callbackQuery(buttonData, (context) => {
    context.send(`Вы выбрали действие с ID: ${context.queryData.action_id}`);
});
```

В этом примере:

1. Команда `/start` отправляет сообщение с кнопкой инлайн-клавиатуры.
2. `callback_data` кнопки упаковываются с помощью `buttonData.pack()`.
3. Метод `callbackQuery` слушает `callback_query`, которые соответствуют `buttonData`.
4. Обработчик отвечает ID выбранного действия.

## Миграции схемы и `safeUnpack()`

Кнопки инлайн-клавиатуры остаются в истории Telegram — пользователи могут нажать кнопку спустя дни или недели после её отправки. Если схема `CallbackData` изменилась между деплоями, старые кнопки могут содержать данные, которые больше не соответствуют схеме.

### Что менять безопасно

| Операция | Безопасно? | Почему |
|---|---|---|
| Добавить optional-поле в конец | ✅ Да | Старые данные распакуются как `undefined` / дефолт |
| Добавить default к существующему optional | ✅ Да | Меняет только поведение при отсутствующем значении |
| Добавить required-поле | ❌ Нет | В старых данных нет значения |
| Удалить поле | ❌ Нет | Сдвигает позиции всех следующих полей |
| Поменять порядок полей | ❌ Нет | Позиционный формат — значения попадут не в те поля |
| Сменить тип поля | ❌ Нет | Десериализация по другому алгоритму |
| Переименовать `nameId` | ❌ Нет | `callbackQuery(schema)` не матчит старые кнопки |

### `safeUnpack()` — для сырых обработчиков `callback_query`

`bot.callbackQuery(schema, handler)` автоматически фильтрует и распаковывает данные — внутри обработчика `ctx.queryData` всегда валиден. **`safeUnpack` там не нужен.**

`safeUnpack()` полезен, когда вы обрабатываете `callback_query` через `bot.on()` и хотите попробовать несколько схем или корректно обработать устаревшие кнопки:

```ts
const v2Schema = new CallbackData("item").number("id").string("tab", { optional: true });

bot.on("callback_query", (ctx) => {
    const result = v2Schema.safeUnpack(ctx.data ?? "");

    if (!result.success) {
        // старая кнопка — схема изменилась или неверный nameId
        return ctx.answerCallbackQuery({ text: "Кнопка устарела, воспользуйтесь новым меню." });
    }

    // result.data типизировано: { id: number; tab: string | undefined }
    return ctx.answerCallbackQuery({ text: `Позиция ${result.data.id}` });
});
```

Тип возврата — `SafeUnpackResult<T>`, экспортируется из `@gramio/callback-data`:

```ts
import type { SafeUnpackResult } from "@gramio/callback-data";

function handleData(raw: string): SafeUnpackResult<{ id: number }> {
    return mySchema.safeUnpack(raw);
}
```
