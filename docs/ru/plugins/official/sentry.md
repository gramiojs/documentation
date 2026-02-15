# Sentry

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/sentry?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/sentry)
[![JSR](https://jsr.io/badges/@gramio/sentry)](https://jsr.io/@gramio/sentry)
[![JSR Score](https://jsr.io/badges/@gramio/sentry/score)](https://jsr.io/@gramio/sentry)

</div>

Интеграция с [Sentry](https://sentry.io/) — автоматический перехват ошибок, привязка пользователя из `context.from`, breadcrumbs на каждый update и API-вызов, опциональный трейсинг. Работает на `@sentry/core`, поэтому заведётся в любом рантайме (Bun, Node.js, Deno).

### Установка

::: code-group

```bash [npm]
npm install @gramio/sentry
```

```bash [yarn]
yarn add @gramio/sentry
```

```bash [pnpm]
pnpm add @gramio/sentry
```

```bash [bun]
bun install @gramio/sentry
```

:::

### Использование

```typescript
import { Bot } from "gramio";
import { sentryPlugin } from "@gramio/sentry";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(sentryPlugin({
        setUser: true,      // привязка пользователя из context.from
        breadcrumbs: true,  // breadcrumb на каждый update и API-вызов
        tracing: false,     // isolation scopes + спаны на каждый update
    }))
    .command("test", (context) => {
        context.sentry.captureMessage("Что-то произошло");
        context.sentry.setTag("custom", "value");
    });

await bot.start();
```

## Опции

### `setUser`

Тип: `boolean` — по умолчанию `true`

Автоматически привязывает пользователя к Sentry-скоупу. Берёт данные из `context.from` — `id`, `username`, `first_name`, `last_name`, `language_code`. Если юзера нет (например, channel post) — пропускает.

### `breadcrumbs`

Тип: `boolean` — по умолчанию `true`

Добавляет breadcrumb на каждый входящий update (категория `update`, тип обновления) и на каждый API-вызов (категория `api`, метод и параметры). Помогает понять, что произошло перед ошибкой.

### `tracing`

Тип: `boolean` — по умолчанию `false`

Включает isolation scopes и создаёт спан на каждый входящий update. Спан содержит тип обновления и id чата. Для работы нужен настроенный Sentry tracing в вашем проекте.

## Методы контекста

Плагин добавляет объект `context.sentry` с методами для ручного контроля:

### `context.sentry.captureMessage(message: string, level?: SeverityLevel)`

Отправляет сообщение в Sentry. Полезно для логирования важных событий, которые не являются ошибками:

```typescript
context.sentry.captureMessage("Пользователь оформил заказ", "info");
```

### `context.sentry.captureException(error: unknown)`

Ловит исключение и отправляет его в Sentry вручную. Обычно не нужно — плагин и так автоматически перехватывает все ошибки. Но бывает полезно для ошибок, которые вы перехватываете в `try/catch`:

```typescript
try {
    await riskyOperation();
} catch (error) {
    context.sentry.captureException(error);
}
```

### `context.sentry.setTag(key: string, value: string)`

Устанавливает тег на текущий скоуп. Теги индексируются и доступны в поиске на дашборде Sentry:

```typescript
context.sentry.setTag("command", "start");
context.sentry.setTag("chat.type", context.chat?.type ?? "unknown");
```

### `context.sentry.setExtra(key: string, value: unknown)`

Добавляет произвольные данные к текущему скоупу. В отличие от тегов, extras не индексируются, но могут содержать сложные объекты:

```typescript
context.sentry.setExtra("message", context.message);
```

## Рантайм

Плагин использует `@sentry/core` вместо platform-specific пакетов вроде `@sentry/node` или `@sentry/bun`. Это значит, что он работает в любом рантайме без дополнительной настройки. Инициализацию Sentry (`Sentry.init()`) нужно сделать самостоятельно до запуска бота — плагин не вызывает `init` за вас.
