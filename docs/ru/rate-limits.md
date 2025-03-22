---
title: Как решить проблемы с ограничением частоты запросов Telegram Bot API с помощью GramIO
head:
    - - meta
      - name: "description"
        content: Как решить проблемы с ограничением частоты запросов (too many requests) от Telegram Bot API с помощью GramIO, используя плагин auto-retry или очередь рассылки.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, 429 ошибка, ограничение частоты запросов, rate-limit, retry_after, too many requests, решение проблем, массовая рассылка, отложенные сообщения, очередь сообщений, Redis queue, Bull, BullMQ, управление нагрузкой, 30 сообщений в секунду, лимиты API, throttling, ожидание после ошибки, flood control, оптимизация запросов, обработка ошибок API, auto-retry плагин, стратегии рассылки
---

# Ограничения частоты запросов

В этом руководстве показано, как решить проблемы с ограничением частоты запросов (`Error code 429, Error: Too many requests: retry later`) от Telegram Bot API.

В общем, если вы избегаете поведения, напоминающего **массовую рассылку** в вашем боте, то беспокоиться об ограничениях частоты запросов не нужно. Но лучше на всякий случай использовать плагин [auto-retry](/ru/plugins/official/auto-retry). Если вы достигаете этих ограничений без рассылки, то, скорее всего, что-то не так на вашей стороне.

# Как делать рассылку

Для начала мы можем решить проблемы с ограничением частоты запросов при рассылке без использования **очередей**.

Давайте воспользуемся плагином [auto-retry](/ru/plugins/official/auto-retry), который ловит ошибки с полем `retry_after` (ошибки **ограничения частоты запросов**), **ждет** указанное время и **повторяет** запрос к API.

Затем нам нужно создать цикл и настроить **задержку** так, чтобы мы с наименьшей вероятностью попали на ошибку `rate-limit`, а если мы её поймаем, мы будем ждать указанное время (и плагин [auto-retry](/ru/plugins/official/auto-retry) повторит запрос)

```ts twoslash
// экспериментальное API, доступное с Node.js@16.14.0
import { scheduler } from "node:timers/promises";
import { Bot, TelegramError } from "gramio";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.BOT_TOKEN as string).extend(autoRetry());
const chatIds: number[] = [
    /** идентификаторы чатов */
];

for (const chatId of chatIds) {
    const result = await bot.api.sendMessage({
        suppress: true,
        chat_id: chatId,
        text: "Привет!",
    });

    await scheduler.wait(
        result instanceof TelegramError && result.payload?.retry_after
            ? result.payload.retry_after * 1000
            : 1000
    );
}
```

С очередью:

Пример рассылки, которая сохраняется даже при перезапуске сервера и готова к горизонтальному масштабированию.

Предварительные требования:

-   [Redis](https://redis.io/)
-   ioredis, bullmq, [jobify](https://github.com/kravetsone/jobify)

// TODO: больше информации об этом

```ts
import { Worker } from "bullmq";
import { Bot, TelegramError } from "gramio";
import { Redis } from "ioredis";
import { initJobify } from "jobify";

const bot = new Bot(process.env.BOT_TOKEN as string);

const redis = new Redis({
    maxRetriesPerRequest: null,
});

const defineJob = initJobify(redis);

const text = "Привет, мир!";

const sendMailing = defineJob("send-mailing")
    .input<{ chatId: number }>()
    .options({
        limiter: {
            max: 20,
            duration: 1000,
        },
    })
    .action(async ({ data: { chatId } }) => {
        const response = await bot.api.sendMessage({
            chat_id: chatId,
            suppress: true,
            text,
        });

        if (response instanceof TelegramError) {
            if (response.payload?.retry_after) {
                await sendMailing.worker.rateLimit(
                    response.payload.retry_after * 1000
                );

                // используйте это только если вы не используете auto-retry
                // потому что это запускает эту задачу заново
                throw Worker.RateLimitError();
            } else throw response;
        }
    });

const chats: number[] = []; // получите чаты из базы данных

await sendMailing.addBulk(
    chats.map((x) => ({
        name: "mailing",
        data: {
            chatId: x,
        },
    }))
);
```

### Дополнительное чтение

-   [Так что ваш бот ограничен по частоте запросов...](https://telegra.ph/So-your-bot-is-rate-limited-01-26)
-   [Рассылка пользователям](https://core.telegram.org/bots/faq#broadcasting-to-users) 