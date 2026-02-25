---
title: Почему GramIO — взгляд одним глазом
head:
    - - meta
      - name: "description"
        content: Почему стоит выбрать GramIO для Telegram-бота? Сквозная типизация TypeScript, мультирантаймовая поддержка, компонуемые плагины и автогенерируемые типы API. Сравнение с grammY и Telegraf.
    - - meta
      - name: "keywords"
        content: GramIO vs grammY, GramIO vs Telegraf, сравнение фреймворков telegram bot, типобезопасный telegram бот, typescript telegram bot, введение gramio, почему gramio
---

# Почему GramIO

GramIO — это **TypeScript-first фреймворк для Telegram Bot API**, работающий на Node.js, Bun и Deno. Он построен вокруг одной идеи: система типов должна работать _на вас_, а не против вас.

Вот что это значит на практике.

---

## Типы, которые текут, а не с которыми борешься

Большинство фреймворков дают вам типизированный контекст на входе. GramIO идёт дальше — типы **распространяются по всей цепочке** по мере её построения.

```ts twoslash
// @filename: db.ts
export const db = { getUser: async (id: number) => ({ name: "Alice", role: "admin" as const, balance: 42 }) }
// @filename: index.ts
// ---cut---
// @errors: 2339
import { Bot } from "gramio";
import { db } from "./db";

const bot = new Bot(process.env.BOT_TOKEN as string)
    // добавляем в каждый обработчик — типизируется автоматически
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from!.id),
    }))
    // ctx.user полностью типизирован здесь
    .on("message", (ctx) => {
        ctx.user.role;
        //         ^?
        //
        //
        return ctx.send(`Привет, ${ctx.user.name}!`);
    })
    // ...и здесь, для другого события
    .on("callback_query", (ctx) => ctx.user.balance);
```

Никакого приведения типов. Никаких ручных аннотаций. Никакого `(ctx as any).user`.

---

## Форматирование без `parse_mode`

Форматирование Telegram через HTML или MarkdownV2 — это боль: нужно экранировать всё вручную и следить за `parse_mode`. GramIO использует тегированные шаблонные строки, которые создают корректные объекты `MessageEntity`:

```ts twoslash
import { Bot, format, bold, italic, code, link, spoiler } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("start", (ctx) =>
    ctx.send(
        format`${bold`Добро пожаловать!`} — ${italic("parse_mode не нужен")}.
Версия: ${code("2.0.0")}
${spoiler`секрет`} · ${link("gramio.dev", "https://gramio.dev")}`
    )
);
```

Никакого экранирования. Никакого `parse_mode: "HTML"`. Никаких сломанных сообщений из-за `<` или `>` в тексте.

---

## Плагины, которые компонуются, а не конфигурируются

Плагины в GramIO используют `.extend()` — тот же механизм, что и всё остальное. Плагин может добавлять свойства контекста, регистрировать обработчики и встраиваться в жизненный цикл. И всё это с полной типизацией:

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";
import { session } from "@gramio/session";

const onboarding = new Scene("onboarding")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Как вас зовут?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Добро пожаловать, ${ctx.scene.state.name}!`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([onboarding]))
    .command("start", (ctx) => ctx.scene.enter(onboarding));
//                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                              полная типизация — ctx.scene из плагина

bot.start();
```

---

## Сравнение

| Возможность | GramIO | grammY | Telegraf |
|-------------|--------|--------|----------|
| Язык | TypeScript | TypeScript | TypeScript |
| Распространение типов через middleware | ✅ Полное | ✅ Полное | ⚠️ Частичное |
| `derive()` с авто-типизацией контекста | ✅ | ✅ | ❌ |
| Форматирование без `parse_mode` | ✅ Встроено | ❌ Вручную | ❌ Вручную |
| Система плагинов | ✅ `.extend()` | ✅ Flavors | ⚠️ Middleware |
| Мультирантайм (Node/Bun/Deno) | ✅ | ✅ | ⚠️ Node в приоритете |
| Автогенерируемые типы API | ✅ Авто-публикация | ✅ | ⚠️ |
| Встроенные утилиты для тестирования | ✅ `@gramio/test` | ❌ | ❌ |
| Полный референс Telegram API | ✅ `/telegram/` | ❌ | ❌ |
| Сцены / диалоги | ✅ `@gramio/scenes` | ✅ Conversations | ✅ Scenes |
| I18n | ✅ `@gramio/i18n` (Fluent) | ✅ | ⚠️ |
| CLI для скаффолдинга | ✅ `create gramio` | ❌ | ❌ |

---

## Всё — это Composer

`Bot` расширяет `Composer` — цепочный типобезопасный конвейер обработки middleware. Каждый `.derive()`, `.guard()`, `.on()` возвращает обновлённый тип. Можно выделить `Composer` для любой фичи, тестировать его изолированно, а затем `.extend()` его в бот:

```ts
// src/plugins/index.ts — регистрация один раз
export const composer = new Composer()
    .extend(session())
    .extend(scenes([onboarding]));

// src/features/profile.ts — полная типизация, Bot не нужен
export const profileFeature = new Composer()
    .extend(composer)          // наследует ctx.session, ctx.scene
    .command("profile", (ctx) => ctx.send(ctx.session.name ?? "anon"));

// src/index.ts — склеиваем всё
const bot = new Bot(token)
    .extend(composer)
    .extend(profileFeature);
```

---

## Готовы создавать?

<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">

[Начать →](/ru/get-started)

[Плагины →](/ru/plugins/overview)

[Референс Telegram API →](/telegram/)

</div>
