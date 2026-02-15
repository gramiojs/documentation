# Views

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![JSR](https://jsr.io/badges/@gramio/views)](https://jsr.io/@gramio/views)
[![JSR Score](https://jsr.io/badges/@gramio/views/score)](https://jsr.io/@gramio/views)

</div>

Система шаблонов для переиспользуемых вьюшек сообщений. Сама определяет — отправить новое сообщение или отредактировать текущее, в зависимости от типа контекста. Поддерживает программные адаптеры, JSON-вьюшки с интерполяцией, загрузку из файловой системы, i18n, все типы клавиатур и медиа с интерполяцией URL.

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

Определяем программный адаптер через `defineAdapter` и подключаем к боту через `initViewsBuilder`:

```typescript
import { Bot } from "gramio";
import { initViewsBuilder } from "@gramio/views";
import { defineAdapter } from "@gramio/views/define";

// Описываем вьюшки как методы адаптера
const adapter = defineAdapter({
    welcome(name: string) {
        return this.response
            .text(`Привет, ${name}!`)
            .keyboard([[{ text: "Начать", callback_data: "start" }]]);
    },
});

const defineView = initViewsBuilder().from(adapter);

const bot = new Bot(process.env.BOT_TOKEN!)
    .derive(["message", "callback_query"], (context) => ({
        render: defineView.buildRender(context, {}),
    }))
    .command("start", (context) => context.render("welcome", "Alice"));

await bot.start();
```

## Методы

### JSON-адаптер

`createJsonAdapter` позволяет описывать вьюшки в JSON с интерполяцией `{{key}}`:

```typescript
import { createJsonAdapter } from "@gramio/views/json";

const adapter = createJsonAdapter({
    views: {
        welcome: {
            text: "Привет, {{name}}!",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Профиль {{name}}", callback_data: "profile_{{id}}" }],
                ],
            },
        },
    },
});
```

### Загрузка из файловой системы

`loadJsonViewsDir` загружает JSON-файлы с вьюшками из директории. Имя файла становится префиксом для имён вьюшек:

```typescript
import { loadJsonViewsDir } from "@gramio/views/fs";

// views/messages.json → "messages.welcome", "messages.goodbye"
const views = await loadJsonViewsDir("./views");
```

### Поддержка i18n

Выбираем адаптер по локали через фабрику:

```typescript
const defineView = initViewsBuilder<{ locale: string }>()
    .from((globals) => adapters[globals.locale]);
```

Или используем кастомную функцию `resolve` для ключей перевода:

```typescript
const adapter = createJsonAdapter({
    views: { greet: { text: "{{t:hello}}, {{name}}!" } },
    resolve: (key, globals) => {
        if (key.startsWith("t:")) return globals.t(key.slice(2));
    },
});
```

### Доступ к глобалам

В JSON-шаблонах можно обращаться к глобальным значениям через синтаксис `{{$path}}`. Глобалы передаются вторым аргументом в `buildRender` и доступны из любого места вьюшки.
