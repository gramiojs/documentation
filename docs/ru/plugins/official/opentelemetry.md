# OpenTelemetry

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/opentelemetry?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/opentelemetry)
[![JSR](https://jsr.io/badges/@gramio/opentelemetry)](https://jsr.io/@gramio/opentelemetry)
[![JSR Score](https://jsr.io/badges/@gramio/opentelemetry/score)](https://jsr.io/@gramio/opentelemetry)

</div>

Плагин для распределённого трейсинга через [OpenTelemetry](https://opentelemetry.io/). Каждый входящий update создаёт корневой спан, а каждый вызов Telegram Bot API — дочерний. Подключаете любой бэкенд (Jaeger, Zipkin, OTLP) — и видите полную картину обработки сообщений.

### Установка

::: code-group

```bash [npm]
npm install @gramio/opentelemetry
```

```bash [yarn]
yarn add @gramio/opentelemetry
```

```bash [pnpm]
pnpm add @gramio/opentelemetry
```

```bash [bun]
bun install @gramio/opentelemetry
```

:::

### Использование

```typescript
import { Bot } from "gramio";
import { opentelemetryPlugin } from "@gramio/opentelemetry";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(opentelemetryPlugin({
        recordApiParams: true, // записывать параметры API как атрибуты спана
    }))
    .command("start", (context) => context.send("Привет!"));

await bot.start();
```

## Иерархия трейсов

Плагин выстраивает иерархию спанов автоматически:

- **Корневой спан** — создаётся на каждый входящий update (тип: `message`, `callback_query` и т.д.)
- **Дочерние спаны** — каждый API-вызов (`sendMessage`, `editMessageText` и пр.) оборачивается в дочерний спан с привязкой к корневому

Если `recordApiParams` включён, параметры запроса пишутся в атрибуты спана — удобно для дебага.

## Методы

### `context.record(name: string, attributes?: Attributes)`

Создаёт дочерний спан-событие внутри текущего update-спана. Полезно для точечной разметки бизнес-логики:

```typescript
bot.command("order", async (context) => {
    context.record("order.created", { orderId: "123" });

    // ...обработка заказа
});
```

### `context.getCurrentSpan()`

Возвращает текущий активный спан. Пригодится, когда нужно руками докинуть атрибуты или события:

```typescript
bot.on("message", (context) => {
    const span = context.getCurrentSpan();
    span?.setAttribute("user.premium", true);
});
```

### `context.setAttributes(attributes: Attributes)`

Устанавливает атрибуты на текущий спан — удобная обёртка, чтобы каждый раз не доставать спан вручную:

```typescript
bot.on("message", (context) => {
    context.setAttributes({
        "user.id": context.from?.id,
        "chat.type": context.chat?.type,
    });
});
```

## Бэкенды

Плагин использует стандартный OpenTelemetry SDK, поэтому работает с любым совместимым бэкендом. Настраиваете экспортер в своём `tracing.ts` (или аналоге) — и спаны полетят куда нужно:

- **Jaeger** — `@opentelemetry/exporter-jaeger`
- **Zipkin** — `@opentelemetry/exporter-zipkin`
- **OTLP (gRPC / HTTP)** — `@opentelemetry/exporter-trace-otlp-grpc` / `@opentelemetry/exporter-trace-otlp-http`
- **Console** — `@opentelemetry/sdk-trace-base` (ConsoleSpanExporter) для локального дебага
