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

Telegram Bot API устанавливает строгие ограничения на частоту запросов для защиты инфраструктуры и других ботов от злоупотреблений. Если ваш бот отправляет слишком много запросов за короткий период, API ответит ошибкой **HTTP 429 — Too Many Requests** с полем `retry_after`, указывающим, сколько секунд бот должен ждать перед выполнением любых API-вызовов.

## Основные лимиты

Telegram **не публикует официально** точные значения лимитов. Числа ниже — приблизительные, основанные на опыте сообщества. Их безопасно придерживаться, но реальные лимиты **динамические** и зависят от множества факторов: возраста бота, его истории, типа запросов.

| Ограничение | Приблизительное значение |
|---|---|
| Сообщения в **один чат** | ~1 в секунду |
| Сообщения в **разные чаты** | ~30 в секунду |
| Массовые рассылки | ~30 в секунду всего |
| Операции с группами/каналами | Ниже, зависит от кол-ва участников |

> [!NOTE]
> На практике лимиты устроены сложнее, чем просто «30 в секунду» — они могут меняться динамически и отличаться для разных ботов. Если вашему боту нужна более высокая пропускная способность, вы можете **обратиться в [@BotSupport](https://t.me/BotSupport)** и запросить увеличение лимитов для вашего бота.

> [!TIP]
> Если вы не делаете рассылки, а просто отвечаете на сообщения пользователей — вы почти наверняка не столкнётесь с этими лимитами. Но всё равно хорошей практикой будет добавить плагин [auto-retry](/ru/plugins/official/auto-retry) в качестве подстраховки.

## Что происходит при превышении лимита

Когда вы превышаете лимит, Telegram возвращает:

```json
{
  "ok": false,
  "error_code": 429,
  "description": "Too Many Requests: retry after 35",
  "parameters": {
    "retry_after": 35
  }
}
```

Ваш бот **полностью блокируется** на время `retry_after` (до 35+ секунд). Никакие API-вызовы не будут работать в это время — не только для пользователей, которым вы делали рассылку, но и для **всех** пользователей, взаимодействующих с вашим ботом.

## Проблема: рассылка без задержек

Частая ошибка — перебирать список пользователей и отправлять сообщения на максимальной скорости:

```ts
// НЕ делайте так!
for (const chatId of chatIds) {
    await bot.api.sendMessage({ chat_id: chatId, text: "Привет!" });
    // Без задержки → мгновенный 429 после ~30 сообщений
}
```

Это отправляет запросы с максимальной скоростью. После примерно 30 сообщений Telegram полностью блокирует вашего бота.

<BroadcastVisualizer />

## Как правильно делать рассылку

### Простой подход: цикл с задержкой

Используйте [встроенную функцию `withRetries`](/ru/bot-api#Обработка-Rate-Limit), которая перехватывает ошибки `retry_after`, ждёт указанное время и автоматически повторяет запрос. Добавьте базовую задержку между каждым запросом, чтобы не выходить за лимит:

```ts twoslash
// экспериментальное API, доступное с Node.js@16.14.0
import { scheduler } from "node:timers/promises";
import { Bot, TelegramError } from "gramio";
import { withRetries } from "gramio/utils";

const bot = new Bot(process.env.BOT_TOKEN as string);
const chatIds: number[] = [
    /** идентификаторы чатов */
];

for (const chatId of chatIds) {
    const result = await withRetries(() =>
        bot.api.sendMessage({
            chat_id: chatId,
            text: "Привет!",
        })
    );

    await scheduler.wait(100); // Базовая задержка между запросами для избежания rate-limit
}
```

Это хорошая отправная точка для небольших рассылок (до нескольких тысяч пользователей). Но у этого подхода есть минусы:

- **Не персистентный** — если сервер перезапустится, вы потеряете позицию в списке
- **Не масштабируемый** — один цикл нельзя распараллелить на несколько серверов
- **Нет отслеживания прогресса** — вы не знаете, какие пользователи уже получили сообщение

### Для продакшена: @gramio/broadcast

Для реальных рассылок используйте [@gramio/broadcast](https://github.com/gramiojs/broadcast) — решение на основе очередей, встроенное в экосистему GramIO. Оно **персистентное** (переживает перезапуски), **горизонтально масштабируемое** и автоматически обрабатывает ограничения частоты.

**Требования:** [Redis](https://redis.io/)

```ts
import { Bot, InlineKeyboard } from "gramio";
import Redis from "ioredis";
import { Broadcast } from "@gramio/broadcast";

const redis = new Redis({
    maxRetriesPerRequest: null,
});

const bot = new Bot(process.env.BOT_TOKEN as string);

const broadcast = new Broadcast(redis).type("test", (chatId: number) =>
    bot.api.sendMessage({
        chat_id: chatId,
        text: "test",
    })
);

console.log("prepared to start");

const chatIds = [617580375];

await broadcast.start(
    "test",
    chatIds.map((x) => [x])
);

// graceful shutdown
async function gracefulShutdown() {
    console.log(`Process ${process.pid} go to sleep`);

    await broadcast.job.queue.close();

    console.log("closed");
    process.exit(0);
}

process.on("SIGTERM", gracefulShutdown);

process.on("SIGINT", gracefulShutdown);
```

Вы определяете **типы** рассылок с полной типобезопасностью — каждый тип указывает, какие данные получает функция рассылки. Затем вызываете `broadcast.start` с массивом аргументов, а библиотека берёт на себя очередь, ограничение частоты, повторные попытки и персистентность.

### Своя реализация с BullMQ

Если вам нужен полный контроль над поведением очереди, вы можете построить собственное решение на [BullMQ](https://docs.bullmq.io/) с [jobify](https://github.com/kravetsone/jobify):

**Требования:** [Redis](https://redis.io/), ioredis, bullmq, [jobify](https://github.com/kravetsone/jobify)

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

Опция `limiter` гарантирует, что BullMQ обрабатывает не более 20 задач в секунду. Если возникает ошибка 429, воркер приостанавливается на время, указанное в `retry_after`, а затем возобновляет работу.

### Дополнительное чтение

-   [Так что ваш бот ограничен по частоте запросов...](https://telegra.ph/So-your-bot-is-rate-limited-01-26)
-   [Рассылка пользователям](https://core.telegram.org/bots/faq#broadcasting-to-users)
