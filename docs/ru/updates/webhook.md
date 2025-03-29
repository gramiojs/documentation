---
title: Настройка Webhook для Telegram ботов - Руководство по использованию вебхуков в GramIO

head:
    - - meta
      - name: "description"
        content: "Полное руководство по настройке и использованию webhook для получения обновлений в Telegram ботах на GramIO. Интеграция с популярными веб-фреймворками, обработка HTTPS и советы по оптимизации производительности."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, webhook, вебхук, HTTPS, SSL-сертификат, Express integration, Fastify integration, Hono integration, Elysia integration, setWebhook, обработка обновлений, long polling против webhook, производительность бота, самозаверенный сертификат, Nginx настройка, reverse proxy, TLS-соединение, обработка запросов, веб-сервер для бота, webhookCallback, getWebhookInfo, ngrok для разработки, Cloud Functions, serverless webhook"
---

# Как использовать вебхуки

Telegram Bot API поддерживает два способа получения обновлений: [long-polling](https://en.wikipedia.org/wiki/Push_technology#Long_polling) и [webhook](https://en.wikipedia.org/wiki/Webhook?useskin=vector). GramIO хорошо работает с обоими.

Вот пример использования вебхуков

## Поддерживаемые фреймворки

-   [Elysia](https://elysiajs.com/)
-   [Fastify](https://fastify.dev/)
-   [Hono](https://hono.dev/)
-   [Express](https://expressjs.com/)
-   [Koa](https://koajs.com/)
-   [node:http](https://nodejs.org/api/http.html)
-   [Bun.serve](https://bun.sh/docs/api/http)
-   [std/http (Deno.serve)](https://docs.deno.com/runtime/manual/runtime/http_server_apis#http-server-apis)
-   [И любой другой фреймворк](#напишите-свой-собственный-обработчик-обновлений)

## Пример

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

## Использование вебхуков только в продакшене

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

## Локальная разработка с вебхуками

Для локальной разработки с вебхуками мы рекомендуем использовать <a href="https://github.com/unjs/untun" target="_blank" rel="noopener noreferrer">
<img src="https://unjs.io/assets/logos/untun.svg" alt="untun Logo" width="24" height="24" style="vertical-align:middle; display: inline-block; margin-right: 5px;">unjs/untun</a>.

**Untun** — это инструмент для создания туннеля между вашим **локальным** HTTP(s) сервером и внешним миром!

> [!IMPORTANT]
> Примеры запуска с конкретными фреймворками опущены. Смотрите [этот пример](#пример).

### Через API

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

### Через CLI

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

## Напишите свой собственный обработчик обновлений

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