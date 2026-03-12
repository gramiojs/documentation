---
title: Структурирование крупных ботов с Composer
head:
    - - meta
      - name: "description"
        content: "Узнайте, как разбить растущий GramIO-бот на модули с помощью Composer. Разделяйте контекст между файлами через derive(), правильно типизируйте обработчики и компонуйте роутеры в чистую архитектуру бота."
    - - meta
      - name: "keywords"
        content: "GramIO Composer, модульная архитектура бота, разделить файлы бота, переиспользуемый middleware, derive контекст, TypeScript структура бота, feature модули, роутинг бота"
---

# Структурирование крупных ботов с Composer

Когда бот вырастает за пределы одного файла, цепочка в `bot.ts` становится трудночитаемой. Ответ GramIO — `Composer` — тот же строительный блок, на котором построен `Bot`. Вы можете извлечь любую часть цепочки в `Composer`, типизировать её независимо и объединить обратно через `.extend()`.

::: tip Справочник
Этот гайд фокусируется на практических паттернах. Для полного API — `when()`, `inspect()`, `trace()`, система областей видимости — смотрите справочник [Middleware & Context](/ru/extend/middleware).
:::

---

## Проблема

Бот с большим количеством функций начинает выглядеть так:

```ts
const bot = new Bot(token)
    .derive(fetchUser)
    .derive(fetchChat)
    .command("start", ...)
    .command("help", ...)
    .command("ban", ...)
    .command("kick", ...)
    .command("stats", ...)
    .on("message", ...)
    .callbackQuery("confirm", ...)
    .callbackQuery("cancel", ...)
    // ... ещё 50 обработчиков
    .start();
```

`Composer` позволяет разбить это на сфокусированные модули, каждый из которых владеет своими обработчиками и обогащением контекста.

---

## Что такое Composer?

`Composer` — это класс, на котором построен сам `Bot`. Всё, что можно чейнить на `Bot` — `.command()`, `.on()`, `.derive()`, `.guard()`, `.extend()` — работает идентично на `Composer`.

Отличие: `Composer` — не бот. У него нет токена, нет API-соединения. Это сегмент пайплайна, который вы компонуете в бот через `.extend()`.

```ts
import { Composer } from "gramio";

// Самодостаточный feature-модуль
const adminRouter = new Composer()
    .guard((ctx) => ctx.from?.id === ADMIN_ID)
    .command("ban",   (ctx) => ctx.send("Заблокирован!"))
    .command("stats", (ctx) => ctx.send("Статистика..."));

// Объединяется с ботом в этой точке цепочки
const bot = new Bot(token)
    .extend(adminRouter)
    .start();
```

---

## Разбивка на файлы

Самый распространённый случай: один файл на фичу.

```ts
// src/features/start.ts
import { Composer } from "gramio";

export const startRouter = new Composer()
    .command("start", (ctx) => ctx.send("Привет! 👋"))
    .command("help",  (ctx) => ctx.send("Команды: /start /help"));
```

```ts
// src/features/admin.ts
import { Composer } from "gramio";

const ADMIN_ID = Number(process.env.ADMIN_ID);

export const adminRouter = new Composer()
    .guard((ctx) => ctx.from?.id === ADMIN_ID, (ctx) => ctx.send("Только для администраторов."))
    .command("broadcast", (ctx) => ctx.send("Рассылка..."))
    .command("stats",     (ctx) => ctx.send("Статистика..."));
```

```ts
// src/bot.ts
import { Bot } from "gramio";
import { startRouter } from "./features/start";
import { adminRouter } from "./features/admin";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(startRouter)
    .extend(adminRouter)
    .start();
```

Чисто, читаемо, каждая фича изолирована.

---

## Общий контекст между модулями

Часто нескольким модулям нужны одни и те же данные — запись пользователя, конфиг, подключение к базе данных. Извлеките это в общий middleware:

```ts
// src/middleware/user.ts
import { Composer } from "gramio";

export const withUser = new Composer()
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id ?? 0),
    }))
    .as("scoped"); // записывает ctx.user в реальный ctx, не в локальную копию
```

Подключите его в feature-модуле для получения типа:

```ts
// src/features/profile.ts
import { Composer } from "gramio";
import { withUser } from "../middleware/user";

export const profileRouter = new Composer()
    .extend(withUser)  // ctx.user теперь типизирован
    .command("profile", (ctx) =>
        ctx.send(`Имя: ${ctx.user.name}`)
        //              ^? { name: string, ... }
    );
```

Затем в `bot.ts` подключите `withUser` **до** роутеров, чтобы derive сработал на реальном контексте:

```ts
import { Bot } from "gramio";
import { withUser } from "./middleware/user";
import { profileRouter } from "./features/profile";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser)      // ← первым: ctx.user попадает в реальный ctx
    .extend(profileRouter) // ← withUser внутри дедуплицируется (пропускается)
    .start();
```

::: info Зачем `.as("scoped")`?
По умолчанию `.extend()` изолирует внутренний контекст, чтобы его derive'ы не вытекали наружу. `.as("scoped")` отключает изоляцию — derive записывает напрямую в родительский контекст, поэтому последующий код может читать `ctx.user` откуда угодно в цепочке.

Смотрите [Middleware & Context → Система областей видимости](/ru/extend/middleware#production-architecture) для полной картины.
:::

---

## Типизация обработчиков в отдельных файлах

Когда вы выносите обработчик в отдельную функцию, TypeScript требует аннотацию типа. Используйте `ContextOf` из `@gramio/composer`:

```ts
// src/middleware/user.ts
import { Composer } from "gramio";
import type { ContextOf } from "@gramio/composer";

export const withUser = new Composer()
    .derive(() => ({
        user: { name: "Алиса", role: "admin" as "admin" | "user" },
    }))
    .as("scoped");

export type WithUser = ContextOf<typeof withUser>;
```

```ts
// src/handlers/profile.ts
import type { WithUser } from "../middleware/user";

export async function handleProfile(ctx: WithUser) {
    await ctx.send(`Привет, ${ctx.user.name}! Роль: ${ctx.user.role}`);
    //                        ^? string                ^? "admin" | "user"
}
```

```ts
// src/features/profile.ts
import { Composer } from "gramio";
import { withUser } from "../middleware/user";
import { handleProfile } from "../handlers/profile";

export const profileRouter = new Composer()
    .extend(withUser)
    .command("profile", handleProfile);
```

---

## Статические зависимости через decorate()

Для вещей, которые не меняются per-request — клиенты баз данных, конфиг, сервисные экземпляры — используйте `decorate()` вместо `derive()`. Значение присваивается один раз при запуске:

```ts
// src/middleware/deps.ts
import { Composer } from "gramio";
import { db } from "../db";
import { config } from "../config";

export const withDeps = new Composer()
    .decorate({ db, config })
    .as("scoped");
```

```ts
// src/features/admin.ts
import { Composer } from "gramio";
import { withDeps } from "../middleware/deps";

export const adminRouter = new Composer()
    .extend(withDeps)
    .command("stats", async (ctx) => {
        const count = await ctx.db.countUsers();
        //                   ^? ваш тип DB
        ctx.send(`Пользователей: ${count} (env: ${ctx.config.environment})`);
    });
```

---

## Рекомендуемая структура файлов

```
src/
  bot.ts                  ← собирает всё вместе
  middleware/
    user.ts               ← withUser (derive + as scoped)
    deps.ts               ← withDeps (decorate + as scoped)
  features/
    start.ts              ← /start, /help
    profile.ts            ← /profile, /settings
    admin.ts              ← /ban, /stats (с guard)
    shop.ts               ← /buy, /balance
  handlers/               ← вынесенные функции обработчиков (типизированные)
    profile.ts
    admin.ts
```

```ts
// src/bot.ts
import { Bot } from "gramio";
import { withDeps }      from "./middleware/deps";
import { withUser }      from "./middleware/user";
import { startRouter }   from "./features/start";
import { profileRouter } from "./features/profile";
import { adminRouter }   from "./features/admin";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withDeps)       // db, config — доступны везде
    .extend(withUser)       // ctx.user — доступен везде
    .extend(startRouter)
    .extend(profileRouter)
    .extend(adminRouter)
    .onError(({ kind, error }) => console.error(kind, error))
    .start();
```

---

## Composer vs Plugin

`Plugin` не предоставляет полный API `Composer` — например, `when()`, `branch()`, `inspect()` и `trace()` недоступны на `Plugin`. Для внутренней структуры бота всегда предпочитайте `Composer`.

Используйте `Plugin` только когда:
- Вы публикуете переиспользуемый пакет для `bot.extend()` у других
- Вам нужно встроиться в **цикл API-запросов** (`preRequest`, `onResponse`, `onResponseError`) — эти хуки доступны только в `Plugin`, не в `Composer`

```ts
import { Plugin } from "gramio";

// ✅ Plugin — для распространения или хуков жизненного цикла API
export const rateLimitPlugin = new Plugin("rate-limit")
    .preRequest((ctx) => {
        console.log("→", ctx.method);
        return ctx;
    });

// ✅ Composer — для всего остального внутри вашего бота
import { Composer } from "gramio";
const adminRouter = new Composer()
    .guard((ctx) => ctx.from?.id === ADMIN_ID)
    .command("ban", (ctx) => ctx.send("Заблокирован!"));
```

---

## Итог

| Задача | Решение |
|--------|---------|
| Разбить обработчики на файлы | `new Composer()` на фичу, `bot.extend(router)` |
| Общий `ctx.user` между модулями | `withUser.as("scoped")` + подключить первым в `bot.ts` |
| Добавить DB / конфиг в контекст | `decorate({ db, config }).as("scoped")` |
| Типизировать обработчик в отдельном файле | `ContextOf<typeof composer>` из `@gramio/composer` |
| Защитить целый модуль | `.guard(predicate)` в начале цепочки Composer |
| Внутренний модуль / роутер | `Composer` — полный API, предпочтителен для своего бота |
| Распространяемый пакет или хуки жизненного цикла API | `Plugin` — только здесь есть `preRequest` / `onResponse` |
