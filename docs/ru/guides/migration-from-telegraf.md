---
title: Миграция с Telegraf на GramIO
head:
    - - meta
      - name: "description"
        content: "Пошаговый гайд по миграции Telegram-бота с Telegraf на GramIO. Сравнение кода для обработчиков, контекста, клавиатур, сессий, сцен, TypeScript и вебхуков."
    - - meta
      - name: "keywords"
        content: "миграция telegraf gramio, telegraf vs gramio, гайд по миграции telegraf, переход с telegraf, миграция фреймворка telegram бота, TypeScript миграция бота"
---

# Миграция с Telegraf

Этот гайд — для разработчиков, у которых есть бот на [Telegraf](https://telegraf.js.org/), и которые хотят перейти на GramIO. Оба фреймворка TypeScript-first на основе middleware — ментальная модель схожа, но API различается в важных деталях.

---

## Зачем мигрировать?

| | Telegraf | GramIO |
|---|---|---|
| Типизация плагинов TypeScript | Ручное слияние интерфейсов | `.extend()` — типы распространяются автоматически |
| Форматирование | HTML / MarkdownV2 строки | Тегированные шаблонные литералы → `MessageEntity` |
| Встроенные утилиты для тестирования | ❌ | ✅ `@gramio/test` |
| Полный справочник Telegram API | ❌ | ✅ `/telegram/` |
| CLI для скаффолдинга | ❌ | ✅ `npm create gramio` |
| Автотипизация `derive()` | Ручное дополнение контекста | ✅ первоклассный `.derive()` |
| Встроенный webhook-сервер | ✅ (через `bot.launch()`) | ❌ (свой сервер + `webhookHandler`) |
| Сцены / WizardScene | `Scenes.WizardScene` + `Stage` | `@gramio/scenes` — типизированный поток состояния |
| Именованные параметры API | Смешанные позиционные/объектные | Все именованные `{ chat_id, text }` |

---

## Установка

::: code-group

```bash [npm]
npm install gramio
npm uninstall telegraf
```

```bash [yarn]
yarn add gramio
yarn remove telegraf
```

```bash [pnpm]
pnpm add gramio
pnpm remove telegraf
```

```bash [bun]
bun add gramio
bun remove telegraf
```

:::

---

## Инициализация бота

::: code-group

```ts [Telegraf]
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.launch();
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

**Ключевые изменения:**
- `new Telegraf(token)` → `new Bot(token)`
- `bot.launch()` → `bot.start()`

---

## Обработчики

::: code-group

```ts [Telegraf]
// Команда
bot.command("start", (ctx) => ctx.reply("Привет!"));

// Текстовое сообщение
bot.on("text", (ctx) => ctx.reply(ctx.message.text));

// Любое сообщение
bot.on("message", (ctx) => ctx.reply("Получил!"));

// Hears
bot.hears(/hello/i, (ctx) => ctx.reply("Привет!"));

// Callback query (нажатие кнопки)
bot.action("yes", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("Вы сказали да!");
});
```

```ts [GramIO]
// Команда
bot.command("start", (ctx) => ctx.send("Привет!"));

// Текстовое сообщение
bot.on("message", (ctx) => ctx.send(ctx.text ?? ""));

// Любое сообщение
bot.on("message", (ctx) => ctx.send("Получил!"));

// Hears
bot.hears(/hello/i, (ctx) => ctx.send("Привет!"));

// Callback query (нажатие кнопки)
bot.callbackQuery("yes", (ctx) => {
    ctx.answer(); // автоматически подтверждает
    ctx.send("Вы сказали да!");
});
```

:::

**Ключевые изменения:**
- `ctx.reply()` → `ctx.send()`
- Фильтр `bot.on("text")` в Telegraf → используйте `ctx.text` внутри `bot.on("message")`
- `bot.action("data")` → `bot.callbackQuery("data")`
- `ctx.answerCbQuery()` → `ctx.answer()`

---

## Свойства контекста

::: code-group

```ts [Telegraf]
ctx.message          // TelegramMessage | undefined
ctx.message?.text    // string | undefined
ctx.from             // TelegramUser | undefined
ctx.chat             // TelegramChat | undefined
ctx.callbackQuery    // TelegramCallbackQuery | undefined
ctx.update           // сырой TelegramUpdate
```

```ts [GramIO]
ctx.message          // TelegramMessage | undefined
ctx.text             // string | undefined  (сокращение для message ctx)
ctx.from             // TelegramUser | undefined
ctx.chat             // TelegramChat | undefined
// (callback_query и inline_query — свойства верхнего уровня ctx для этих событий)
```

:::

---

## Отправка сообщений

::: code-group

```ts [Telegraf]
await ctx.reply("Привет!");
await ctx.reply("<b>Привет!</b>", { parse_mode: "HTML" });
await ctx.replyWithPhoto("file_id");
await ctx.telegram.sendMessage(chatId, "Привет из вне!");
```

```ts [GramIO]
await ctx.send("Привет!");

import { format, bold } from "gramio";
await ctx.send(format`${bold`Привет!`}`); // parse_mode не нужен

await ctx.sendPhoto("file_id");
await bot.api.sendMessage({ chat_id: chatId, text: "Привет из вне!" });
```

:::

**Ключевые изменения:**
- `ctx.reply()` → `ctx.send()`
- `ctx.replyWithPhoto()` → `ctx.sendPhoto()`
- `ctx.telegram.method()` → `bot.api.method({ ...именованныеПараметры })`
- Нет `parse_mode` — используйте тегированные шаблонные литералы `format`

---

## Прямые вызовы API

::: code-group

```ts [Telegraf]
// Внутри обработчика
await ctx.telegram.sendMessage(chatId, "Привет!");
await ctx.telegram.sendPhoto(chatId, { source: "./photo.jpg" });
await ctx.telegram.banChatMember(chatId, userId);

// Вне обработчика
await bot.telegram.sendMessage(chatId, "Привет!");
```

```ts [GramIO]
// Внутри обработчика
await ctx.api.sendMessage({ chat_id: chatId, text: "Привет!" });
await ctx.api.sendPhoto({ chat_id: chatId, photo: "file_id" });
await ctx.api.banChatMember({ chat_id: chatId, user_id: userId });

// Вне обработчика
await bot.api.sendMessage({ chat_id: chatId, text: "Привет!" });
```

:::

**Ключевые изменения:** `ctx.telegram` / `bot.telegram` → `ctx.api` / `bot.api` с полностью именованными параметрами.

---

## Клавиатуры

::: code-group

```ts [Telegraf]
import { Markup } from "telegraf";

// Инлайн клавиатура
ctx.reply("Выберите:", Markup.inlineKeyboard([
    [
        Markup.button.callback("Да ✅", "yes"),
        Markup.button.callback("Нет ❌", "no"),
    ],
    [Markup.button.url("GitHub", "https://github.com/gramiojs/gramio")],
]));

// Обычная клавиатура
ctx.reply("Выберите:", Markup.keyboard([
    ["Вариант А", "Вариант Б"],
]).resize());

// Удаление клавиатуры
ctx.reply("Удалено.", Markup.removeKeyboard());
```

```ts [GramIO]
import { InlineKeyboard, Keyboard, RemoveKeyboard } from "gramio";

// Инлайн клавиатура
ctx.send("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Да ✅", "yes")
        .text("Нет ❌", "no")
        .row()
        .url("GitHub", "https://github.com/gramiojs/gramio"),
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
- `Markup.inlineKeyboard([...])` → `new InlineKeyboard().text(...).row()...`
- `Markup.keyboard([...]).resize()` → `new Keyboard().text(...).resized()`
- `Markup.removeKeyboard()` → `new RemoveKeyboard()`

---

## Типобезопасные callback-данные

::: code-group

```ts [Telegraf]
// Создание
ctx.reply("Выберите:", Markup.inlineKeyboard([
    [
        Markup.button.callback("Пункт 1", "action:1"),
        Markup.button.callback("Пункт 2", "action:2"),
    ],
]));

// Обработка
bot.action(/action:(\d+)/, (ctx) => {
    const id = parseInt(ctx.match[1]);
    ctx.reply(`Вы выбрали: ${id}`);
    ctx.answerCbQuery();
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

## Форматирование

::: code-group

```ts [Telegraf]
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

## TypeScript / Добавление кастомного контекста

В Telegraf вы вручную дополняете интерфейс контекста и передаёте его как дженерик. В GramIO `.derive()` и `.extend()` делают это автоматически без boilerplate.

::: code-group

```ts [Telegraf]
// 1. Определяем кастомный контекст
interface MyContext extends Context {
    session: { count: number };
    isAdmin: boolean;
}

// 2. Передаём как дженерик в каждую конструкцию
const bot = new Telegraf<MyContext>(token);

// 3. Регистрируем middleware, которые его заполняют
bot.use(session<MyContext>({ ... }));
bot.use(async (ctx, next) => {
    ctx.isAdmin = ctx.from?.id === ADMIN_ID;
    await next();
});

// 4. Используем
bot.on("message", (ctx) => {
    ctx.isAdmin; // boolean — но компилятор это статически не проверяет
});
```

```ts [GramIO]
// .derive() обогащает контекст — типы распространяются автоматически
const bot = new Bot(token)
    .extend(session({ initial: () => ({ count: 0 }) }))
    .derive((ctx) => ({
        isAdmin: ctx.from?.id === ADMIN_ID,
    }));

bot.on("message", (ctx) => {
    ctx.isAdmin; // ✅ boolean — выводится компилятором
    ctx.session; // ✅ { count: number } — из .extend(session(...))
});
```

:::

---

## Сессия

::: code-group

```ts [Telegraf]
import { session } from "telegraf/session";

interface SessionData { count: number }
interface MyContext extends Context { session: SessionData }

const bot = new Telegraf<MyContext>(token);
bot.use(session<MyContext>({ defaultSession: () => ({ count: 0 }) }));

bot.command("count", (ctx) => {
    ctx.session.count++;
    ctx.reply(`Счётчик: ${ctx.session.count}`);
});
```

```ts [GramIO]
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

## Сцены / WizardScene

::: code-group

```ts [Telegraf]
import { Scenes, session } from "telegraf";

const wizard = new Scenes.WizardScene(
    "register",
    async (ctx) => {
        await ctx.reply("Как вас зовут?");
        return ctx.wizard.next();
    },
    async (ctx) => {
        const name = ctx.message && "text" in ctx.message ? ctx.message.text : "";
        await ctx.reply(`Привет, ${name}!`);
        return ctx.scene.leave();
    },
);

const stage = new Scenes.Stage([wizard]);
bot.use(session());
bot.use(stage.middleware());

bot.command("register", (ctx) => ctx.scene.enter("register"));
```

```ts [GramIO]
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

**Ключевые изменения:**
- Нет класса `Stage` — передавайте сцены напрямую в `scenes([...])`
- Нет `ctx.wizard.next()` — шаги автоматически переходят при получении подходящего обновления
- Состояние типизировано: `ctx.scene.state` несёт то, что вы передали в `ctx.scene.update()`
- Выйти из сцены: `ctx.scene.leave()` (или она заканчивается после последнего шага)

---

## Обработка ошибок

::: code-group

```ts [Telegraf]
// Try/catch в каждом обработчике
bot.command("start", async (ctx) => {
    try {
        await riskyOperation();
    } catch (e) {
        await ctx.reply("Что-то пошло не так.");
    }
});

// Глобальный обработчик ошибок
bot.catch((err, ctx) => {
    console.error(err);
    ctx.reply("Произошла ошибка.");
});
```

```ts [GramIO]
// Централизованный обработчик ошибок
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Что-то пошло не так.");
});

// Кастомные типизированные ошибки
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

**Ключевые изменения:**
- `bot.catch((err, ctx) => ...)` → `bot.onError(({ context, kind, error }) => ...)`
- Ошибкам можно давать типизированные имена с `.error("ВИД", КлассОшибки)`

---

## Graceful shutdown

::: code-group

```ts [Telegraf]
// Встроено в bot.launch()
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
```

```ts [GramIO]
// Подключается вручную
process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());
```

:::

---

## Webhook

В Telegraf есть встроенный HTTP-сервер через `bot.launch({ webhook: { ... } })`. В GramIO его нет — вы подключаете свой фреймворк и используете `webhookHandler`.

::: code-group

```ts [Telegraf]
// Встроенный webhook-сервер
bot.launch({
    webhook: {
        domain: "https://example.com",
        port: 3000,
    },
});

// Или вручную с express
import express from "express";
const app = express();
app.use(express.json());
app.use(bot.webhookCallback("/webhook"));
app.listen(3000);
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

## Middleware

Оба фреймворка используют цепочки middleware `(ctx, next) => ...`.

::: code-group

```ts [Telegraf]
bot.use(async (ctx, next) => {
    console.log("До:", ctx.updateType);
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

## Краткий справочник

| Telegraf | GramIO |
|---|---|
| `new Telegraf(token)` | `new Bot(token)` |
| `bot.launch()` | `bot.start()` |
| `ctx.reply(text)` | `ctx.send(text)` |
| `ctx.replyWithPhoto(file_id)` | `ctx.sendPhoto(file_id)` |
| `ctx.telegram.sendMessage(id, text)` | `ctx.api.sendMessage({ chat_id: id, text })` |
| `bot.telegram.sendMessage(id, text)` | `bot.api.sendMessage({ chat_id: id, text })` |
| `bot.action("data", handler)` | `bot.callbackQuery("data", handler)` |
| `ctx.answerCbQuery()` | `ctx.answer()` |
| `Markup.inlineKeyboard([...])` | `new InlineKeyboard().text(...)` |
| `Markup.keyboard([...]).resize()` | `new Keyboard().text(...).resized()` |
| `Markup.removeKeyboard()` | `new RemoveKeyboard()` |
| `interface MyContext extends Context {}` | `.derive(ctx => ({...}))` |
| `bot.use(session({...}))` | `.extend(session({...}))` |
| `new Scenes.WizardScene(...)` + `Stage` | `new Scene(...)` + `scenes([...])` |
| `bot.catch((err, ctx) => ...)` | `bot.onError(({ error, context }) => ...)` |
| Встроенный webhook-сервер | `webhookHandler(bot, "framework")` + свой сервер |
| HTML / MarkdownV2 строки | `format\`${bold\`текст\`}\`` |
