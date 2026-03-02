---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: GramIO - Мощный Telegram Bot API фреймворк для TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: GramIO — типобезопасный TypeScript-фреймворк для Telegram-ботов на Node.js, Bun и Deno. Одна команда разворачивает всё — плагины, ORM, Docker. Сквозная типизация, мультирантайм, расширяемость.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, типобезопасный, инлайн клавиатуры, плагины, обработчики команд, middleware, сцены, сессии, i18n

hero:
    name: "GramIO"
    text: |
        Создавайте <span class="text-telegram"><span class="i-logos:telegram inline-block text-3xl md:text-5xl"></span> Telegram</span> ботов правильно.
    tagline: Типобезопасно · Мультирантайм · Расширяемо
    image:
        dark: /logo.svg
        light: /logo-light.svg
    actions:
        - theme: brand
          text: Начать →
          link: /ru/get-started
        - theme: alt
          text: Почему GramIO
          link: /ru/introduction

features:
    - icon: ⚡
      title: Бот за 30 секунд
      details: <code>npm create gramio@latest</code> разворачивает полный проект — TypeScript, ORM, линтинг, плагины, Docker — на ваш выбор.
    - icon: 🛡️
      title: Сквозная типизация
      details: Типы текут от плагинов через <a href="/ru/extend/middleware">middleware</a> и <a href="/ru/extend/composer">derive()</a> прямо в обработчики. Без кастов, без <code>any</code>.
    - icon: 🧩
      title: Богатая экосистема плагинов
      details: <a href="/ru/plugins/official/scenes">Scenes</a>, <a href="/ru/plugins/official/session">Sessions</a>, <a href="/ru/plugins/official/i18n">I18n</a>, <a href="/ru/plugins/official/auto-retry">Auto-retry</a>, <a href="/ru/plugins/official/autoload">Autoload</a> и другие — всё компонуется через <code>.extend()</code>.
    - icon: 🌐
      title: Истинный мультирантайм
      details: Работает на <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> и <a href="https://deno.com/">Deno</a> без каких-либо изменений в конфигурации.
    - icon: 📡
      title: Полный референс Telegram API
      details: Каждый метод и тип с TypeScript-примерами GramIO, таблицами ошибок и советами. <a href="/telegram/">Открыть референс →</a>
    - icon: ⚙️
      title: Автогенерация и актуальность
      details: Типы Telegram Bot API автоматически генерируются и публикуются при каждом релизе API — вы всегда в курсе изменений.
---

## Посмотрите на деле

::: code-group

```ts [Команды и форматирование]
import { Bot, format, bold, link } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) =>
        ctx.send(
            format`${bold`Привет, ${ctx.from?.firstName ?? "незнакомец"}!`}

Добро пожаловать в ${link("GramIO", "https://gramio.dev")} — создавайте Telegram-ботов правильно.`,
        ),
    )
    .onError(({ kind, error }) => console.error(kind, error))
    .start();
```

```ts [Клавиатуры и коллбеки]
import { Bot, InlineKeyboard, CallbackData } from "gramio";

const voteData = new CallbackData("vote").string("choice");

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("poll", (ctx) =>
        ctx.send("Нравится ли вам GramIO?", {
            reply_markup: new InlineKeyboard()
                .text("Да ✅", voteData.pack({ choice: "yes" }))
                .text("Конечно 🔥", voteData.pack({ choice: "yes2" })),
        }),
    )
    .callbackQuery(voteData, (ctx) => {
        ctx.queryData.choice; // ^? string
        return ctx.answer();
    })
    .start();
```

```ts [I18n]
import {
    defineI18n,
    type LanguageMap,
    type ShouldFollowLanguage,
} from "@gramio/i18n";
import { Bot, format, bold } from "gramio";

const en = {
    welcome: (name: string) => format`Hello, ${bold(name)}!`,
    items: (n: number) => `You have ${n} item${n === 1 ? "" : "s"}`,
} satisfies LanguageMap;

const ru = {
    welcome: (name: string) => format`Привет, ${bold(name)}!`,
    items: (n: number) => `У вас ${n} предмет${n === 1 ? "" : "ов"}`,
} satisfies ShouldFollowLanguage<typeof en>; // ключи и сигнатуры должны совпадать

const i18n = defineI18n({ primaryLanguage: "en", languages: { en, ru } });

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive((ctx) => ({
        t: i18n.buildT(ctx.from?.language_code ?? "en"),
    }))
    .command("start", (ctx) =>
        ctx.send(ctx.t("welcome", ctx.from?.firstName ?? "незнакомец")),
    )
    .start();
```

```ts [Сцены]
import { Bot } from "gramio";
import { Scene, scenes } from "@gramio/scenes";
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Как вас зовут?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime)
            return ctx.send(`Привет, ${ctx.scene.state.name}! Ваш email?`);
        return ctx.scene.update({ email: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(
            `Зарегистрирован: ${ctx.scene.state.name} — ${ctx.scene.state.email} ✅`,
        ),
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(scenes([registerScene], { storage: redisStorage(new Redis()) }))
    .command("register", (ctx) => ctx.scene.enter(registerScene))
    .start();
```

```ts [Composer]
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

// Общий middleware — типизированный контекст доступен в каждом модуле
const withUser = new Composer()
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id ?? 0),
    }))
    .as("scoped");

// Feature-модуль — guard и команды в одной цепочке
const adminRouter = new Composer()
    .extend(withUser)
    .guard((ctx) => ctx.user.role === "admin")
    .command("ban", (ctx) => ctx.send(`Заблокирован — ${ctx.user.name}`))
    .command("stats", (ctx) => ctx.send("Статистика..."));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser) // ctx.user — типизирован везде ниже
    .extend(adminRouter) // withUser внутри → дедуплицируется, запускается один раз
    .command(
        "profile",
        (
            ctx, // без guard — выполняется для всех
        ) => ctx.send(`Привет, ${ctx.user.name}!`),
        //                  ^? полностью типизировано
    )
    .start();
```

:::

## Последние обновления

**[Bot API 9.5, дебют Rate Limiter, конвертер HTML в Telegram, суперсилы Composer](/ru/changelogs/2026-03-02)** — 23 февраля – 2 марта 2026

Поддержка Bot API 9.5 во всей экосистеме (теги участников, сущности `date_time`). Новый плагин `@gramio/rate-limit` с макросным троттлингом. `@gramio/format` v0.5.0 — `htmlToFormattable()`. `@gramio/composer` получает `EventContextOf`, `ContextOf`, `defineComposerMethods` и систему макросов.

[Все обновления →](/ru/changelogs/)

## Начало работы

::: code-group

```bash [npm]
npm create gramio@latest ./bot
```

```bash [yarn]
yarn create gramio@latest ./bot
```

```bash [pnpm]
pnpm create gramio@latest ./bot
```

```bash [bun]
bun create gramio@latest ./bot
```

:::

[Полный гайд по началу работы →](/ru/get-started)
