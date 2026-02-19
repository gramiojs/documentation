---
title: "Middleware и Context — Как обновления проходят через GramIO"
head:
    - - meta
      - name: "description"
        content: "Узнайте, как работает middleware-pipeline в GramIO: как проходят обновления, как derive() строит типизированный контекст, как on() фильтрует по типу и как составлять переиспользуемые middleware-группы с Composer."
    - - meta
      - name: "keywords"
        content: "gramio, middleware, context, derive, decorate, on, when, composer, type inference, pipeline, обработка обновлений, TypeScript"
---

# Middleware и Context

Каждое Telegram-обновление, поступающее в вашего бота — это просто **данные, проходящие через конвейер**. GramIO предоставляет типобезопасный, цепочечный API для формирования этого конвейера именно так, как вам нужно — слой за слоем, с отслеживанием всего на уровне TypeScript.

::: tip Быстрая навигация
Если вы ищете низкоуровневый движок, на котором всё построено, — смотрите [@gramio/composer](./composer.md).
Эта страница сосредоточена на паттернах, которые вы будете реально использовать при написании ботов.
:::

## Ментальная модель

Представьте бота как конвейер на заводе. Обновление входит, проходит через каждую «станцию» и выходит:

```
Update → [use: logger] → [on("message")] → [derive: user] → [handler] → Response
                                ↓ skip (callback_query)
                         [on("callback_query")] → [handler]
```

Каждая «станция» — это middleware. Они выполняются **в порядке регистрации**. Ключевое: **каждый метод возвращает обновлённого бота**, поэтому вы всегда используете цепочки.

## Пройдите через конвейер интерактивно

Переключите тип обновления и режим отладки — посмотрите, что происходит:

<UpdatePipelineVisualizer />

Обратите внимание: `.on()` **не останавливает** конвейер при несовпадении типа — он просто пропускает свой обработчик. А `.when()` — это решение на этапе **запуска**: middleware либо регистрируется, либо нет.

## Всегда используйте цепочки

Система типов GramIO построена на цепочечных вызовах. Каждый метод фиксирует, что он добавил в `ctx`, и возвращает обновлённый тип. Если разорвать цепочку, TypeScript теряет эту информацию:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
// ✅ Правильно — типы передаются через цепочку
const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive(() => ({ db: { getUser: (id: number) => ({ name: "Alice" }) } }))
    .command("start", (ctx) => {
        ctx.db.getUser(1); // ✅ полностью типизировано
    });
```

```ts twoslash
import { Bot } from "gramio";
// ---cut---
// ❌ Разрыв цепочки теряет типы
const bot = new Bot(process.env.BOT_TOKEN as string);
bot.derive(() => ({ db: { getUser: (id: number) => ({ name: "Alice" }) } }));
bot.command("start", (ctx) => {
    // @ts-expect-error — ctx.db не существует! derive зарегистрирован на другом типе.
    ctx.db;
});
```

Всегда стройте бота как одно цепочечное выражение или сохраняйте промежуточный результат:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const withDb = new Bot(process.env.BOT_TOKEN as string)
    .derive(() => ({ db: { getUser: (id: number) => ({ name: "Alice" }) } }));

// Продолжаем цепочку от результата — типы сохранены
withDb.command("start", (ctx) => {
    ctx.db.getUser(1); // ✅
});
```

## Обогащение контекста: derive()

`derive()` запускает функцию **на каждом обновлении** и объединяет возвращённый объект с `ctx`. Всё, что зарегистрировано после, видит новые свойства — полностью типизированными.

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive(async () => {
        // В реальном коде: const user = await db.getUser(ctx.from!.id)
        const user = { id: 42, name: "Alice", premium: true };
        return { user };
    })
    .command("start", async (ctx) => {
        ctx.user.name; // ✅ string — TypeScript знает!
        //   ^?
        await ctx.send(`Привет, ${ctx.user.name}!`);
    });
```

### Scoped derive()

Запускайте derive только для определённых типов обновлений:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive("message", (ctx) => ({
        wordCount: (ctx.text ?? "").split(" ").length,
    }))
    .on("message", (ctx) => {
        ctx.wordCount; // ✅ доступно здесь
        //  ^?
    });
```

## Статические значения: decorate()

Для значений, которые не меняются между запросами, используйте `decorate()`. Объект присваивается **один раз** при запуске:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const db = { getUser: (id: number) => Promise.resolve({ name: "Alice" }) };
const config = { maxRetries: 3, environment: "production" as const };

const bot = new Bot(process.env.BOT_TOKEN as string)
    .decorate({ db, config })
    .command("start", async (ctx) => {
        const user = await ctx.db.getUser(ctx.from!.id);
        //                  ^?
        ctx.send(`Привет! (env: ${ctx.config.environment})`);
    });
```

| | `derive()` | `decorate()` |
|---|---|---|
| Запускается | На каждом обновлении | Один раз при старте |
| Для чего | Загружаемые/вычисляемые значения | Подключения к БД, клиенты, конфиг |
| Накладные расходы | Вызов функции на каждое обновление | Нет — та же ссылка каждый раз |

## Маршрутизация: on()

`.on()` регистрирует обработчик только для конкретного типа обновления. Цепочка **продолжается** независимо от того, совпал тип или нет — это не guard, это просто фильтр для конкретного обработчика:

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    // Только для текстовых сообщений
    .on("message", (ctx) => ctx.send("Получено сообщение!"))
    // Только для нажатий инлайн-кнопок
    .on("callback_query", (ctx) => ctx.answerCallbackQuery("Нажато!"));
    // Оба обработчика зарегистрированы — каждый выполняется только для "своего" типа
```

## Условная регистрация: when()

::: info API уровня Composer
`when()` доступен на `Composer` из `@gramio/composer`. Создайте конвейер как `Composer`, затем подключите его через `bot.extend()`.
:::

Регистрируйте middleware условно при **запуске** (не на каждом запросе) с помощью `when()`. Middleware либо регистрируется, либо нет — накладных расходов в рантайме нет:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const pipeline = new Composer()
    .when(
        process.env.NODE_ENV !== "production",
        (c) => c.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            console.log(`[${ctx.updateType}] ${Date.now() - start}мс`);
        })
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(pipeline)
    .command("start", (ctx) => ctx.send("Привет!"));
```

Свойства, добавленные внутри блока `when()`, типизируются как **`Partial`** (опциональные) — TypeScript корректно отражает, что middleware может быть не зарегистрирован.

## Компоновка и переиспользование: Composer

Для переиспользования middleware-групп используйте `Composer` из `@gramio/composer`:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

// ── Переиспользуемый middleware с derive ───────────────────────────────
const userMiddleware = new Composer()
    .derive(async () => ({
        // В реальном коде: await db.getUser(ctx.from!.id)
        user: { name: "Alice", premium: true },
    }));

// ── Бот использует shared middleware ──────────────────────────────────
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(userMiddleware)        // встраиваем middleware
    .command("start", (ctx) => {
        ctx.user.name;             // ✅ типизировано — пришло из userMiddleware
        ctx.send(`Привет, ${ctx.user.name}!`);
    })
    .command("profile", (ctx) => {
        ctx.send(`Профиль: ${ctx.user.name} (premium: ${ctx.user.premium})`);
    });
```

### Порядок middleware важен

Middleware выполняется **в порядке регистрации**. Composer встраивает свой middleware в точке вызова `.extend()`:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const logger = new Composer().use(async (ctx, next) => {
    console.log("до:", ctx.updateType);
    await next();
    console.log("после");
});

const bot = new Bot(process.env.BOT_TOKEN as string)
    .use(async (_, next) => { console.log("1"); await next() })  // 1-й
    .extend(logger)                                               // 2-й
    .use(async (_, next) => { console.log("3"); await next() })  // 3-й
    .command("start", () => console.log("4"));                   // 4-й
```

## Практические паттерны

### Переиспользуемый middleware для пользователя

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const db = {
    getUser: (id: number) =>
        Promise.resolve({ id, name: "Alice", role: "admin" as "admin" | "user" }),
};

// Загрузка пользователя — переиспользуется везде
const withUser = new Composer()
    .derive(async (ctx) => ({
        db,
        user: await db.getUser(ctx.from?.id ?? 0),
    }));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser)
    .command("profile", (ctx) => ctx.send(`Привет, ${ctx.user.name}!`))
    .command("role",    (ctx) => ctx.send(`Роль: ${ctx.user.role}`));
```

### Разбивка по файлам

```ts
// middleware/user.ts
import { Composer } from "@gramio/composer";
export const withUser = new Composer()
    .derive(async (ctx) => ({ user: await db.getUser(ctx.from?.id ?? 0) }));

// bot.ts
import { withUser } from "./middleware/user";
const bot = new Bot(TOKEN)
    .extend(withUser)
    .command("start", (ctx) => { /* ctx.user доступен */ });
```

### Feature-флаги с when()

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const FEATURES = {
    debugMode: process.env.NODE_ENV !== "production",
};

const featurePipeline = new Composer()
    .when(FEATURES.debugMode, (c) => c.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        console.log(`[${ctx.updateType}] ${Date.now() - start}мс`);
    }));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(featurePipeline)
    .command("start", (ctx) => ctx.send("Привет!"));
```

## Архитектура production-бота

По мере роста бота за пределы одного файла, слоистые **именованные** Composer'ы позволяют каждому модулю объявлять собственные зависимости и оставаться самодостаточным — а дедупликация GramIO гарантирует, что общий middleware выполняется ровно один раз на обновление.

```
bot
  .extend(withUser)    ← scoped: derive записывает ctx.user в реальный ctx
  .extend(adminRouter) ← withUser внутри → dedup: пропускается
  .extend(chatRouter)  ← withUser/withChat внутри → dedup: пропускается

  adminRouter: .extend(withUser) + .guard + команды   (только типы)
  chatRouter:  .extend(withUser) + .extend(withChat) + обработчики
```

### 1. Общая база: `withUser`

Назовите общий Composer и пометьте его `.as("scoped")`. Оба шага важны:

```ts
// middleware/user.ts
import { Composer } from "@gramio/composer";

export const db = {
    getUser: (id: number) =>
        Promise.resolve({ id, name: "Alice", role: "admin" as "admin" | "user" }),
    getChat: (id: number) =>
        Promise.resolve({ id, title: "Мой чат", language: "ru" }),
};

export const withUser = new Composer({ name: "withUser" })
    .decorate({ db })
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id ?? 0),
    }))
    .as("scoped");
```

**`{ name: "withUser" }`** — GramIO отслеживает расширенные имена в `Set`. Когда `bot.extend(adminRouter)` выполняется и `adminRouter` уже расширил `withUser`, ключ `"withUser:null"` переносится в extended-множество `bot`. Последующий `bot.extend(withUser)` (или из другого роутера) становится no-op. Дедупликация транзитивна.

**`.as("scoped")`** — по умолчанию `extend()` оборачивает middleware расширяемого Composer'а в isolation group через `Object.create(ctx)`. Derive выполняется, но результаты остаются внутри группы и не попадают в родительский `ctx`. `.as("scoped")` отключает это: middleware добавляется как plain-функция на родительский `ctx`, и `ctx.user` записывается в реальный `ctx`, доступный везде через prototype chain JavaScript.

### 2. Admin-роутер

```ts
// routers/admin.ts
import { Composer } from "@gramio/composer";
import { withUser } from "../middleware/user";

export const adminRouter = new Composer({ name: "adminRouter" })
    .extend(withUser)                              // типы ✅  ctx.db ✅
    .guard((ctx) => ctx.user.role === "admin")     // не-администраторы остановлены здесь
    .command("ban", (ctx) =>
        ctx.send(`Забанен! (от ${ctx.user.name})`))
    .command("stats", async (ctx) => {
        const target = await ctx.db.getUser(42);
        ctx.send(`Статистика для: ${target.name}`);
    })
    .command("kick", (ctx) => ctx.send("Кикнут!"));
```

TypeScript выводит `ctx.user` и `ctx.db` потому что `adminRouter` расширяет `withUser`. В рантайме — когда `bot` расширяет `withUser` первым — дедупликация пропускает `withUser` внутри `adminRouter`. Derive не выполняется дважды.

### 3. Chat-роутер

```ts
// routers/chat.ts
import { Composer } from "@gramio/composer";
import { db, withUser } from "../middleware/user";

const withChat = new Composer({ name: "withChat" })
    .derive("message", async (ctx) => ({
        chatRecord: await db.getChat(ctx.chat.id),
    }))
    .as("scoped");

export const chatRouter = new Composer({ name: "chatRouter" })
    .extend(withUser)   // типы ✅  ctx.db ✅
    .extend(withChat)   // ctx.chatRecord ✅  (Partial вне message-обработчиков)
    .on("message", (ctx) => {
        ctx.send(`${ctx.user.name} в ${ctx.chatRecord.title}`);
    })
    .command("topic", (ctx) =>
        ctx.send(`Язык: ${ctx.chatRecord?.language ?? "unknown"}`))
    .command("rules", (ctx) =>
        ctx.send(`Чат: ${ctx.chatRecord?.title ?? "unknown"}`));
```

Примечание: `ctx.chat` (без суффикса) — встроенное свойство Telegram-события в GramIO, поэтому используем `chatRecord`.

### 4. Сборка в `bot.ts`

```ts
// bot.ts
import { Bot } from "gramio";
import { withUser }    from "./middleware/user";
import { adminRouter } from "./routers/admin";
import { chatRouter }  from "./routers/chat";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser)    // ← ПЕРВЫМ: scoped derive записывает ctx.user в реальный ctx
    .extend(adminRouter) // dedup: withUser внутри adminRouter → пропускается
    .extend(chatRouter)  // dedup: withUser + withChat внутри chatRouter → пропускается
    .command("start", (ctx) => ctx.send("Привет!"))
    .start();
```

`withUser` должен идти **перед** роутерами. После этого `ctx.user` находится в реальном `ctx` — каждая isolation group, созданная последующими `extend()`, читает его прозрачно через prototype chain.

### Ловушка дедупликации

::: warning Dedup ≠ общие данные
Именованный Composer включает дедупликацию на этапе **регистрации**. Но если расширять `withUser` только внутри sub-composerов (не на верхнем уровне), dedup убирает его из второго роутера — при этом первая isolation group по-прежнему владеет результатом:

```
isolated_adminRouter: [decorate, derive, adminHandlers] ← ctx.user записан здесь
isolated_chatRouter:  [chatHandlers]                    ← ctx.user НЕ виден ❌
```

TypeScript-типы корректны; рантайм — нет. Это единственное место в GramIO, где они расходятся.

**Решение**: расширяйте `withUser` с `.as("scoped")` на верхнем уровне **до** роутеров, как показано в `bot.ts` выше.
:::

### Когда ловушка не проявляется

Если роутеры **взаимоисключающие** — каждое обновление обрабатывается ровно одним из них — проблемы нет. Guard администратора останавливает не-adminов; chat-роутер обрабатывает только то, что не совпало раньше. Каждое обновление проходит ровно через одну isolation group.

Ловушка срабатывает только когда оба роутера вызывают `next()` для одного обновления — на практике это редкость.

### Что видит каждый слой

| Слой | `ctx.user` | `ctx.db` | `ctx.chatRecord` | Guard |
|------|-----------|---------|-----------------|-------|
| `bot` (верхний) | ✅ | ✅ | — | — |
| `adminRouter` | ✅ | ✅ | — | user.role === "admin" |
| `chatRouter` (message) | ✅ | ✅ | ✅ | — |
| `chatRouter` (другие) | ✅ | ✅ | Partial | — |

Один DB-запрос на обновление, `ctx.user` доступен везде.

::: tip `guard()` — это уровень Composer
`guard()` доступен на `Composer` из `@gramio/composer`, а не напрямую на `Bot`. Именно поэтому `adminRouter` — это `Composer`: он получает полный composition API, а затем передаётся в `bot.extend()`.
:::

## Итог

| Метод | Когда использовать |
|-------|-------------------|
| `use(fn)` | Сырой middleware — требует вызова `next()`, оборачивает всю цепочку |
| `derive(fn)` | Добавить вычисляемые значения в `ctx` для каждого обновления |
| `derive(type, fn)` | То же, но только для определённых типов обновлений |
| `decorate(obj)` | Добавить статические значения (подключения к БД, конфиг) один раз при старте |
| `on(type, fn)` | Обработать определённые типы обновлений (не останавливает цепочку) |
| `when(cond, fn)` | Условная регистрация middleware при запуске (уровень Composer) |
| `extend(composer)` | Встроить `Composer` в конвейер в данной позиции |

Для понимания низкоуровневого движка — смотрите [@gramio/composer](./composer.md).
