---
title: Onboarding plugin
head:
    - - meta
      - name: "description"
        content: "@gramio/onboarding — декларативные туториалы для пользователей в GramIO. Многопоточные флоу, scope-aware рендер, лесенка отказов, персистентное хранилище, опциональная интеграция с @gramio/views."
    - - meta
      - name: "keywords"
        content: "gramio, telegram bot, onboarding, туториал, walkthrough, плагин, замена сцен, обучение пользователей, multi-flow"
---

# Onboarding

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/onboarding?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/onboarding)
[![JSR](https://jsr.io/badges/@gramio/onboarding)](https://jsr.io/@gramio/onboarding)

</div>

::: warning Статус: alpha
`@gramio/onboarding` опубликован как `0.1.0` — публичный API уже стабильный, но поверхность ещё дозревает. Issue несём в [gramiojs/onboarding](https://github.com/gramiojs/onboarding/issues).
:::

Декларативные туториалы для пользователей GramIO-ботов. Проводит юзера по фичам шаг за шагом — переключаемся по кнопке "Далее", по факту того, что пользователь выполнил действие шага (`advanceOn`), или программно из обычного хэндлера (`ctx.onboarding.<flow>.next({ from })`).

Флоу собираются независимо друг от друга (`welcome`, `premium-upsell`, `new-feature`, …) с тремя режимами параллельности (`queue`, `preempt`, `parallel`) и четырёхступенчатой лесенкой отказов (`next → skip → exit → dismiss → disableAll`).

## Установка

::: pm-add @gramio/onboarding
:::

## Быстрый старт

```ts twoslash
import { Bot } from "gramio";
import { createOnboarding } from "@gramio/onboarding";

const welcome = createOnboarding({ id: "welcome" })
    .step("hi", { text: "Привет! Сейчас покажу что к чему.", buttons: ["next", "exit"] })
    .step("links", {
        text: "Пришли мне любую ссылку — я её скачаю.",
        buttons: ["next", "dismiss"],
        // Авто-переход, когда юзер реально это сделал
        advanceOn: (ctx) => ctx.is("message") && /https?:\/\//.test(ctx.text ?? ""),
    })
    .step("done", { text: "Готово!" })
    .onComplete((ctx) => ctx.send("Добро пожаловать! /help всегда под рукой."))
    .build();

const bot = new Bot(process.env.BOT_TOKEN!).extend(welcome);

bot.command("start", (ctx) => {
    ctx.onboarding.welcome.start();
    return ctx.send("Поехали!");
});

bot.start();
```

## Как сменяется шаг

Шаг заканчивается одним из четырёх способов:

| Триггер | Что нужно настроить |
|---|---|
| **Кнопка "Далее"** | `buttons: ["next"]` в конфиге шага |
| **Предикат `advanceOn`** | `advanceOn: (ctx) => boolean \| Promise<boolean>` — фаерится на обычном `message`, пока флоу активен |
| **Программный `next()`** | `ctx.onboarding.<flow>.next({ from: "<currentStepId>" })` из любого хэндлера. `from` делает вызов идемпотентным относительно гонки с кликом по кнопке. |
| **`goto(id)` / `skip()`** | Прыгнуть на конкретный шаг или скипнуть текущий |

Рекомендуемый паттерн `advanceOn` + реальный бизнес-хэндлер: вызывать `next({ from })` **без `await`** в конце хэндлера — пузырь онбординга прилетает после ответа юзера, вызов в стиле «выстрелил и забыл», предикат и хэндлер не разъезжаются:

```ts
bot.on("message", async (ctx) => {
    if (!/https?:\/\//.test(ctx.text ?? "")) return;
    await ctx.send(`Скачиваю ${ctx.text}…`);
    ctx.onboarding.welcome.next({ from: "links" }); // выстрелил и забыл
});
```

## Лесенка отказов

| Кнопка | Что делает |
|---|---|
| `skip` | Уровень шага — переходит к следующему, отмечает текущий как пропущенный |
| `exit` | Уровень флоу — выходит из этого флоу. Всегда доступна как универсальный аварийный люк. |
| `dismiss` | Персистентно — выходит из этого флоу **и** помечает его как отклонённый; следующие `start()` вернут `"dismissed"` |
| (без кнопки) — `ctx.onboarding.disableAll()` | Уровень юзера — отписывает пользователя ото всех флоу, пока не вызвали `enableAll()` |
| (без кнопки) — `ctx.onboarding.exitAll()` | Ядерный — выходит изо всех активных флоу |

Какие кнопки рендерить, можно ограничивать по scope (DM vs группа):

```ts
.step("hi", {
    text: "Привет!",
    buttons: ["next", "exit", "dismiss"],
    controls: {
        dm:    { dismiss: true,  exit: true },
        group: { dismiss: false, exit: true },  // в группах никаких dismiss
    },
})
```

## Параллельные флоу

Если два флоу хотят стартануть одновременно, поведение задаёт `concurrency` каждого:

```ts
const welcome = createOnboarding({ id: "welcome", concurrency: "queue" }).step(/* ... */).build();
const premium = createOnboarding({ id: "premium", concurrency: "preempt" }).step(/* ... */).build();
```

| Режим | Поведение |
|---|---|
| `"queue"` (по умолчанию) | `start()` вернёт `"queued"`, если другой флоу активен; следующий стартанёт автоматически на терминальном шаге первого |
| `"preempt"` | Активные флоу паузятся в LIFO-стек (вернётся `"preempted"`), резюмятся, когда этот флоу закончится |
| `"parallel"` | Без координации — несколько флоу рендерятся одновременно |

Состояние координации живёт в записи `global:<scopeKey>` на пользователя — переживает рестарты процесса.

## Учёт scope

Некоторые шаги имеют смысл только в DM, другие только в группах. `renderIn` откладывает шаг до подходящего чата:

```ts
.step("invite-friends", {
    text: "Пригласи друга!",
    renderIn: "dm",                         // строковый пресет
})
.step("group-only", {
    text: "Рендерится только в группах",
    renderIn: "group",
})
.step("custom", {
    text: "Рендерится только в супергруппах с топиком",
    renderIn: (ctx) => ctx.is("message") && ctx.chat?.type === "supergroup" && !!ctx.chat.isForum,
})
```

Если текущий scope не подходит, `renderStep` возвращает `{ pending: true }` и перерендеривается на следующем подходящем апдейте. Завершение флоу ждёт, пока отложенный re-render реально пройдёт — терминальный шаг с deferred-рендером не проставит complete заранее.

## Интеграция с `@gramio/views`

Связка с [`@gramio/views`](/ru/plugins/official/views) даёт view, который пересобирается со свежими токенами на каждом шаге. Плагин экспортит хелпер `withOnboardingGlobals()`, возвращающий thunk для ленивых globals из `@gramio/views` 0.2:

```ts
import { initViewsBuilder } from "@gramio/views";
import { withOnboardingGlobals, type OnboardingViewCtx } from "@gramio/onboarding";

interface Globals {
    user: { id: number; name: string };
    onboarding: OnboardingViewCtx | undefined;
}

const defineView = initViewsBuilder<Globals>();

bot.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(
        ctx,
        withOnboardingGlobals({
            user: { id: ctx.from!.id, name: ctx.from!.firstName },
        }),
    ),
}));
```

В `view` шага `globals.onboarding` — это либо живой бандл токенов для текущего шага, либо `undefined` (вне рендера, инициированного онбордингом). В токены входят `flowId`, `stepId`, `data` и callback-строки `next` / `skip` / `exit` / `dismiss` / `exitAll` / `goto(id)` для использования в `callback_data` кнопок.

## Хранилище

Onboarding персистит записи на пользователя через любой адаптер [`@gramio/storage`](/ru/storages). Прокидываем инстанс — либо полагаемся на in-memory дефолт для разработки:

```ts
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const welcome = createOnboarding({
    id: "welcome",
    storage: redisStorage(new Redis()),
}).step(/* ... */).build();
```

Авторы адаптеров могут проверить адаптер против полного контракта через хелпер `getStorageContractCases(make)`, не привязанный к тест-раннеру:

```ts
import { getStorageContractCases } from "@gramio/onboarding";
import { test } from "vitest"; // или bun:test, jest, любое

for (const { name, run } of getStorageContractCases(() => myStorage())) {
    test(`storage contract: ${name}`, () => run());
}
```

Контракт фиксирует семантику: `get` отсутствующего ключа — `undefined`, round-trip сохраняет структуру, `set` перезаписывает, `has` отражает наличие, `delete` чистит, вложенные данные переживают сериализацию, ключи флоу и глобальные ключи живут под одним scope.

## API

### `createOnboarding(opts)`

```ts
interface CreateOnboardingOpts {
    id: string;                          // уникальный ключ в ctx.onboarding
    storage?: Storage<OnboardingStorageMap>;
    concurrency?: "queue" | "preempt" | "parallel";   // дефолт "queue"
    timeoutMs?: number;
    resumeOnStart?: boolean;             // дефолт true
    scope?: "user" | ((ctx) => string); // резолвер ключа scope
    controls?: ControlsConfig;          // видимость кнопок по scope (dm/group)
    errors?: "forward-to-bot" | "throw"; // дефолт "forward-to-bot"
}
```

Возвращает чейн `OnboardingBuilder`:

| Метод | Описание |
|---|---|
| `.step(id, config)` | Добавить шаг. Кидает на дубликате id. |
| `.onComplete(handler)` | Фаерится после рендера терминального шага |
| `.onExit(handler)` | Фаерится при выходе пользователя/таймауте/preempt/exitAll |
| `.onDismiss(handler)` | Фаерится, когда пользователь делает dismiss |
| `.onStepChange(handler)` | Фаерится на каждой смене шага |
| `.onMissingStep(handler)` | Восстановление от устаревшего `stepId` (например, после переименования шага) |
| `.build()` | Возвращает GramIO-`Plugin` для передачи в `bot.extend(...)` |

### `ctx.onboarding.<flowId>` — `FlowControl`

```ts
interface FlowControl<Steps extends string> {
    readonly status: "null" | "active" | "exited" | "completed" | "dismissed" | "paused";
    readonly isActive: boolean;
    readonly isDismissed: boolean;
    readonly currentStep: Steps | null;
    readonly data: Record<string, unknown>;

    start(opts?: { from?: Steps; force?: boolean }): Promise<StartResult>;
    next(opts?: { from?: Steps }): Promise<NextResult>;
    goto(id: Steps): Promise<void>;
    skip(): Promise<void>;
    exit(): Promise<void>;
    dismiss(): Promise<void>;
}
```

`StartResult` — один из `"started"`, `"resumed"`, `"already-active"`, `"already-completed"`, `"dismissed"`, `"opted-out"`, `"queued"`, `"preempted"`. `NextResult` — один из `"advanced"`, `"completed"`, `"inactive"`, `"step-mismatch"`.

### `ctx.onboarding.disableAll()` / `enableAll()` / `exitAll()`

Кросс-флоу контролы. `disableAll()` персистит юзер-уровневый opt-out; `exitAll()` выходит изо всех активных флоу, но не персистит. `allDisabled` — геттер на персистентное состояние.

## Когда брать это, а когда сцены

| Задача | Использовать |
|---|---|
| Одноразовый туториал / знакомство с фичей | **`@gramio/onboarding`** |
| Многошаговая форма со сбором данных и валидацией | [`@gramio/scenes`](/ru/plugins/official/scenes) |
| Визард с ветвлением по вводу | [`@gramio/scenes`](/ru/plugins/official/scenes) |
| Несколько параллельных воркфлоу-знакомств с фичами | **`@gramio/onboarding`** (multi-flow) |
| Пауза/возобновление через дни, персистенс | Любое — оба персистят |

Флоу онбординга задуманы **декорировать** работающего без них бота; сцены же владеют всем взаимодействием, пока юзер внутри.
