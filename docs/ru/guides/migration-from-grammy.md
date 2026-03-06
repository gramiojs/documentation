---
title: Миграция с grammY на GramIO
head:
    - - meta
      - name: "description"
        content: "Пошаговое руководство по миграции Telegram-бота с grammY на GramIO. Сравнение кода для обработчиков, контекста, клавиатур, сессий, сцен, форматирования, TypeScript и вебхуков."
    - - meta
      - name: "keywords"
        content: "миграция с grammy на gramio, grammy vs gramio, миграция grammy, переход с grammy, миграция фреймворка telegram бота, миграция TypeScript бота, альтернатива grammY"
---

# Миграция с grammY

Это руководство предназначено для разработчиков, написавших бота на [grammY](https://grammy.dev/), которые хотят перейти на GramIO. Оба фреймворка построены на TypeScript и используют middleware — ментальная модель похожа, но API различаются в важных местах.

---

## Зачем переходить?

| | grammY | GramIO |
|---|---|---|
| Расширение контекста TypeScript | Ручные flavor-интерфейсы + generic `Bot<Ctx>` | `.derive()` / `.extend()` — типы распространяются автоматически |
| Типизация плагинов | `SessionFlavor<T>`, `ConversationFlavor` и т.д. | `.extend(plugin())` — flavor-типы не нужны |
| Форматирование | HTML / MarkdownV2 строки или хелпер `fmt` | Теговые шаблонные литералы → `MessageEntity` |
| Диалоги / многошаговые потоки | `@grammyjs/conversations` — стиль async generator | `@gramio/scenes` — пошаговый подход с типизированным состоянием |
| Встроенные утилиты тестирования | ❌ | ✅ `@gramio/test` |
| Полный справочник Telegram API | ❌ | ✅ `/telegram/` |
| CLI для создания проекта | ❌ | ✅ `npm create gramio` |
| Синтаксис фильтров | `bot.on(":text")`, `bot.on(["msg:text", ...])` | Простые имена событий + `.filter()` / `.derive()` |
| `ctx.reply()` | Отправляет ответ на входящее сообщение | `ctx.send()` — то же поведение, другое название |

---

## Установка

::: pm-add gramio
:::

::: pm-remove grammy
:::

---

## Инициализация бота

Оба фреймворка используют `new Bot(token)` и `bot.start()` — инициализация практически идентична.

::: code-group

```ts [grammY]
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.start();
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

Источник импорта меняется с `"grammy"` на `"gramio"` — всё остальное остаётся тем же.

---

## Обработчики

::: code-group

```ts [grammY]
// Команда
bot.command("start", (ctx) => ctx.reply("Привет!"));

// Любое сообщение
bot.on("message", (ctx) => ctx.reply("Получено!"));

// Фильтр текста (сокращённый синтаксис grammY)
bot.on("message:text", (ctx) => ctx.reply(ctx.message.text));

// Hears
bot.hears(/привет/i, (ctx) => ctx.reply("Эй!"));

// Callback query
bot.callbackQuery("yes", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Вы сказали да!");
});
```

```ts [GramIO]
// Команда
bot.command("start", (ctx) => ctx.send("Привет!"));

// Любое сообщение
bot.on("message", (ctx) => ctx.send("Получено!"));

// Текст доступен через ctx.text в контексте сообщения
bot.on("message", (ctx) => ctx.send(ctx.text ?? ""));

// Hears
bot.hears(/привет/i, (ctx) => ctx.send("Эй!"));

// Callback query
bot.callbackQuery("yes", (ctx) => {
    ctx.answer(); // автоматически подтверждает запрос
    ctx.send("Вы сказали да!");
});
```

:::

**Основные изменения:**
- `ctx.reply()` → `ctx.send()`
- Фильтр `bot.on("message:text")` → обычный `bot.on("message")` с `ctx.text`
- `ctx.answerCallbackQuery()` → `ctx.answer()`

---

## Свойства контекста

::: code-group

```ts [grammY]
ctx.message          // Message | undefined
ctx.message?.text    // string | undefined
ctx.from             // User | undefined
ctx.chat             // Chat | undefined
ctx.update           // сырой объект Update
ctx.callbackQuery    // CallbackQuery | undefined
```

```ts [GramIO]
ctx.message          // TelegramMessage | undefined
ctx.text             // string | undefined  (сокращение для контекста сообщения)
ctx.from             // TelegramUser | undefined
ctx.chat             // TelegramChat | undefined
// callback_query — свойство верхнего уровня в событиях callbackQuery
```

:::

---

## Отправка сообщений

::: code-group

```ts [grammY]
await ctx.reply("Привет!");
await ctx.reply("<b>Привет!</b>", { parse_mode: "HTML" });
await ctx.replyWithPhoto("file_id");
await ctx.api.sendMessage(chatId, "Привет извне!");
```

```ts [GramIO]
await ctx.send("Привет!");

import { format, bold } from "gramio";
await ctx.send(format`${bold`Привет!`}`); // parse_mode не нужен

await ctx.sendPhoto("file_id");
await bot.api.sendMessage({ chat_id: chatId, text: "Привет извне!" });
```

:::

**Основные изменения:**
- `ctx.reply()` → `ctx.send()`
- `ctx.replyWithPhoto()` → `ctx.sendPhoto()`
- `ctx.api.method(позиционные, аргументы)` → `bot.api.method({ именованные_параметры })`
- Без `parse_mode` — используйте теговые шаблоны `format`

---

## Прямые вызовы API

::: code-group

```ts [grammY]
// Позиционные аргументы
await ctx.api.sendMessage(chatId, "Привет!");
await ctx.api.sendPhoto(chatId, "file_id");
await ctx.api.banChatMember(chatId, userId);

// Вне обработчика
await bot.api.sendMessage(chatId, "Привет!");
```

```ts [GramIO]
// Именованные аргументы
await ctx.api.sendMessage({ chat_id: chatId, text: "Привет!" });
await ctx.api.sendPhoto({ chat_id: chatId, photo: "file_id" });
await ctx.api.banChatMember({ chat_id: chatId, user_id: userId });

// Вне обработчика
await bot.api.sendMessage({ chat_id: chatId, text: "Привет!" });
```

:::

**Ключевое изменение:** grammY использует позиционные аргументы, GramIO — именованные параметры в соответствии с официальной документацией Telegram Bot API.

---

## Клавиатуры

Оба фреймворка имеют схожие классы клавиатур — меняется только источник импорта.

::: code-group

```ts [grammY]
import { InlineKeyboard, Keyboard } from "grammy";

// Inline клавиатура
ctx.reply("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Да ✅", "yes")
        .text("Нет ❌", "no")
        .row()
        .url("GitHub", "https://github.com/gramiojs/gramio"),
});

// Reply клавиатура
ctx.reply("Выберите:", {
    reply_markup: new Keyboard()
        .text("Вариант A")
        .text("Вариант B")
        .resized(),
});

// Убрать клавиатуру
ctx.reply("Убрано.", { reply_markup: { remove_keyboard: true } });
```

```ts [GramIO]
import { InlineKeyboard, Keyboard, RemoveKeyboard } from "gramio";

// Inline клавиатура
ctx.send("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Да ✅", "yes")
        .text("Нет ❌", "no")
        .row()
        .url("GitHub", "https://github.com/gramiojs/gramio"),
});

// Reply клавиатура
ctx.send("Выберите:", {
    reply_markup: new Keyboard()
        .text("Вариант A")
        .text("Вариант B")
        .resized(),
});

// Убрать клавиатуру
ctx.send("Убрано.", { reply_markup: new RemoveKeyboard() });
```

:::

**Основные изменения:**
- Импорт из `"gramio"` вместо `"grammy"`
- `ctx.reply()` → `ctx.send()`
- `{ remove_keyboard: true }` → `new RemoveKeyboard()`

---

## Типобезопасные данные callback

::: code-group

```ts [grammY]
// Создание
ctx.reply("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Пункт 1", "action:1")
        .text("Пункт 2", "action:2"),
});

// Обработка
bot.callbackQuery(/action:(\d+)/, async (ctx) => {
    const id = parseInt(ctx.match[1]);
    await ctx.reply(`Вы выбрали: ${id}`);
    await ctx.answerCallbackQuery();
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
    //                                  ^? number
});
```

:::

---

## Форматирование

::: code-group

```ts [grammY]
await ctx.reply(
    "<b>Привет!</b> Посетите <a href='https://gramio.dev'>GramIO</a>.",
    { parse_mode: "HTML" }
);
```

```ts [GramIO]
import { format, bold, link } from "gramio";

await ctx.send(
    format`${bold`Привет!`} Посетите ${link("GramIO", "https://gramio.dev")}.`
);
```

:::

---

## TypeScript / Расширение контекста

grammY требует объявления flavor-интерфейсов и передачи их как дженериков. `.derive()` и `.extend()` в GramIO всё выводят автоматически.

::: code-group

```ts [grammY]
import { Bot, Context, SessionFlavor, session } from "grammy";

// 1. Объявляем flavor-типы
interface SessionData { count: number }
type MyContext = Context & SessionFlavor<SessionData>;

// 2. Передаём дженерик в каждую конструкцию
const bot = new Bot<MyContext>(token);

// 3. Регистрируем middleware с дженериком
bot.use(session<MyContext, SessionData>({
    initial: () => ({ count: 0 }),
}));

// 4. Кастомные свойства требуют ручного расширения flavor
interface CustomFlavor { isAdmin: boolean }
type FullContext = Context & SessionFlavor<SessionData> & CustomFlavor;
```

```ts [GramIO]
import { Bot } from "gramio";
import { session } from "@gramio/session";

// Никаких дженериков и flavor-типов — просто компонуем, типы распространяются сами
const bot = new Bot(token)
    .extend(session({ initial: () => ({ count: 0 }) }))
    .derive((ctx) => ({
        isAdmin: ctx.from?.id === ADMIN_ID,
    }));

bot.on("message", (ctx) => {
    ctx.isAdmin;    // ✅ boolean — выведен автоматически
    ctx.session;    // ✅ { count: number } — выведен автоматически
});
```

:::

---

## Сессии

::: code-group

```ts [grammY]
import { Bot, Context, SessionFlavor, session } from "grammy";

interface SessionData { count: number }
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(token);
bot.use(session({ initial: (): SessionData => ({ count: 0 }) }));

bot.command("count", async (ctx) => {
    ctx.session.count++;
    await ctx.reply(`Счётчик: ${ctx.session.count}`);
});
```

```ts [GramIO]
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0 }) })
);

bot.command("count", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number }
    ctx.send(`Счётчик: ${ctx.session.count}`);
});
```

:::

---

## Диалоги / Сцены

`@grammyjs/conversations` использует паттерн async-generator с `conversation.wait()`. `@gramio/scenes` использует пошаговый подход.

::: code-group

```ts [grammY — @grammyjs/conversations]
import { conversations, createConversation } from "@grammyjs/conversations";
import { session } from "grammy";

async function register(conversation, ctx) {
    await ctx.reply("Как вас зовут?");
    const { message } = await conversation.wait();
    await ctx.reply(`Привет, ${message.text}!`);
}

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(register));

bot.command("register", (ctx) => ctx.conversation.enter("register"));
```

```ts [GramIO — @gramio/scenes]
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Как вас зовут?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Привет, ${ctx.scene.state.name}!`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([registerScene]));

bot.command("register", (ctx) => ctx.scene.enter(registerScene));
```

:::

**Основные изменения:**
- Нет `conversation.wait()` — шаги переходят автоматически при получении подходящих обновлений
- Состояние типизировано: `ctx.scene.state` содержит то, что вы передали в `ctx.scene.update()`
- Нет `ConversationFlavor` — GramIO всё выводит из определения сцены

---

## Обработка ошибок

::: code-group

```ts [grammY]
// Глобальный обработчик ошибок
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);
    console.error(err.error);
});
```

```ts [GramIO]
// Централизованный обработчик ошибок
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Что-то пошло не так.");
});

// Типизированные ошибки
class NoRights extends Error {
    constructor(public role: "admin" | "moderator") { super(); }
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .error("NO_RIGHTS", NoRights)
    .onError(({ kind, error, context }) => {
        if (kind === "NO_RIGHTS" && context.is("message"))
            context.send(`Вам нужна роль «${error.role}».`);
    });
```

:::

**Основные изменения:**
- `bot.catch((err) => ...)` → `bot.onError(({ context, kind, error }) => ...)`
- Ошибкам можно давать типизированные имена через `.error("ИМЯ", КлассОшибки)`

---

## Graceful shutdown

::: code-group

```ts [grammY]
// grammY автоматически обрабатывает SIGINT/SIGTERM при использовании bot.start()
bot.start({
    onStop: () => console.log("Завершение работы"),
});
```

```ts [GramIO]
bot.onStop(() => console.log("Завершение работы"));

process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());

bot.start();
```

:::

---

## Вебхук

::: code-group

```ts [grammY]
import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.BOT_TOKEN!);
const app = express();

app.use(express.json());
app.use("/webhook", webhookCallback(bot, "express"));
app.listen(3000);
```

```ts [GramIO]
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });

// Вызывает setWebhook на Telegram — HTTP-сервер НЕ запускает
bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

:::

Смотрите [все поддерживаемые фреймворки →](/ru/updates/webhook) (Hono, Express, Elysia, Koa, Bun.serve, Deno.serve, node:http)

---

## Middleware

Оба фреймворка используют идентичные цепочки middleware `(ctx, next) => ...`.

::: code-group

```ts [grammY]
bot.use(async (ctx, next) => {
    console.log("До:", ctx.update.update_id);
    await next();
    console.log("После");
});
```

```ts [GramIO]
bot.use(async (ctx, next) => {
    console.log("До:", ctx.update);
    await next();
    console.log("После");
});
```

:::

Форма идентична — `bot.use()` работает одинаково.

---

## Файлы

::: code-group

```ts [grammY]
import { InputFile } from "grammy";

await ctx.replyWithPhoto(new InputFile("./photo.jpg"));
await ctx.replyWithPhoto(new InputFile(new URL("https://example.com/photo.jpg")));
await ctx.replyWithPhoto(new InputFile(buffer, "photo.jpg"));
```

```ts [GramIO]
import { MediaUpload } from "@gramio/files";

await ctx.sendPhoto(await MediaUpload.path("./photo.jpg"));
await ctx.sendPhoto(await MediaUpload.url("https://example.com/photo.jpg"));
await ctx.sendPhoto(await MediaUpload.buffer(buffer, "photo.jpg"));

// Уже загруженный file_id — передаётся напрямую
await ctx.sendPhoto("AgACAgIAAxk...");
```

:::

---

## Краткая шпаргалка

| grammY | GramIO |
|---|---|
| `import { Bot } from "grammy"` | `import { Bot } from "gramio"` |
| `bot.start()` | `bot.start()` |
| `ctx.reply(text)` | `ctx.send(text)` |
| `ctx.replyWithPhoto(file_id)` | `ctx.sendPhoto(file_id)` |
| `ctx.api.sendMessage(id, text)` | `ctx.api.sendMessage({ chat_id: id, text })` |
| `bot.api.sendMessage(id, text)` | `bot.api.sendMessage({ chat_id: id, text })` |
| `ctx.answerCallbackQuery()` | `ctx.answer()` |
| `bot.on("message:text")` | `bot.on("message")` + `ctx.text` |
| `type Ctx = Context & SessionFlavor<T>` | `.extend(session({...}))` |
| `new Bot<MyContext>(token)` | `new Bot(token)` (дженерик не нужен) |
| `bot.use(session({...}))` | `.extend(session({...}))` |
| `@grammyjs/conversations` | `@gramio/scenes` |
| `conversation.wait()` | шаг переходит автоматически |
| `bot.catch((err) => ...)` | `bot.onError(({ error, context }) => ...)` |
| `new InputFile("path")` | `await MediaUpload.path("path")` |
| HTML / MarkdownV2 строки | `format\`${bold\`text\`}\`` |
| `import { InlineKeyboard } from "grammy"` | `import { InlineKeyboard } from "gramio"` |
| `{ remove_keyboard: true }` | `new RemoveKeyboard()` |

---

## Следующие шаги

- [Начало работы →](/ru/get-started) — Создайте новый проект GramIO
- [Обзор плагинов →](/ru/plugins/overview) — Сессии, сцены, i18n и другое
- [Шпаргалка →](/ru/cheat-sheet) — Частые паттерны в одном месте
- [Введение →](/ru/introduction) — Почему GramIO, вкратце
