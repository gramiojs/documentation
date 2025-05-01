# Posthog

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/posthog?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/posthog)
[![JSR](https://jsr.io/badges/@gramio/posthog)](https://jsr.io/@gramio/posthog)
[![JSR Score](https://jsr.io/badges/@gramio/posthog/score)](https://jsr.io/@gramio/posthog)

</div>

Плагин, который удобно оборачивает клиент [PostHog](https://posthog.com/). Автоматически ловит ошибки (и включает в них `senderId` и `chatId`). Предоставляет методы к которым уже привязан distinctId (в виде `from.id`)

### Установка

::: code-group

```bash [npm]
npm install @gramio/media-group
```

```bash [yarn]
yarn add @gramio/media-group
```

```bash [pnpm]
pnpm add @gramio/media-group
```

```bash [bun]
bun install @gramio/media-group
```

:::

### Использование

```typescript
import { PostHog } from "posthog-node";
import { posthogPlugin } from "@gramio/posthog";
import { Bot } from "gramio";

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.POSTHOG_HOST,
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(posthogPlugin(posthog))
    .on("message", (context) => {
        context.capture("message", {
            text: context.message.text,
        });

        throw new Error("Будет поймано PostHog");
    });

await bot.start();
```

## Методы

### `capture(event: string, properties?: Record<string, unknown>)`

Ловит события и отправляет их в PostHog вместе с `senderId`.

```typescript
context.capture("message", {
    text: context.message.text,
});
```

### Feature Flags

#### `isEnabled(feature: string, options?: IsFeatureEnabledOptions)`

Проверяет включен ли feature flag для текущего пользователя.

```typescript
const isEnabled = await context.featureFlags.isEnabled("beta-feature", {
    groups: { organization: "org_id" },
});
// Возвращает boolean
```

#### `getPayload(feature: string, value?: GetFeatureFlagPayloadValue, options?: GetFeatureFlagPayloadOptions)`

Получает payload (дополнительные данные) для feature flag.

```typescript
const payload = await context.featureFlags.getPayload("pricing-page", {
    sendEmail: true,
});
// Возвращает any | undefined
```

#### `get(feature: string, options?: GetFeatureFlagOptions)`

Получает полную информацию о feature flag.

```typescript
const flag = await context.featureFlags.get("new-onboarding", {
    personProperties: { plan: "pro" },
});
// Возвращает boolean | string | number | Record<string, any>
```

#### `getAll(options?: GetAllFlagsOptions)`

Получает все feature flags для пользователя.

```typescript
const allFlags = await context.featureFlags.getAll({
    groups: { company: "acme" },
});
// Возвращает Record<string, boolean | string | number>
```

#### `getAllPayload(options?: GetAllFlagsPayloadOptions)`

Получает все флаги вместе с их payloads.

```typescript
const flagsWithPayloads = await context.featureFlags.getAllPayload({
    personProperties: { country: "US" },
});
/* Возвращает:
{
  flags: Record<string, boolean | string | number>
  payloads: Record<string, any>
} */
```
