---
title: "@gramio/composer — Типобезопасная композиция middleware"
head:
    - - meta
      - name: "description"
        content: "Подробный разбор @gramio/composer: движка композиции middleware, лежащего в основе GramIO. decorate(), when(), inspect(), trace() и создание собственных методов фреймворка."
    - - meta
      - name: "keywords"
        content: "gramio, composer, middleware, decorate, when, inspect, trace, наблюдаемость, разработка плагинов, TypeScript"
---

# @gramio/composer

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/composer?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/composer)
[![JSR](https://jsr.io/badges/@gramio/composer)](https://jsr.io/@gramio/composer)

</div>

`@gramio/composer` — универсальная типобезопасная библиотека композиции middleware, на которой строятся внутренности GramIO. Если вы пишете плагин, строите фреймворк поверх GramIO или просто хотите понять, как работает обогащение контекста — добро пожаловать.

## Установка

::: code-group

```bash [npm]
npm install @gramio/composer
```

```bash [yarn]
yarn add @gramio/composer
```

```bash [pnpm]
pnpm add @gramio/composer
```

```bash [bun]
bun add @gramio/composer
```

:::

## Основные концепции

`Composer` — цепочечный пайплайн middleware. Каждый метод регистрирует новый шаг и возвращает обновлённый композер для цепочки:

```ts
import { Composer } from "@gramio/composer";

const app = new Composer<{ request: Request }>()
    .use(logger)
    .derive(fetchUser)
    .guard(isAuthenticated)
    .use(handler);
```

### use()

Регистрирует middleware напрямую. Обработчик получает `(context, next)` и должен вызвать `next()` для продолжения цепочки:

```ts
app.use(async (ctx, next) => {
    console.log("до");
    await next();
    console.log("после");
});
```

### derive()

Обогащает контекст вычисленными значениями. Возвращённый объект мержится в контекст для всех последующих middleware:

```ts
app.derive(async (ctx) => {
    const user = await db.findUser(ctx.userId);
    return { user };
});
// ctx.user теперь доступен ниже по цепочке
```

### decorate()

Как `derive()`, но для статических значений без вычислений на каждый запрос. Присваивает объект один раз при регистрации и переиспользует ту же ссылку — нулевые накладные расходы:

```ts
app.decorate({ db: myDatabase, config: appConfig });
// ctx.db и ctx.config доступны на каждый запрос без оверхеда
```

Поддерживает `{ as: "scoped" }` или `{ as: "global" }` для распространения через `extend()`.

### guard()

Продолжает цепочку только если предикат возвращает true:

```ts
app.guard((ctx) => ctx.user.isAdmin);
// Последующие middleware работают только для администраторов
```

### when()

Условная регистрация middleware на этапе запуска. Условие вычисляется один раз при старте приложения, не на каждый запрос. Свойства из блока типизируются как `Partial` (опциональные):

```ts
const app = new Composer()
    .when(process.env.NODE_ENV !== "production", (c) =>
        c.use(verboseLogger)
    )
    .when(config.features.analytics, (c) =>
        c.derive(() => ({ analytics: createAnalyticsClient() }))
    );
```

Отличие от `branch()`:
- `when()` — условие вычисляется **один раз при старте** (build-time)
- `branch()` — условие вычисляется **на каждый запрос** (runtime)

Вложенные `when()` работают. Ключи дедупликации, обработчики и определения ошибок пробрасываются из условного блока.

## Наблюдаемость

### inspect()

Возвращает snapshot всех зарегистрированных middleware с метаданными:

```ts
const app = new Composer()
    .derive(function getUser() { return { user: "alice" }; })
    .guard(function isAdmin() { return true; })
    .use(async function handleRequest(_, next) { return next(); });

app.inspect();
// [
//   { index: 0, type: "derive", name: "getUser", scope: "local" },
//   { index: 1, type: "guard", name: "isAdmin", scope: "local" },
//   { index: 2, type: "use", name: "handleRequest", scope: "local" },
// ]
```

При расширении именованного плагина поле `plugin` показывает источник:

```ts
const auth = new Composer({ name: "auth" })
    .derive(function getUser() { return { user: "alice" }; })
    .as("scoped");

new Composer().extend(auth).inspect();
// [{ index: 0, type: "derive", name: "getUser", scope: "local", plugin: "auth" }]
```

### trace()

Opt-in-инструментация каждого middleware. Нулевые накладные расходы без трассировки:

```ts
app.trace((entry, ctx) => {
    const span = tracer.startSpan(`${entry.type}:${entry.name ?? "anonymous"}`);
    span.setAttributes({
        "middleware.index": entry.index,
        "middleware.scope": entry.scope,
        ...(entry.plugin && { "middleware.plugin": entry.plugin }),
    });
    return (error) => {
        if (error) span.recordException(error as Error);
        span.end();
    };
});
```

Жизненный цикл `TraceHandler`:
1. Вызывается перед каждым middleware с `MiddlewareInfo` и контекстом
2. Может возвращать функцию очистки `(error?: unknown) => void`
3. Очистка вызывается после завершения middleware (без аргументов при успехе, с ошибкой при сбое)
4. Ошибки продолжают проброс в `onError` после очистки

## Система скоупов

Скоупы контролируют как middleware распространяется при расширении одного композера другим:

| Скоуп | Поведение |
|-------|---------|
| `"local"` (по умолчанию) | Изолирован в обёртке — контекст не утекает в родителя |
| `"scoped"` | Добавляется в родителя как локальная запись — видно последующим middleware родителя |
| `"global"` | Добавляется в родителя как глобальный — продолжает распространяться через дальнейшие `extend()` |

Переведите весь композер в нужный скоуп через `.as()`:

```ts
const plugin = new Composer({ name: "auth" })
    .derive(function getUser() { return { user: "alice" }; })
    .as("scoped"); // весь плагин становится scoped

app.extend(plugin); // getUser виден в downstream-middleware app
```

## Обработка ошибок

```ts
class NotFoundError extends Error {}

const app = new Composer()
    .error("NotFound", NotFoundError)
    .onError(({ error, kind, context }) => {
        if (kind === "NotFound") {
            context.send("Ресурс не найден");
            return "handled";
        }
    })
    .use(() => { throw new NotFoundError("Элемент не найден"); });
```

Несколько обработчиков `onError()` проверяются по очереди — первый вернувший не-undefined побеждает. Необработанные ошибки логируются через `console.error`.

## Разработка плагинов

Для авторов плагинов `@gramio/composer` — фундамент класса `Plugin` в GramIO. Концепции напрямую соответствуют:

```ts
import { Plugin } from "gramio";

// Plugin использует тот же API Composer внутри
const myPlugin = new Plugin("my-plugin")
    .decorate({ db: myDatabase })        // статическое обогащение
    .derive(async () => ({ user: ... })) // обогащение на каждый запрос
    .on("message", handler);            // обработчик событий
```

## createComposer() — Создание собственных фреймворков

Если вы строите фреймворк поверх `@gramio/composer` и вам нужны собственные методы-хелперы (как `hears()`, `command()`, `reaction()` в GramIO), используйте `createComposer()`:

```ts
import { createComposer, eventTypes } from "@gramio/composer";

const { Composer } = createComposer({
    discriminator: (ctx: BaseCtx) => ctx.updateType,
    types: eventTypes<{ message: MessageCtx; callback_query: CallbackCtx }>(),
    methods: {
        hears(trigger: RegExp | string, handler: (ctx: MessageCtx) => unknown) {
            return this.on("message", (ctx, next) => {
                const text = ctx.text;
                if (typeof trigger === "string" ? text === trigger : trigger.test(text ?? ""))
                    return handler(ctx);
                return next();
            });
        },
    },
});

// Кастомные методы сохраняются через все цепочки:
const app = new Composer()
    .hears(/hello/, h1)  // кастомный метод
    .on("message", h2)   // встроенный — TMethods всё ещё сохранён
    .hears(/bye/, h3);   // кастомный метод по-прежнему доступен
```

**`types` + `eventTypes()`**: TypeScript не умеет частично выводить типовые аргументы. Фантомное поле `types` с хелпером `eventTypes()` позволяет задать `TEventMap` без потери вывода `TMethods`:

```ts
// Вместо явных типовых параметров (не выведет TMethods):
createComposer<BaseCtx, { message: MessageCtx }>({ ... })

// Используйте паттерн phantom types:
createComposer({
    discriminator: (ctx: BaseCtx) => ctx.updateType,
    types: eventTypes<{ message: MessageCtx }>(), // выводится, не задаётся явно
    methods: { /* TMethods выводится отсюда */ },
})
```

Рантаймовая проверка конфликтов бросает ошибку, если ключ `methods` совпадает со встроенным именем метода.
