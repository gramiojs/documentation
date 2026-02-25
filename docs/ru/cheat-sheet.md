---
title: Шпаргалка GramIO — Быстрый справочник по разработке Telegram-ботов
head:
    - - meta
      - name: "description"
        content: "Быстрый справочник по GramIO — TypeScript-фреймворку для Telegram Bot API. Команды, триггеры, клавиатуры, форматирование, плагины, хуки, guard, derive, i18n, тестирование и многое другое на одной странице."
    - - meta
      - name: "keywords"
        content: "GramIO, шпаргалка, быстрый справочник, telegram бот, TypeScript, команды, триггеры, клавиатуры, хуки, плагины, форматирование, сессии, файлы, guard, derive, i18n, тестирование"
---

# Шпаргалка

Быстрый справочник по самым распространённым паттернам GramIO. Нажмите на любой заголовок, чтобы перейти к полной документации.

**На этой странице:** [Настройка](#настройка) · [Команды](#команды) · [Hears](#hears) · [Любое обновление](#прослушивание-любых-обновлений) · [Derive и Decorate](#derive-и-decorate) · [Guard](#guard) · [Инлайн клавиатура](#инлайн-клавиатура) · [Callback Query](#callback-query) · [Обычная клавиатура](#обычная-клавиатура) · [Форматирование](#форматирование-сообщений) · [Файлы](#отправка-файлов) · [Session](#session) · [Scenes](#scenes-диалоги) · [I18n](#i18n) · [Обработка ошибок](#обработка-ошибок) · [Хуки](#хуки) · [Плагины](#использование-плагина) · [Написать плагин](#написать-плагин) · [Inline Query](#inline-query) · [Autoload](#autoload-обработчиков) · [Тестирование](#тестирование) · [Webhook](#webhook)

---

## [Настройка](/ru/get-started)

```bash
npm create gramio my-bot
```

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

---

## [Команды](/ru/triggers/command)

```ts
bot.command("start", (ctx) => ctx.send("Привет!"));

// С аргументами: /say привет мир → ctx.args = "привет мир"
bot.command("say", (ctx) => ctx.send(ctx.args ?? "ничего"));
```

---

## [Hears](/ru/triggers/hears)

```ts
// Точная строка
bot.hears("привет", (ctx) => ctx.send("Привет!"));

// Regex — ctx.args содержит массив совпадений
bot.hears(/^hello (.+)/i, (ctx) => ctx.send(`Привет, ${ctx.args?.[1]}!`));

// Функция-предикат
bot.hears(
    (ctx) => ctx.text?.startsWith("?"),
    (ctx) => ctx.send("Вопрос!"),
);
```

---

## [Прослушивание любых обновлений](/ru/bot-api)

```ts
bot.on("message", (ctx) => ctx.send("Получил твоё сообщение!"));

bot.on(["message", "edited_message"], (ctx) => ctx.send("Новое или отредактированное!"));
```

---

## [Derive и Decorate](/ru/extend/middleware)

`derive` выполняется при каждом запросе; `decorate` — один раз при запуске.

```ts
// На каждый запрос: обогащает ctx свежими данными
const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }))
    .on("message", (ctx) => {
        ctx.user; // полностью типизировано ✅
    });
```

```ts
// На тип обновления: только для конкретных событий
const bot = new Bot(token)
    .derive("message", async (ctx) => ({
        isAdmin: await db.isAdmin(ctx.from.id),
    }))
    .on("message", (ctx) => {
        ctx.isAdmin; // ✅ — типизировано только в "message" обработчиках
    });
```

```ts
// При старте: без накладных расходов на каждый запрос
const bot = new Bot(token)
    .decorate({ db, redis, config })
    .on("message", (ctx) => {
        ctx.db.query("..."); // ✅ — один и тот же экземпляр каждый раз
    });
```

---

## [Guard](/ru/extend/middleware)

Останавливает цепочку middleware, если условие не выполнено. Последующие обработчики выполняются только если guard пропускает.

```ts
// Переиспользуемый guard для администраторов
const adminOnly = bot.guard(
    (ctx) => ctx.from?.id === ADMIN_ID,
    // опциональный обработчик отклонения:
    (ctx) => ctx.send("Только для администраторов.")
);

adminOnly.command("ban", (ctx) => ctx.send("Пользователь заблокирован."));
```

```ts
// Сужение типа обновления — фильтр для сообщений с текстом
const textOnly = bot.guard((ctx) => ctx.is("message") && !!ctx.text);

textOnly.on("message", (ctx) => {
    ctx.text; // string — сужен guard'ом ✅
});
```

---

## [Инлайн клавиатура](/ru/keyboards/inline-keyboard)

```ts
import { InlineKeyboard, CallbackData } from "gramio";

// Простые текстовые кнопки
const keyboard = new InlineKeyboard()
    .text("Да ✅", "yes")
    .text("Нет ❌", "no")
    .row()
    .url("GitHub", "https://github.com/gramiojs/gramio");

ctx.send("Выберите:", { reply_markup: keyboard });
```

```ts
// Типобезопасные callback данные
const actionData = new CallbackData("action").number("id");

ctx.send("Выберите:", {
    reply_markup: new InlineKeyboard()
        .text("Пункт 1", actionData.pack({ id: 1 }))
        .text("Пункт 2", actionData.pack({ id: 2 })),
});
```

---

## [Callback Query](/ru/triggers/callback-query)

```ts
// По строке
bot.callbackQuery("yes", (ctx) => ctx.editText("Вы сказали да!"));

// Типобезопасные CallbackData
const actionData = new CallbackData("action").number("id");

bot.callbackQuery(actionData, (ctx) => {
    ctx.send(`Вы выбрали ID: ${ctx.queryData.id}`);
    //                                      ^? number
});
```

---

## [Обычная клавиатура](/ru/keyboards/keyboard)

```ts
import { Keyboard } from "gramio";

const keyboard = new Keyboard()
    .text("Вариант А")
    .text("Вариант Б")
    .row()
    .requestLocation("Поделиться геолокацией 📍")
    .resized();

ctx.send("Выберите:", { reply_markup: keyboard });
```

---

## [Удалить клавиатуру](/ru/keyboards/remove-keyboard)

```ts
import { RemoveKeyboard } from "gramio";

ctx.send("Клавиатура удалена.", { reply_markup: new RemoveKeyboard() });
```

---

## [Форматирование сообщений](/ru/formatting)

```ts
import { format, bold, italic, link, code, pre, spoiler } from "gramio";

ctx.send(format`
    ${bold`Привет!`} Добро пожаловать в ${link("GramIO", "https://gramio.dev")}.

    Вот немного ${italic`стилизованного`} текста и ${spoiler`сюрприз`}.

    ${code("инлайн код")} или блок:
    ${pre("const x = 1;", "typescript")}
`);
```

---

## [Отправка файлов](/ru/files/media-upload)

```ts
import { MediaUpload } from "@gramio/files";

// С диска
ctx.sendDocument(await MediaUpload.path("./report.pdf"));

// По URL
ctx.sendPhoto(await MediaUpload.url("https://example.com/cat.png"));

// Из Buffer
ctx.sendDocument(await MediaUpload.buffer(buffer, "file.pdf"));

// По file_id (уже загружен в Telegram)
ctx.sendPhoto("AgACAgIAAxk...");
```

---

## [Session](/ru/plugins/official/session)

```ts
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string).extend(
    session({
        key: "session",
        initial: () => ({ count: 0 }),
    }),
);

bot.command("count", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number }
    ctx.send(`Счётчик: ${ctx.session.count}`);
});
```

---

## [Scenes (диалоги)](/ru/plugins/official/scenes)

```ts
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const loginScene = new Scene("login")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Введите email:");
        return ctx.scene.update({ email: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Зарегистрировано: ${ctx.scene.state.email}`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([loginScene]));

bot.command("login", (ctx) => ctx.scene.enter(loginScene));
```

---

## [I18n](/ru/plugins/official/i18n)

```ts
import { defineI18n, type LanguageMap, type ShouldFollowLanguage } from "@gramio/i18n";
import { format, bold } from "gramio";

const en = {
    welcome: (name: string) => format`Hello, ${bold(name)}!`,
    items: (count: number) => `You have ${count} item${count === 1 ? "" : "s"}`,
} satisfies LanguageMap;

const ru = {
    welcome: (name: string) => format`Привет, ${bold(name)}!`,
    items: (count: number) => `У вас ${count} предмет${count === 1 ? "" : "ов"}`,
} satisfies ShouldFollowLanguage<typeof en>; // должен совпадать с ключами/сигнатурами en

const i18n = defineI18n({ primaryLanguage: "en", languages: { en, ru } });

const bot = new Bot(token)
    .derive((ctx) => ({
        t: i18n.buildT(ctx.from?.language_code ?? "en"),
    }));

bot.command("start", (ctx) =>
    ctx.send(ctx.t("welcome", ctx.from?.first_name ?? "незнакомец"))
);
```

---

## [Обработка ошибок](/ru/hooks/on-error)

```ts
// Перехват всех ошибок
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Что-то пошло не так.");
});

// Только для определённых типов обновлений
bot.onError("message", ({ context, kind, error }) => {
    context.send(`${kind}: ${error.message}`);
});

// Кастомные типизированные ошибки
class NoRights extends Error {
    constructor(public role: "admin" | "moderator") {
        super();
    }
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .error("NO_RIGHTS", NoRights)
    .onError(({ kind, error, context }) => {
        if (kind === "NO_RIGHTS" && context.is("message"))
            context.send(`Вам нужна роль «${error.role}».`);
    });
```

---

## [Хуки](/ru/hooks/overview)

```ts
bot.onStart((info) => console.log(`@${info.username} запущен!`));

bot.onStop(() => console.log("Завершаю работу..."));

// Перехват каждого API запроса
bot.preRequest((ctx) => {
    console.log("Вызываю", ctx.method);
    return ctx;
});

// Просмотр каждого ответа
bot.onResponse((ctx) => {
    console.log(ctx.method, "→", ctx.response);
    return ctx;
});
```

---

## [Использование плагина](/ru/plugins/overview)

```ts
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query";

bot.extend(autoAnswerCallbackQuery());
```

---

## [Написать плагин](/ru/plugins/how-to-write)

```ts
import { Plugin } from "gramio";

const myPlugin = new Plugin("my-plugin").derive("message", (ctx) => ({
    isAdmin: ctx.from?.id === 123456789,
}));

bot.extend(myPlugin);

bot.on("message", (ctx) => {
    if (ctx.isAdmin) ctx.send("Привет, босс!");
    //     ^? boolean
});
```

---

## [Inline Query](/ru/triggers/inline-query)

```ts
bot.inlineQuery("cats", async (ctx) => {
    await ctx.answer(
        [
            ctx.buildInlineQueryResult.article({
                id: "1",
                title: "Факт о кошках",
                input_message_content: { message_text: "Кошки мурлычут на частоте 25 Гц." },
            }),
        ],
        { cache_time: 30 },
    );
});
```

---

## [Autoload обработчиков](/ru/plugins/official/autoload)

```ts
import { autoload } from "@gramio/autoload";

// Автоматически загружает все файлы из ./src/commands/**/*.ts
const bot = new Bot(process.env.BOT_TOKEN as string).extend(autoload());
```

```ts
// src/commands/start.ts
import type { Bot } from "gramio";

export default (bot: Bot) => bot.command("start", (ctx) => ctx.send("Привет!"));
```

---

## [Тестирование](/ru/testing)

```ts
import { describe, expect, it } from "bun:test";
import { Bot } from "gramio";
import { TelegramTestEnvironment } from "@gramio/test";

const bot = new Bot("test");
bot.command("start", (ctx) => ctx.send("Привет!"));

const env = new TelegramTestEnvironment(bot);
const user = env.createUser({ first_name: "Алиса" });

// Симулируем команду /start
await user.sendMessage("/start");

// Проверяем ответ
expect(env.apiCalls[0].method).toBe("sendMessage");
expect(env.apiCalls[0].params.text).toBe("Привет!");
```

---

## [Webhook](/ru/updates/webhook)

В GramIO нет встроенного HTTP-сервера — подключите свой фреймворк и используйте `webhookHandler`:

```ts
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });

bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

[Все поддерживаемые фреймворки →](/ru/updates/webhook) (Hono, Express, Elysia, Koa, Bun.serve, Deno.serve, node:http)
