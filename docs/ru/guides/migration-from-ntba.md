---
title: Миграция с node-telegram-bot-api на GramIO
head:
    - - meta
      - name: "description"
        content: "Пошаговый гайд по миграции Telegram-бота с node-telegram-bot-api (NTBA) на GramIO. Сравнение кода для обработчиков, клавиатур, сессий, вебхуков и типизации TypeScript."
    - - meta
      - name: "keywords"
        content: "миграция node-telegram-bot-api gramio, ntba vs gramio, гайд по миграции node-telegram-bot-api, переход с ntba, миграция telegram бота, TypeScript telegram бот"
---

# Миграция с node-telegram-bot-api

Этот гайд — для разработчиков, у которых есть бот на [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) (NTBA), и которые хотят перейти на GramIO. NTBA — минималистичная библиотека на основе коллбеков. GramIO даёт полноценный фреймворк с middleware, типизированным контекстом, билдерами клавиатур, сессиями и первоклассным TypeScript.

---

## Зачем мигрировать?

| | node-telegram-bot-api | GramIO |
|---|---|---|
| TypeScript | Внешний пакет `@types/`, ограниченный | Первоклассный, полностью выводимый |
| Middleware | ❌ | ✅ компонуемые `.use()` / `.derive()` |
| Объект контекста | ❌ (сырой объект `msg`) | ✅ богатый `ctx` с вспомогательными методами |
| Билдеры клавиатур | ❌ (сырой JSON) | ✅ `InlineKeyboard`, `Keyboard` |
| Сессии | ❌ (ручное состояние) | ✅ `@gramio/session` |
| Диалоги / сценарии | ❌ | ✅ `@gramio/scenes` + `@gramio/prompt` |
| Форматирование | Ручные HTML-строки | Тегированные шаблонные литералы → entities |
| Встроенные утилиты для тестирования | ❌ | ✅ `@gramio/test` |
| Система плагинов | ❌ | ✅ `.extend()` с распространением типов |
| Полный справочник Telegram API | ❌ | ✅ `/telegram/` |
| CLI для скаффолдинга | ❌ | ✅ `npm create gramio` |

---

## Установка

::: code-group

```bash [npm]
npm install gramio
npm uninstall node-telegram-bot-api @types/node-telegram-bot-api
```

```bash [yarn]
yarn add gramio
yarn remove node-telegram-bot-api @types/node-telegram-bot-api
```

```bash [pnpm]
pnpm add gramio
pnpm remove node-telegram-bot-api @types/node-telegram-bot-api
```

```bash [bun]
bun add gramio
bun remove node-telegram-bot-api @types/node-telegram-bot-api
```

:::

---

## Инициализация бота

::: code-group

```ts [NTBA]
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

**Ключевые изменения:**
- Импорт — именованный класс `Bot`, а не экспорт по умолчанию
- Параметры передаются в `bot.start()`, а не в конструктор
- Long polling включён по умолчанию — дополнительная конфигурация не нужна

---

## Обработчики

::: code-group

```ts [NTBA]
// Любое сообщение
bot.on("message", (msg) => {
    bot.sendMessage(msg.chat.id, "Получил!");
});

// Совпадение с regex
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Привет!");
});

// Regex с группой захвата
bot.onText(/\/say (.+)/, (msg, match) => {
    const text = match?.[1] ?? "ничего";
    bot.sendMessage(msg.chat.id, text);
});

// Callback query (нажатие кнопки)
bot.on("callback_query", (query) => {
    bot.answerCallbackQuery(query.id);
    if (query.data === "yes") {
        bot.sendMessage(query.message!.chat.id, "Вы сказали да!");
    }
});
```

```ts [GramIO]
// Любое сообщение
bot.on("message", (ctx) => ctx.send("Получил!"));

// Команда
bot.command("start", (ctx) => ctx.send("Привет!"));

// Hears (regex)
bot.hears(/\/say (.+)/, (ctx) => ctx.send(ctx.args?.[1] ?? "ничего"));

// Callback query (нажатие кнопки)
bot.callbackQuery("yes", (ctx) => {
    ctx.answer(); // автоматически подтверждает запрос
    ctx.send("Вы сказали да!");
});
```

:::

**Ключевые изменения:**
- `bot.on("message", (msg) => ...)` → `bot.on("message", (ctx) => ...)`
- Больше нет `msg.chat.id` — просто `ctx.send()` отвечает в контексте
- `bot.onText(/regex/)` → `bot.hears(/regex/)`, с `ctx.args` для групп захвата
- `bot.command("start")` для команды `/start` (чище, чем `bot.onText(/\/start/)`)
- `bot.callbackQuery("data")` вместо фильтрации внутри `bot.on("callback_query")`
- `ctx.answer()` вместо `bot.answerCallbackQuery(query.id)`

---

## Отправка сообщений

::: code-group

```ts [NTBA]
// Обычный текст
await bot.sendMessage(msg.chat.id, "Привет!");

// HTML
await bot.sendMessage(msg.chat.id, "<b>Жирный</b>", { parse_mode: "HTML" });

// Фото
await bot.sendPhoto(msg.chat.id, "file_id");

// Документ
await bot.sendDocument(msg.chat.id, "file_id");

// Редактирование сообщения
await bot.editMessageText("Новый текст", {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
});
```

```ts [GramIO]
// Обычный текст
await ctx.send("Привет!");

// С форматированием (parse_mode не нужен)
import { format, bold } from "gramio";
await ctx.send(format`${bold`Жирный`}`);

// Фото
await ctx.sendPhoto("file_id");

// Документ
await ctx.sendDocument("file_id");

// Редактирование сообщения (внутри обработчика)
await ctx.editText("Новый текст");
```

:::

**Ключевые изменения:**
- Каждый `bot.sendX(chat_id, ...)` → `ctx.sendX(...)` — без аргумента `chat_id`
- `parse_mode: "HTML"` → используйте тегированный шаблон `format` с `bold`, `italic` и т.д.
- `bot.editMessageText(text, { chat_id, message_id })` → `ctx.editText(text)`

---

## Прямые вызовы API

::: code-group

```ts [NTBA]
// Прямой вызов API
await bot.sendMessage(chatId, "Привет из вне обработчика!");
await bot.sendPhoto(chatId, "file_id");
await bot.kickChatMember(chatId, userId);
```

```ts [GramIO]
// Прямой вызов API
await bot.api.sendMessage({ chat_id: chatId, text: "Привет из вне обработчика!" });
await bot.api.sendPhoto({ chat_id: chatId, photo: "file_id" });
await bot.api.banChatMember({ chat_id: chatId, user_id: userId });
```

:::

**Ключевые изменения:**
- `bot.sendX(id, ...)` → `bot.api.sendX({ chat_id: id, ... })` — именованные параметры
- Имена методов API соответствуют официальной документации Telegram Bot API

---

## Клавиатуры

NTBA требует сырой JSON. GramIO имеет fluent-билдеры клавиатур.

::: code-group

```ts [NTBA]
// Инлайн клавиатура
bot.sendMessage(msg.chat.id, "Выберите:", {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Да", callback_data: "yes" },
                { text: "Нет", callback_data: "no" },
            ],
        ],
    },
});

// Обычная клавиатура
bot.sendMessage(msg.chat.id, "Выберите:", {
    reply_markup: {
        keyboard: [
            [{ text: "Вариант А" }, { text: "Вариант Б" }],
        ],
        resize_keyboard: true,
    },
});

// Удаление клавиатуры
bot.sendMessage(msg.chat.id, "Удалено.", {
    reply_markup: { remove_keyboard: true },
});
```

```ts [GramIO]
import { InlineKeyboard, Keyboard, RemoveKeyboard } from "gramio";

// Инлайн клавиатура
ctx.send("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Да", "yes")
        .text("Нет", "no"),
});

// Обычная клавиатура
ctx.send("Выберите:", {
    reply_markup: new Keyboard()
        .text("Вариант А")
        .text("Вариант Б")
        .resized(),
});

// Удаление клавиатуры
ctx.send("Удалено.", { reply_markup: new RemoveKeyboard() });
```

:::

**Ключевые изменения:**
- Замените сырые JSON-объекты fluent-классами билдеров
- `.row()` для начала новой строки
- `.resized()` вместо `resize_keyboard: true`
- `new RemoveKeyboard()` вместо `{ remove_keyboard: true }`

---

## Типобезопасные callback-данные

В NTBA вы вручную разбираете `query.data` с помощью строковых сравнений или regex. GramIO имеет `CallbackData` для структурированных, типобезопасных callback-данных.

::: code-group

```ts [NTBA]
// Создание
bot.sendMessage(chat_id, "Выберите:", {
    reply_markup: {
        inline_keyboard: [[
            { text: "Пункт 1", callback_data: "action:1" },
            { text: "Пункт 2", callback_data: "action:2" },
        ]],
    },
});

// Обработка
bot.on("callback_query", (query) => {
    if (query.data?.startsWith("action:")) {
        const id = parseInt(query.data.split(":")[1]);
        bot.sendMessage(query.message!.chat.id, `Вы выбрали: ${id}`);
    }
    bot.answerCallbackQuery(query.id);
});
```

```ts [GramIO]
import { CallbackData, InlineKeyboard } from "gramio";

const actionData = new CallbackData("action").number("id");

// Создание
ctx.send("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Пункт 1", actionData.pack({ id: 1 }))
        .text("Пункт 2", actionData.pack({ id: 2 })),
});

// Обработка
bot.callbackQuery(actionData, (ctx) => {
    ctx.send(`Вы выбрали: ${ctx.queryData.id}`);
    //                                 ^? number
});
```

:::

---

## Форматирование сообщений

::: code-group

```ts [NTBA]
bot.sendMessage(chat_id, "<b>Привет!</b> Посетите <a href='https://gramio.dev'>GramIO</a>.", {
    parse_mode: "HTML",
});
```

```ts [GramIO]
import { format, bold, link } from "gramio";

ctx.send(format`${bold`Привет!`} Посетите ${link("GramIO", "https://gramio.dev")}.`);
```

:::

`parse_mode` не нужен — GramIO автоматически создаёт массивы `MessageEntity`.

---

## Сессии / Управление состоянием

В NTBA нет встроенной системы сессий. Распространённые паттерны используют `Map` или базу данных напрямую.

::: code-group

```ts [NTBA]
// Ручное состояние (глобальный Map — не переживает перезапуски)
const userState = new Map<number, { count: number }>();

bot.on("message", (msg) => {
    const state = userState.get(msg.from!.id) ?? { count: 0 };
    state.count++;
    userState.set(msg.from!.id, state);
    bot.sendMessage(msg.chat.id, `Счётчик: ${state.count}`);
});
```

```ts [GramIO]
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string).extend(
    session({ initial: () => ({ count: 0 }) }),
);

bot.on("message", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number }
    ctx.send(`Счётчик: ${ctx.session.count}`);
});
```

:::

`@gramio/session` поддерживает [адаптеры хранилищ](/ru/storages) для Redis, баз данных и многого другого.

---

## Многошаговые диалоги

В NTBA нет встроенной системы диалогов. Распространённый обходной путь — хранить «шаг» в Map.

::: code-group

```ts [NTBA]
// Ручное отслеживание шагов
const userStep = new Map<number, string>();

bot.onText(/\/register/, (msg) => {
    userStep.set(msg.from!.id, "awaiting_name");
    bot.sendMessage(msg.chat.id, "Как вас зовут?");
});

bot.on("message", (msg) => {
    const step = userStep.get(msg.from!.id);
    if (step === "awaiting_name") {
        userStep.delete(msg.from!.id);
        bot.sendMessage(msg.chat.id, `Привет, ${msg.text}!`);
    }
});
```

```ts [GramIO]
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Как вас зовут?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => ctx.send(`Привет, ${ctx.scene.state.name}!`));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([registerScene]));

bot.command("register", (ctx) => ctx.scene.enter(registerScene));
```

:::

---

## Обработка ошибок

::: code-group

```ts [NTBA]
// Обёртка try/catch для каждого обработчика
bot.on("message", async (msg) => {
    try {
        await riskyOperation();
    } catch (e) {
        console.error(e);
        bot.sendMessage(msg.chat.id, "Что-то пошло не так.");
    }
});

// Обработка ошибок polling
bot.on("polling_error", (error) => {
    console.error("Ошибка polling:", error);
});
```

```ts [GramIO]
// Централизованная обработка ошибок
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Что-то пошло не так.");
});
```

:::

---

## Webhook

::: code-group

```ts [NTBA]
import TelegramBot from "node-telegram-bot-api";
import express from "express";

const bot = new TelegramBot(process.env.BOT_TOKEN!, { webHook: true });
const app = express();

app.use(express.json());
app.post("/webhook", (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(3000);
bot.setWebHook("https://example.com/webhook");
```

```ts [GramIO]
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });

// Вызывает setWebhook у Telegram — НЕ запускает HTTP-сервер
bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

:::

Смотрите [все поддерживаемые фреймворки →](/ru/updates/webhook) (Hono, Express, Elysia, Koa, Bun.serve, Deno.serve, node:http)

---

## TypeScript

::: code-group

```ts [NTBA]
import TelegramBot from "node-telegram-bot-api";
// Требует: npm install @types/node-telegram-bot-api

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg: TelegramBot.Message) => {
    const text = msg.text; // string | undefined
    // Нет методов контекста — нужно вызывать bot.sendMessage(msg.chat.id, ...)
});
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }));

bot.on("message", (ctx) => {
    ctx.user;   // ✅ полностью типизировано — ваше кастомное поле
    ctx.text;   // string | undefined
    ctx.send;   // ✅ метод контекста — chat_id не нужен
});
```

:::

В NTBA TypeScript типизирует только сырые Telegram-объекты. В GramIO всё проходит через контекст, включая кастомные поля, добавленные через `.derive()` и `.decorate()`.

---

## Краткий справочник

| node-telegram-bot-api | GramIO |
|---|---|
| `new TelegramBot(token, { polling: true })` | `new Bot(token); bot.start()` |
| `bot.on("message", (msg) => ...)` | `bot.on("message", (ctx) => ...)` |
| `bot.sendMessage(msg.chat.id, text)` | `ctx.send(text)` |
| `bot.onText(/regex/, (msg, match) => ...)` | `bot.hears(/regex/, (ctx) => ...)` |
| `bot.on("callback_query", (query) => ...)` | `bot.callbackQuery("data", (ctx) => ...)` |
| `bot.answerCallbackQuery(query.id)` | `ctx.answer()` |
| `bot.sendPhoto(chat_id, file_id)` | `ctx.sendPhoto(file_id)` |
| Сырой JSON для инлайн клавиатур | `new InlineKeyboard().text(label, data)` |
| Сырой JSON для обычных клавиатур | `new Keyboard().text(label).resized()` |
| `{ remove_keyboard: true }` | `new RemoveKeyboard()` |
| Ручной Map состояния | `@gramio/session` |
| Ручное отслеживание шагов | `@gramio/scenes` |
| `bot.on("polling_error")` | `bot.onError(...)` |
| Внешний пакет `@types/` | Встроенный TypeScript |
