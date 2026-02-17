---
title: Long Polling vs Webhook — Как Telegram-боты получают обновления

head:
    - - meta
      - name: "description"
        content: "Узнайте разницу между long polling и webhook для Telegram-ботов. Когда использовать каждый подход, вопросы масштабирования и настройка webhook в GramIO."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, webhook, вебхук, long polling, getUpdates, HTTPS, SSL-сертификат, Express, Fastify, Hono, Elysia, масштабирование, горизонтальное масштабирование, Kubernetes, балансировщик нагрузки, serverless, продакшен, разработка"
---

# Long Polling vs Webhook

Telegram Bot API предоставляет два способа получения обновлений для вашего бота: **long polling** и **webhook**. У каждого подхода есть свои компромиссы в плане разработки, производительности и масштабируемости.

<PollingVsWebhook />

## Как работает Long Polling

При long polling ваш бот непрерывно вызывает метод [`getUpdates`](https://core.telegram.org/bots/api#getupdates) в цикле. Telegram удерживает соединение открытым, пока не появятся новые обновления (или не истечёт таймаут), а затем отвечает ими.

```
Bot                         Telegram
 │── getUpdates ──────────────►│
 │                             │ (ожидает обновлений...)
 │◄─────────── [update] ───────│
 │── getUpdates ──────────────►│
 │                             │ (ожидает...)
 │◄─────────── [] ─────────────│  ← нет обновлений
 │── getUpdates ──────────────►│
 ...
```

- Ваш бот инициирует каждый запрос — Telegram никогда не обращается к вашему боту напрямую
- Параметр `timeout` контролирует, как долго Telegram удерживает соединение (по умолчанию: 30, рекомендуется: 25–30 секунд)
- Не требуется публичный URL или SSL-сертификат
- Просто запускается локально — достаточно стартовать бота

В GramIO long polling используется по умолчанию:

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("message", (context) => {
    return context.send("Hello!");
});

bot.start(); // ← используется long polling по умолчанию
```

## Как работает Webhook

При использовании webhook вы регистрируете HTTPS URL в Telegram. Когда приходит обновление, Telegram отправляет HTTP POST запрос на этот URL с данными обновления.

```
Bot                         Telegram
 │                             │
 │    (простой — нет трафика)   │
 │                             │
 │                             │ ← пользователь отправил сообщение
 │◄──── POST /webhook ────────│
 │── 200 OK ──────────────────►│
 │                             │
 │    (простой — нет трафика)   │
```

- Telegram пушит обновления вашему боту — цикл опроса не нужен
- Требуется публично доступный HTTPS URL с валидным SSL-сертификатом
- Меньшая задержка — обновления приходят мгновенно, без ожидания следующего цикла опроса
- Более эффективно — нет трафика, когда обновлений нет

## Что выбрать?

### Разработка — Long Polling

Long polling идеален для локальной разработки:

- **Не нужен домен или SSL** — работает на `localhost` из коробки
- **Без конфигурации** — просто вызовите `bot.start()`
- **Простая отладка** — перезапуск бота мгновенный, не нужно настраивать туннели
- **Нет проблем с файрволом** — только исходящие соединения, не нужно открывать входящие порты

### Продакшен — Webhook

Webhook — рекомендуемый выбор для продакшен-развёртываний:

- **Меньшая задержка** — обновления доставляются мгновенно, без задержки опроса
- **Нет холостых соединений** — ресурсы не тратятся, когда обновлений нет
- **Горизонтальное масштабирование** — несколько экземпляров сервера за балансировщиком нагрузки
- **Совместимость с serverless** — работает с Vercel, AWS Lambda, Cloudflare Workers и аналогичными платформами
- **Эффективность ресурсов** — нет фонового цикла опроса, потребляющего CPU и память

## Несколько подов и масштабирование

Здесь выбор становится критически важным.

### Long Polling: только один экземпляр

Telegram **отклоняет** одновременные вызовы `getUpdates` от одного токена бота. Если два процесса опрашивают одновременно, один получает ошибку `409 Conflict`. Это означает:

- Можно запускать только **один** экземпляр с polling
- Нет горизонтального масштабирования
- Нет реплик в Kubernetes, нет сервисов Docker Swarm с `replicas > 1`
- Если единственный процесс упадёт, обновления задерживаются до его перезапуска

### Webhook: горизонтальное масштабирование

При webhook Telegram отправляет обновления на **URL** — ему всё равно, сколько серверов за ним стоит. Это открывает:

```
                  ┌─── Pod 1 (bot) ◄──┐
Telegram ──POST──►│ Load Balancer      │
                  ├─── Pod 2 (bot) ◄──┤
                  └─── Pod 3 (bot) ◄──┘
```

- **Балансировщик нагрузки** распределяет входящие запросы по подам
- Каждый под обрабатывает часть обновлений независимо
- Автомасштабирование работает естественно — добавляйте поды по мере роста нагрузки
- Бесшовные деплои — обновление подов без простоя (rolling updates)

> [!WARNING]
> При масштабировании с webhook убедитесь, что логика вашего бота не хранит состояние локально (или используйте общее хранилище, например Redis, для сессий). Каждое обновление может прийти на другой под.

## Сравнительная таблица

| Характеристика | Long Polling | Webhook |
|---|---|---|
| Сложность настройки | Минимальная | Требуется HTTPS URL + SSL |
| Нужен публичный URL | Нет | Да |
| Задержка | Зависит от интервала опроса | Мгновенная доставка |
| Ресурсы в простое | Постоянные (цикл опроса) | Нулевые |
| Горизонтальное масштабирование | Нет (один экземпляр) | Да (балансировщик) |
| Поддержка serverless | Нет | Да |
| Локальная разработка | Легко | Требуется туннель |
| Проблемы с файрволом | Нет (только исходящие) | Нужен входящий HTTPS |

## Настройка Webhook в GramIO

### Поддерживаемые фреймворки

-   [Elysia](https://elysiajs.com/)
-   [Fastify](https://fastify.dev/)
-   [Hono](https://hono.dev/)
-   [Express](https://expressjs.com/)
-   [Koa](https://koajs.com/)
-   [node:http](https://nodejs.org/api/http.html)
-   [Bun.serve](https://bun.sh/docs/api/http)
-   [std/http (Deno.serve)](https://docs.deno.com/runtime/manual/runtime/http_server_apis#http-server-apis)
-   [И любой другой фреймворк](#напишите-свой-собственный-обработчик-обновлений)

### Пример

```ts
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/telegram-webhook", webhookHandler(bot, "fastify"));

fastify.listen({ port: 3445, host: "::" });

bot.on("message", (context) => {
    return context.send("Fastify!");
});

bot.start({
    webhook: {
        url: "https://example.com:3445/telegram-webhook",
    },
});
```

### Использование вебхуков только в продакшене

Вместо использования туннелей вы можете просто использовать polling в среде разработки!

```ts
const bot = new Bot(process.env.BOT_TOKEN);

await bot.start({
    webhook:
        process.env.NODE_ENV === "production"
            ? {
                  url: `${process.env.API_URL}/${process.env.BOT_TOKEN}`,
              }
            : undefined,
});
```

Когда `webhook` равен `undefined`, GramIO автоматически переключается на long polling.

### Локальная разработка с вебхуками

Для локальной разработки с вебхуками мы рекомендуем использовать <a href="https://github.com/unjs/untun" target="_blank" rel="noopener noreferrer">
<img src="https://unjs.io/assets/logos/untun.svg" alt="untun Logo" width="24" height="24" style="vertical-align:middle; display: inline-block; margin-right: 5px;">unjs/untun</a>.

**Untun** — это инструмент для создания туннеля между вашим **локальным** HTTP(s) сервером и внешним миром!

> [!IMPORTANT]
> Примеры запуска с конкретными фреймворками опущены. Смотрите [этот пример](#пример).

#### Через API

Этот метод позволяет установить ссылку на наш туннель непосредственно в скрипте.

Установите пакет:

::: code-group

```bash [npm]
npm install untun
```

```bash [yarn]
yarn add untun
```

```bash [pnpm]
pnpm install untun
```

```bash [bun]
bun install untun
```

:::

Запустите туннель и установите вебхук:

```ts
import { startTunnel } from "untun";

const tunnel = await startTunnel({ port: 3000 });

bot.start({
    webhook: {
        url: await tunnel.getURL(),
    },
});
```

#### Через CLI

Мы прослушиваем порт `3000` локально. Поэтому открываем туннель следующим образом:

::: code-group

```bash [npm]
npx untun@latest tunnel http://localhost:3000
```

```bash [yarn]
yarn dlx untun@latest tunnel http://localhost:3000
```

```bash [pnpm]
pnpm dlx untun@latest tunnel http://localhost:3000
```

```bash [bun]
bunx untun@latest tunnel http://localhost:3000
```

:::

```bash
◐ Starting cloudflared tunnel to http://localhost:3000
ℹ Waiting for tunnel URL...
✔ Tunnel ready at https://unjs-is-awesome.trycloudflare.com
```

Теперь мы используем эту ссылку при установке вебхука:

```ts
bot.start({
    webhook: {
        url: "https://unjs-is-awesome.trycloudflare.com",
    },
});
```

### Напишите свой собственный обработчик обновлений

```ts
// не существующий фреймворк для примера
import { App } from "some-http-framework";
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).on("message", (context) =>
    context.send("Hello!")
);

// init обязателен. Он используется для ленивой загрузки плагинов, а также получает информацию о боте.
await bot.init();

const app = new App().post("/telegram", async (req) => {
    // req.body должен быть json эквивалентом TelegramUpdate
    await bot.updates.handleUpdate(req.body);
});

app.listen(80);
```
