---
title: Миграция с puregram на GramIO
head:
    - - meta
      - name: "description"
        content: "Пошаговое руководство по миграции Telegram-бота с puregram на GramIO. Сравнение кода бок о бок: инициализация, обработчики, контекст, клавиатуры, сессии, сцены и middleware."
    - - meta
      - name: "keywords"
        content: "миграция с puregram на gramio, puregram vs gramio, руководство по миграции gramio, переход с puregram, миграция typescript telegram бота, nitreojs puregram"
---

# Миграция с puregram

Это руководство для разработчиков с ботом на [puregram](https://github.com/nitreojs/puregram), которые хотят перейти на GramIO. Сравнение кода бок о бок покажет, что именно изменится.

---

## Зачем мигрировать?

Оба — TypeScript-нативные фреймворки для Telegram-ботов. Ключевые различия:

| | puregram | GramIO |
|---|---|---|
| Инициализация бота | `new Telegram({ token })` / `.fromToken()` | `new Bot(token)` |
| Регистрация обработчиков | `bot.updates.on()` | `bot.on()` |
| Запуск бота | `bot.updates.startPolling()` | `bot.start()` |
| Middleware | `bot.updates.use()` | `bot.use()` |
| Типобезопасное расширение контекста | Ручная аугментация | `.derive()` / `.extend()` — автоматически |
| Форматирование | HTML/MarkdownV2 строки | Тегированные шаблоны → `MessageEntity` |
| `hears` / сопоставление текста | Плагин `@puregram/hear` | Встроенный `bot.hears()` |
| CLI для скаффолдинга | ❌ | ✅ `npm create gramio` |
| Встроенные утилиты для тестирования | ❌ | ✅ `@gramio/test` |
| Полный референс Telegram API | ❌ | ✅ `/telegram/` |
| Мультирантайм (Node/Bun/Deno) | Node.js | Node.js, Bun, Deno |

---

## Установка

::: code-group

```bash [npm]
npm install gramio
npm uninstall puregram
```

```bash [yarn]
yarn add gramio
yarn remove puregram
```

```bash [pnpm]
pnpm add gramio
pnpm remove puregram
```

```bash [bun]
bun add gramio
bun remove puregram
```

:::

---

## Инициализация бота

::: code-group

```ts [puregram]
import { Telegram } from "puregram";

// Объектная форма
const bot = new Telegram({ token: process.env.BOT_TOKEN! });

// Фабричная форма
const bot = Telegram.fromToken(process.env.BOT_TOKEN!);

bot.updates.startPolling();
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

**Ключевые изменения:**
- `Telegram` → `Bot`
- `new Telegram({ token })` → `new Bot(token)` (токен — прямой аргумент)
- `bot.updates.startPolling()` → `bot.start()`

---

## Обработчики

::: code-group

```ts [puregram]
bot.updates.on("message", (context) => {
    context.reply("Привет!");
});

bot.updates.on("callback_query", (context) => {
    context.answerCallbackQuery("Готово!");
});
```

```ts [GramIO]
bot.on("message", (ctx) => {
    ctx.send("Привет!");
});

bot.callbackQuery("my-data", (ctx) => {
    ctx.answer();
});
```

:::

**Ключевые изменения:**
- `bot.updates.on()` → `bot.on()`
- `context.reply()` → `ctx.send()`
- `context.answerCallbackQuery()` → `ctx.answer()`

---

## Команды

::: code-group

```ts [puregram]
bot.updates.on("message", (context) => {
    if (context.text === "/start") {
        context.reply("Добро пожаловать!");
    }
});
```

```ts [GramIO]
// Встроенный обработчик команд
bot.command("start", (ctx) => ctx.send("Добро пожаловать!"));
```

:::

В GramIO есть встроенный `.command()` — никаких ручных проверок текста.

---

## Сопоставление текста (hears)

::: code-group

```ts [puregram — @puregram/hear]
import { HearManager } from "@puregram/hear";

const hearManager = new HearManager<MessageContext>();

hearManager.hear(/привет/i, (context) => {
    context.reply("Эй!");
});

bot.updates.on("message", (context, next) =>
    hearManager.middleware(context, next)
);
```

```ts [GramIO — встроенный]
// Плагин не нужен
bot.hears(/привет/i, (ctx) => ctx.send("Эй!"));

// Точная строка
bot.hears("привет", (ctx) => ctx.send("Эй!"));

// Функция-предикат
bot.hears(
    (ctx) => ctx.text?.startsWith("?"),
    (ctx) => ctx.send("Вопрос!"),
);
```

:::

`hears` встроен в GramIO — плагин `@puregram/hear` не нужен.

---

## Свойства контекста

::: code-group

```ts [puregram]
context.chat        // TelegramChat
context.from        // TelegramUser
context.senderId    // context.from?.id — шортхенд
context.message     // TelegramMessage
context.text        // текст сообщения
context.callbackQuery  // для callback_query обновлений
```

```ts [GramIO]
ctx.chat            // TelegramChat
ctx.from            // TelegramUser | undefined
ctx.from?.id        // нет специального шортхенда
ctx.message         // TelegramMessage | undefined
ctx.text            // string | undefined
// данные callback доступны на верхнем уровне ctx для событий callbackQuery
```

:::

---

## Middleware

::: code-group

```ts [puregram]
bot.updates.use(async (context, next) => {
    console.log("До");
    await next();
    console.log("После");
});
```

```ts [GramIO]
bot.use(async (ctx, next) => {
    console.log("До");
    await next();
    console.log("После");
});
```

:::

**Ключевое изменение:** `bot.updates.use()` → `bot.use()`

---

## Добавление данных в контекст

::: code-group

```ts [puregram — через middleware]
// Ручная аугментация контекста через middleware
bot.updates.use(async (context, next) => {
    (context as any).user = await db.getUser(context.from?.id);
    await next();
});

// Приходится использовать type cast везде
const user = (context as any).user;
```

```ts [GramIO — derive()]
// Типизируется автоматически — никаких кастов
const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }));

bot.on("message", (ctx) => {
    ctx.user; // ✅ полностью типизировано
});
```

:::

```ts
// Статические данные при старте (БД, конфиг)
const bot = new Bot(token)
    .decorate({ db, redis, config });

bot.on("message", (ctx) => {
    ctx.db; // ✅
});
```

---

## Клавиатуры

### Инлайн клавиатура

::: code-group

```ts [puregram]
import { Keyboard } from "puregram";

const keyboard = Keyboard.inline([
    [
        Keyboard.textButton({ text: "Да", payload: "yes" }),
        Keyboard.textButton({ text: "Нет", payload: "no" }),
    ],
]);

context.reply("Выберите:", { reply_markup: keyboard });
```

```ts [GramIO]
import { InlineKeyboard } from "gramio";

const keyboard = new InlineKeyboard()
    .text("Да", "yes")
    .text("Нет", "no");

ctx.send("Выберите:", { reply_markup: keyboard });
```

:::

### Обычная клавиатура

::: code-group

```ts [puregram]
import { Keyboard } from "puregram";

const keyboard = Keyboard.keyboard([
    [Keyboard.textButton({ text: "Вариант А" })],
    [Keyboard.textButton({ text: "Вариант Б" })],
]).resize();

context.reply("Выберите:", { reply_markup: keyboard });
```

```ts [GramIO]
import { Keyboard } from "gramio";

const keyboard = new Keyboard()
    .text("Вариант А")
    .row()
    .text("Вариант Б")
    .resized();

ctx.send("Выберите:", { reply_markup: keyboard });
```

:::

---

## Форматирование

::: code-group

```ts [puregram]
// HTML — необходимо ручное экранирование
context.reply(
    "<b>Привет</b> <a href='https://gramio.dev'>GramIO</a>",
    { parse_mode: "HTML" }
);

// MarkdownV2 — сложное экранирование
context.reply("*Жирный* _курсив_", { parse_mode: "MarkdownV2" });
```

```ts [GramIO]
import { format, bold, italic, link } from "gramio";

// Тегированные шаблоны — без экранирования, без parse_mode
ctx.send(
    format`${bold`Привет`} ${link("GramIO", "https://gramio.dev")}`
);
```

:::

---

## Сессии

::: code-group

```ts [puregram — @puregram/session]
import { SessionManager } from "@puregram/session";

const sessionManager = new SessionManager();

bot.updates.use(sessionManager.middleware);

bot.updates.on("message", (context) => {
    context.session.count ??= 0;
    context.session.count++;
    context.reply(`Счётчик: ${context.session.count}`);
});
```

```ts [GramIO — @gramio/session]
import { session } from "@gramio/session";

const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0 }) })
);

bot.on("message", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number } — типизировано!
    ctx.send(`Счётчик: ${ctx.session.count}`);
});
```

:::

---

## Сцены

::: code-group

```ts [puregram — @puregram/scenes]
import { SceneManager, Scene } from "@puregram/scenes";

const sceneManager = new SceneManager();

const loginScene = new Scene("login");

loginScene.addStep(async (context, next) => {
    await context.reply("Введите email:");
    await next();
});

loginScene.addStep(async (context) => {
    await context.reply(`Получено: ${context.text}`);
});

sceneManager.addScenes([loginScene]);
bot.updates.use(sceneManager.middleware);
```

```ts [GramIO — @gramio/scenes]
import { scenes, Scene } from "@gramio/scenes";
import { session } from "@gramio/session";

const loginScene = new Scene("login")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Введите email:");
        return ctx.scene.update({ email: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Получено: ${ctx.scene.state.email}`)
    );

const bot = new Bot(token)
    .extend(session())
    .extend(scenes([loginScene]));

bot.command("login", (ctx) => ctx.scene.enter(loginScene));
```

:::

---

## Обработка ошибок

::: code-group

```ts [puregram]
// Ручная обёртка в обработчиках
bot.updates.on("message", async (context) => {
    try {
        await riskyOperation();
    } catch (error) {
        context.reply("Что-то пошло не так.");
    }
});
```

```ts [GramIO]
// Глобальный обработчик ошибок
bot.onError(({ context, error }) => {
    console.error(error);
    if (context.is("message")) context.send("Что-то пошло не так.");
});

// Кастомные типизированные ошибки
class PaymentError extends Error {
    constructor(public reason: string) { super(); }
}

bot
    .error("PAYMENT_FAILED", PaymentError)
    .onError(({ kind, error }) => {
        if (kind === "PAYMENT_FAILED") console.log(error.reason);
    });
```

:::

---

## Webhook

::: code-group

```ts [puregram]
import { Telegram } from "puregram";
import express from "express";

const bot = Telegram.fromToken(token);
const app = express();

app.use(express.json());
app.post("/bot", (req, res) => {
    bot.updates.handleUpdate(req.body);
    res.sendStatus(200);
});

app.listen(3000);
```

```ts [GramIO]
import { Bot, webhookHandler } from "gramio";
import express from "express";

const app = express();
app.use(express.json());
app.post("/webhook", webhookHandler(bot, "express"));
app.listen(3000);

// Говорим Telegram, куда отправлять обновления
bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

:::

---

## Отправка файлов

::: code-group

```ts [puregram]
import { MediaSource } from "puregram";

context.replyWithPhoto(MediaSource.path("./photo.jpg"));
context.replyWithPhoto(MediaSource.url("https://example.com/photo.jpg"));
context.replyWithPhoto(MediaSource.buffer(buffer, "photo.jpg"));
```

```ts [GramIO]
import { MediaUpload } from "@gramio/files";

ctx.sendPhoto(await MediaUpload.path("./photo.jpg"));
ctx.sendPhoto(await MediaUpload.url("https://example.com/photo.jpg"));
ctx.sendPhoto(await MediaUpload.buffer(buffer, "photo.jpg"));

// Уже загруженный file_id — передайте напрямую
ctx.sendPhoto("AgACAgIAAxk...");
```

:::

---

## Хуки жизненного цикла

::: code-group

```ts [puregram]
// Ручная настройка — встроенных хуков нет
process.on("SIGINT", () => bot.updates.stopPolling());
```

```ts [GramIO]
bot.onStart(({ info }) => console.log(`@${info.username} запущен`));
bot.onStop(() => console.log("Завершаю работу"));

// Graceful shutdown настраивается вручную
process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());

bot.start();
```

:::

---

## Быстрый справочник символов

| puregram | GramIO | Примечания |
|----------|--------|------------|
| `new Telegram({ token })` | `new Bot(token)` | Прямой аргумент |
| `Telegram.fromToken(token)` | `new Bot(token)` | То же самое |
| `bot.updates.on()` | `bot.on()` | Без `.updates` |
| `bot.updates.use()` | `bot.use()` | Без `.updates` |
| `bot.updates.startPolling()` | `bot.start()` | |
| `context.reply()` | `ctx.send()` | |
| `context.senderId` | `ctx.from?.id` | Нет шортхенда |
| `Keyboard.inline([...])` | `new InlineKeyboard()...` | Fluent builder |
| `Keyboard.keyboard([...])` | `new Keyboard()...` | Fluent builder |
| `MediaSource.path()` | `await MediaUpload.path()` | async |
| `@puregram/hear` | `bot.hears()` встроен | Плагин не нужен |
| `@puregram/session` | `@gramio/session` | |
| `@puregram/scenes` | `@gramio/scenes` | |
| `@puregram/prompt` | `@gramio/prompt` | |
| `parse_mode: "HTML"` | `format\`${bold\`...\`}\`` | Без экранирования |

---

## Следующие шаги

- [Начать работу →](/ru/get-started) — Создание нового проекта GramIO
- [Обзор плагинов →](/ru/plugins/overview) — Сессии, сцены, i18n и многое другое
- [Шпаргалка →](/ru/cheat-sheet) — Часто используемые паттерны
- [Введение →](/ru/introduction) — Почему GramIO, кратко
