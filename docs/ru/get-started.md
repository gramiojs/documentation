---
title: Начало работы с GramIO - Создание Telegram ботов на TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: Создайте своего первого Telegram бота менее чем за минуту. Одна команда разворачивает полный TypeScript-проект — ORM, линтинг, плагины, Docker. Работает на Node.js, Bun и Deno.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, быстрый старт, токен бота, BotFather, скаффолдинг, create gramio, команды бота, инлайн клавиатуры, форматирование сообщений, сессии, плагины, сцены, i18n, мидлвар, derive, типобезопасный бот
---

# Начало работы

Создайте своего первого Telegram бота **менее чем за минуту** — типобезопасно, на любом рантайме, с богатой экосистемой плагинов.

## 1. Получите токен бота

Откройте [@BotFather](https://t.me/BotFather) в Telegram, отправьте `/newbot` и следуйте инструкциям. Вы получите токен вида:

```
110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
```

## 2. Создайте проект

Одна команда настраивает всё — TypeScript, линтинг, ORM, плагины, Docker — на ваш выбор.

::: pm-create gramio@latest ./bot
:::

::: details Что можно выбрать в генераторе?
- **ORM** — [Prisma](https://www.prisma.io/), [Drizzle](https://orm.drizzle.team/)
- **Линтеры** — [Biome](https://biomejs.dev/), [ESLint](https://eslint.org/) (с автонастройкой нужных плагинов)
- **Официальные плагины** — [Scenes](/ru/plugins/official/scenes), [Session](/ru/plugins/official/session), [I18n](/ru/plugins/official/i18n), [Autoload](/ru/plugins/official/autoload), [Prompt](/ru/plugins/official/prompt), [Auto-retry](/ru/plugins/official/auto-retry), [Media-cache](/ru/plugins/official/media-cache), [Media-group](/ru/plugins/official/media-group)
- **Другое** — Dockerfile + docker-compose, [Husky](https://typicode.github.io/husky/) git-хуки, [Jobify](https://github.com/kravetsone/jobify) (обёртка для BullMQ), [хранилища GramIO](/ru/storages)
:::

## 3. Запустите разработку

<PackageManagers type="run" pkg="dev" prefix="cd bot &&" />

Бот работает и перезапускается при изменениях. **Готово.** Теперь посмотрим, что можно с этим сделать.

---

## Как выглядит GramIO

### Обработка команд

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Привет! 👋"))
    .command("help", (ctx) => ctx.send("Вот что я умею..."))
    .onStart(({ info }) => console.log(`Запущен как @${info.username}`));

bot.start();
```

### Форматирование сообщений

Никакого `parse_mode` — GramIO использует тегированные шаблонные строки, которые автоматически создают корректные объекты `MessageEntity`:

```ts twoslash
import { Bot, format, bold, italic, link, code } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) =>
        ctx.send(
            format`${bold`Добро пожаловать!`}
            Загляните на ${link("GramIO", "https://gramio.dev")} — ${italic("типобезопасно до последней строчки")}.`
        )
    );

bot.start();
```

### Создание клавиатур

Удобный цепочный API для инлайн и reply-клавиатур:

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("menu", (ctx) =>
        ctx.send("Что вы хотите сделать?", {
            reply_markup: new InlineKeyboard()
                .text("О проекте", "about")
                .url("GitHub", "https://github.com/gramiojs/gramio")
                .row()
                .text("Настройки ⚙️", "settings"),
        })
    );

bot.start();
```

### Типобезопасное расширение контекста через `derive`

Добавляйте свои данные в каждый обработчик — без приведения типов, полная типизация:

```ts twoslash
// @filename: db.ts
export const db = { getUser: async (id: number) => ({ name: "Alice", id }) };

// @filename: index.ts
// ---cut---
import { Bot } from "gramio";
import { db } from "./db";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive("message", async (ctx) => ({
        user: await db.getUser(ctx.from!.id),
    }))
    .on("message", (ctx) => {
        ctx.user;
        //   ^?
        //
        //
        //
        //
        return ctx.send(`Привет, ${ctx.user.name}!`);
    });

bot.start();
```

### Конвейер мидлваров — Composer

`Bot` расширяет [Composer](/ru/extend/composer) — цепочный типобезопасный конвейер обработки обновлений. Каждый метод обогащает контекст и возвращает обновлённый тип, поэтому вся цепочка всегда полностью типизирована.

`Composer` также существует как **отдельный класс** — его можно импортировать и использовать независимо от `Bot`. Это важно, когда проект начинает расти:

| Метод | Что делает |
|-------|-----------|
| `use(ctx, next)` | Сырой мидлвар — вызовите `next()` чтобы продолжить |
| `derive(fn)` | Асинхронное обогащение контекста на каждый запрос |
| `decorate(obj)` | Статическое обогащение при запуске — без накладных расходов |
| `guard(fn)` | Продолжить только если предикат вернул `true` |
| `on(event, fn)` | Обработать конкретный тип обновления |
| `extend(composer)` | Встроить другой композер — унаследовав его полные типы |

#### Продакшн-паттерн: общий плагинный композер

В реальном проекте регистрируйте все плагины **один раз** в общем `Composer`, а затем расширяйте его в каждом файле с фичами. Каждый обработчик становится чистым `Composer` — без `Bot`, без токена, легко тестируется:

```ts
// src/plugins/index.ts
import { Composer } from "gramio";
import { scenes } from "@gramio/scenes";
import { session } from "@gramio/session";
import { greetingScene } from "../scenes/greeting.ts";

export const composer = new Composer()
    .extend(scenes([greetingScene]))
    .extend(session());
```

```ts
// src/features/start.ts
import { Composer } from "gramio";
import { composer } from "../plugins/index.ts";

export const startFeature = new Composer()
    .extend(composer) // ← наследует все типы плагинов
    .command("start", (ctx) => {
        ctx.scene; // ✅ полная типизация — без Bot, без токена
        return ctx.scene.enter(greetingScene);
    });
```

```ts
// src/index.ts
import { Bot } from "gramio";
import { composer } from "./plugins/index.ts";
import { startFeature } from "./features/start.ts";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(composer)      // плагины
    .extend(startFeature); // обработчики фич

bot.start();
```

::: tip Почему это работает
`Composer` передаёт свои типы через каждый `.extend()`. Когда `startFeature` расширяет `composer`, TypeScript видит все свойства, добавленные плагинами — `ctx.scene`, `ctx.session` и т.д. — без приведения типов и ручных аннотаций.
:::

### Расширение плагинами через `.extend()`

Плагины подключаются через `.extend()`. Они могут добавлять новые свойства в контекст, регистрировать обработчики и встраиваться в жизненный цикл — всё с полной типизацией.

Пример подключения [Scenes](/ru/plugins/official/scenes) для многошаговых диалогов:

::: pm-add @gramio/scenes
:::

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

const registrationScene = new Scene("registration")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Как вас зовут?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => {
        ctx.scene.state;
        //          ^?
        //
        //
        //
        //
        return ctx.send(`Приятно познакомиться, ${ctx.scene.state.name}!`);
    });

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(scenes([registrationScene]))
    .command("start", (ctx) => ctx.scene.enter(registrationScene));

bot.start();
```

Каждый `.step()` срабатывает на следующее подходящее обновление от того же пользователя. Состояние сохраняется между шагами и полностью типизировано.

---

## Официальные плагины

Расширяйте бота первоклассными плагинами, которые работают бесшовно:

| Плагин | Что делает |
|--------|-----------|
| [Session](/ru/plugins/official/session) | Состояние пользователя между сообщениями |
| [Scenes](/ru/plugins/official/scenes) | Многошаговые диалоги и визарды |
| [I18n](/ru/plugins/official/i18n) | Интернационализация на базе Fluent |
| [Autoload](/ru/plugins/official/autoload) | Автоимпорт обработчиков из файловой системы |
| [Auto-retry](/ru/plugins/official/auto-retry) | Автоматический повтор при rate-limit ошибках |
| [Media-cache](/ru/plugins/official/media-cache) | Кэширование file_id загруженных файлов |
| [Media-group](/ru/plugins/official/media-group) | Обработка альбомов как одного события |
| [Views](/ru/plugins/official/views) | JSX-рендеринг сообщений |
| [Prompt](/ru/plugins/official/prompt) | Ожидание следующего сообщения пользователя |
| [OpenTelemetry](/ru/plugins/official/opentelemetry) | Трассировка и метрики |
| [Sentry](/ru/plugins/official/sentry) | Отслеживание ошибок и мониторинг |

[Смотреть все плагины →](/ru/plugins/overview)

---

## Ручная установка

Предпочитаете настроить всё самостоятельно?

::: pm-add gramio
:::

Создайте `src/index.ts`:

::: code-group

```ts twoslash [Node.js / Bun]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Привет! 👋"))
    .onStart(console.log);

bot.start();
```

```ts [Deno]
import { Bot } from "jsr:@gramio/core";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Привет! 👋"))
    .onStart(console.log);

bot.start();
```

:::

Запустите:

::: code-group

```bash [tsx]
npx tsx ./src/index.ts
```

```bash [bun]
bun ./src/index.ts
```

```bash [deno]
deno run --allow-net --allow-env ./src/index.ts
```

:::
