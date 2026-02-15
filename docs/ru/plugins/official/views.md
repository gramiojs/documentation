# Views

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![JSR](https://jsr.io/badges/@gramio/views)](https://jsr.io/@gramio/views)
[![JSR Score](https://jsr.io/badges/@gramio/views/score)](https://jsr.io/@gramio/views)

</div>

Система шаблонов для переиспользуемых вьюшек сообщений. Автоматически определяет, что делать — отправить новое сообщение или отредактировать текущее — в зависимости от типа контекста. Из коробки поддерживает программные адаптеры, JSON-вьюшки с интерполяцией, загрузку из файловой системы, i18n, все типы клавиатур и медиа с интерполяцией URL.

> [!WARNING]
> Пакет находится в активной разработке. API может измениться.

### Установка

::: code-group

```bash [npm]
npm install @gramio/views
```

```bash [yarn]
yarn add @gramio/views
```

```bash [pnpm]
pnpm add @gramio/views
```

```bash [bun]
bun install @gramio/views
```

:::

### Использование

```ts
import { Bot, InlineKeyboard } from "gramio";
import { initViewsBuilder } from "@gramio/views";

interface Data {
    user: {
        id: number;
        name: string;
        age: number;
    };
    t: (test: "a" | "b", age: number) => string;
}

const defineView = initViewsBuilder<Data>();

const userView = defineView().render(function (test: "a" | "b") {
    return this.response
        .text(this.t(test, this.user.age))
        .keyboard(new InlineKeyboard().text("test", test));
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .derive(["message", "callback_query"], async (context) => {
        const user = {
            id: context.from.id,
            name: context.from.firstName,
            age: 18,
        };

        const t = (test: "a" | "b", age: number) => test + age;

        return {
            render: defineView.buildRender(context, {
                user,
                t,
            }),
        };
    })
    .on("message", async (context) => {
        return context.render(userView, "a");
    })
    .on("callback_query", async (context) => {
        return context.render(userView, context.data === "a" ? "b" : "a");
    });

bot.start();
```

## Импорты

Библиотека использует модульные импорты, чтобы не тянуть лишние зависимости:

```ts
// Main entry — core functionality
import { initViewsBuilder } from "@gramio/views";

// Import adapters separately
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViews, loadJsonViewsDir } from "@gramio/views/fs";
import { defineAdapter } from "@gramio/views/define";
```

**Зачем отдельные импорты?**
- `@gramio/views/fs` тянет Node.js API для работы с файловой системой — не импортируйте его в браузерных/edge-окружениях
- Лучше tree-shaking и меньше бандл
- Чёткое разделение ответственности

## JSON-адаптер

Позволяет описывать вьюшки в JSON — удобно для CMS-ок или пользовательских шаблонов, которые можно редактировать без деплоя.

```ts
import { initViewsBuilder } from "@gramio/views";
import { createJsonAdapter } from "@gramio/views/json";

const adapter = createJsonAdapter({
    views: {
        welcome: { text: "Hello, {{name}}!" },
        goodbye: { text: "See you later!" },
    },
});

const defineView = initViewsBuilder<Data>().from(adapter);

// Then in a handler:
context.render("welcome", { name: "Alice" });
```

### `reply_markup`, клавиатуры и медиа

Поле `reply_markup` повторяет структуру [Telegram Bot API](https://core.telegram.org/bots/api#replykeyboardmarkup) один-в-один. Интерполяция `{{key}}` работает в тексте кнопок, `callback_data`, `url` и `input_field_placeholder`.

**Инлайн-клавиатура:**

```json
{
    "welcome": {
        "text": "Hello, {{name}}!",
        "reply_markup": {
            "inline_keyboard": [
                [
                    { "text": "Profile {{name}}", "callback_data": "profile_{{id}}" },
                    { "text": "Help", "callback_data": "help" }
                ],
                [
                    { "text": "Visit", "url": "https://example.com/{{id}}" }
                ]
            ]
        }
    }
}
```

**Reply-клавиатура:**

```json
{
    "menu": {
        "text": "Choose an option:",
        "reply_markup": {
            "keyboard": [
                [{ "text": "Help" }, { "text": "Settings" }],
                [{ "text": "Share Contact", "request_contact": true }]
            ],
            "resize_keyboard": true,
            "one_time_keyboard": true
        }
    }
}
```

**Удаление клавиатуры / Принудительный ответ:**

```json
{ "reply_markup": { "remove_keyboard": true } }
{ "reply_markup": { "force_reply": true, "input_field_placeholder": "Type {{what}}..." } }
```

**Медиа** (одиночное или группа):

```json
{
    "photo_view": {
        "text": "A caption",
        "media": { "type": "photo", "media": "{{photoUrl}}" }
    },
    "gallery": {
        "text": "My photos",
        "media": [
            { "type": "photo", "media": "{{photo1}}" },
            { "type": "photo", "media": "{{photo2}}" }
        ]
    }
}
```

Поддерживаемые типы медиа: `photo`, `video`, `animation`, `audio`, `document`.

### Доступ к глобалам через `{{$path}}`

Используйте `{{$path}}`, чтобы обращаться к глобалам (значениям, которые прокидываются в `buildRender`) прямо из JSON-шаблонов:

```json
{
    "welcome": { "text": "Welcome to {{$appName}}!" },
    "profile": { "text": "{{$user.name}} (age {{$user.age}})" }
}
```

```ts
// globals passed in .derive():
{ appName: "MyBot", user: { name: "Alice", age: 25 } }
```

`$`-глобалы спокойно миксуются с обычными `{{params}}`: `"{{$botName}} says hi to {{name}}"`.

### Кастомный `resolve`-колбэк

Для i18n или любой кастомной логики интерполяции можно передать функцию `resolve` в `createJsonAdapter`. Она вызывается для каждого `{{key}}` (кроме `$`-префиксных) перед фолбэком на params:

```ts
const adapter = createJsonAdapter<{ t: (key: string) => string }, ViewMap>({
    views: {
        greet: { text: "{{t:hello}}, {{name}}!" },
    },
    resolve: (key, globals) => {
        if (key.startsWith("t:")) return globals.t(key.slice(2));
    },
});
```

Если `resolve` вернёт `undefined`, ключ пробрасывается в params. Неразрезолвленные ключи остаются как `{{key}}`.

Все три источника работают везде — в тексте, кнопках клавиатуры, URL медиа, плейсхолдерах:

```json
{ "text": "{{$brand}}: {{t:title}} — {{subtitle}}" }
```

### i18n через фабрику адаптеров

Для полноценного i18n пишите JSON-шаблоны целиком на каждом языке и передавайте **фабричную функцию** в `from()`. Фабрика получает глобалы и возвращает нужный адаптер по локали:

```
views/
  en/
    welcome.json    → { "text": "Hello, {{name}}!" }
  ru/
    welcome.json    → { "text": "Привет, {{name}}!" }
```

```ts
import { initViewsBuilder } from "@gramio/views";
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViewsDir } from "@gramio/views/fs";

const adapters = {
    en: createJsonAdapter({ views: await loadJsonViewsDir("./views/en") }),
    ru: createJsonAdapter({ views: await loadJsonViewsDir("./views/ru") }),
};

const defineView = initViewsBuilder<Data>().from(
    (globals) => adapters[globals.locale]
);

// In .derive(), locale comes from the user context:
bot.derive(["message", "callback_query"], (context) => ({
    render: defineView.buildRender(context, {
        locale: context.from.languageCode ?? "en",
    }),
}));

// render stays the same — adapter is selected automatically:
context.render("welcome", { name: "Alice" });
// → "Привет, Alice!" for Russian users
```

## Загрузка JSON-вьюшек из файловой системы

### Один файл

Один JSON-файл с несколькими вьюшками:

```json
// views.json
{
    "welcome": { "text": "Hello, {{name}}!" },
    "goodbye": { "text": "Bye!" }
}
```

```ts
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViews } from "@gramio/views/fs";

const views = await loadJsonViews("./views.json");
const adapter = createJsonAdapter({ views });
```

### Директория

Каждый `.json`-файл содержит несколько именованных вьюшек:

```
views/
  messages.json         → "messages.welcome", "messages.goodbye", "messages.help"
  goods/
    products.json       → "goods.products.list", "goods.products.detail"
```

```json
// messages.json
{
    "welcome": { "text": "Hello, {{name}}!" },
    "goodbye": { "text": "Bye, {{name}}!" },
    "help": { "text": "Need help?" }
}
```

```json
// goods/products.json
{
    "list": { "text": "Product list" },
    "detail": {
        "text": "Product {{name}}",
        "media": { "type": "photo", "media": "{{photo}}" }
    }
}
```

**Как это работает:**

Каждый `.json`-файл должен содержать объект, где:
- **Ключи** — имена вьюшек
- **Значения** — определения вьюшек (`{ text?, reply_markup?, media? }`)

Итоговый ключ вьюшки формируется из пути файла (через точку) + имя вьюшки:

```
views/
  main.json             ← { "home": {...}, "about": {...} }
  user/
    profile.json        ← { "view": {...}, "edit": {...} }
```

```ts
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViewsDir } from "@gramio/views/fs";

const views = await loadJsonViewsDir("./views");
const adapter = createJsonAdapter({ views });

// Available keys:
// - "main.home"
// - "main.about"
// - "user.profile.view"
// - "user.profile.edit"
```
