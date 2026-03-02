# Rate Limiter

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/rate-limit?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/rate-limit)

</div>

`@gramio/rate-limit` защищает обработчики вашего бота от спама и злоупотреблений через **скользящее окно**. В отличие от ручных проверок `if (!await ctx.rateLimit(...)) return`, этот плагин использует **систему макросов** GramIO — обработчики декларируют лимиты прямо в объекте опций. Никакого лишнего кода.

### Установка

::: code-group

```bash [npm]
npm install @gramio/rate-limit
```

```bash [yarn]
yarn add @gramio/rate-limit
```

```bash [pnpm]
pnpm add @gramio/rate-limit
```

```bash [bun]
bun add @gramio/rate-limit
```

:::

### Использование

```ts
import { Bot } from "gramio";
import { rateLimit } from "@gramio/rate-limit";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            onLimitExceeded: async (ctx) => {
                if (ctx.is("message")) await ctx.reply("Слишком много запросов, подождите!");
            },
        }),
    );

// Каждый обработчик задаёт свои лимиты через объект опций:
bot.command("pay", (ctx) => {
    // обработка платежа...
}, { rateLimit: { limit: 3, window: 60 } });

bot.command("help", (ctx) => ctx.reply("Текст справки"), {
    rateLimit: {
        id: "help",          // явный ключ — по умолчанию тип события + id пользователя
        limit: 20,
        window: 60,
        onLimitExceeded: (ctx) => ctx.reply("Слишком много запросов /help!"),
    },
});

await bot.start();
```

### Кастомное хранилище

Плагин поставляется с **хранилищем в памяти** из коробки. Для продакшена подключите любой адаптер, совместимый с `@gramio/storages`:

::: code-group

```ts [Redis]
import { rateLimit } from "@gramio/rate-limit";
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            storage: redisStorage(new Redis()),
            onLimitExceeded: async (ctx) => {
                if (ctx.is("message")) await ctx.reply("Притормози!");
            },
        }),
    );
```

```ts [In-memory (по умолчанию)]
import { rateLimit } from "@gramio/rate-limit";
import { inMemoryStorage } from "@gramio/storage";

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(
        rateLimit({
            storage: inMemoryStorage(), // явно, то же что и по умолчанию
        }),
    );
```

:::

## API

### `rateLimit(options?)`

Возвращает плагин GramIO, регистрирующий макрос `rateLimit`.

| Опция | Тип | Описание |
|---|---|---|
| `storage` | `Storage` | Адаптер хранилища. По умолчанию: в памяти |
| `key` | `(ctx) => string` | Функция кастомного ключа. По умолчанию: `"${eventType}:${from.id}"` |
| `onLimitExceeded` | `(ctx) => unknown` | Глобальный коллбэк при превышении лимита |

### Опции обработчика (макрос `rateLimit`)

Передаётся третьим аргументом любого метода-обработчика:

```ts
bot.command("pay", handler, {
    rateLimit: {
        id?: string;           // Переопределение ключа. По умолчанию eventType:userId
        limit: number;         // Максимум запросов за окно
        window: number;        // Размер окна в секундах
        onLimitExceeded?: (ctx) => unknown; // Переопределяет глобальный коллбэк
    }
});
```

| Поле | Тип | По умолчанию | Описание |
|---|---|---|---|
| `id` | `string` | тип события + id пользователя | Кастомный ключ лимита |
| `limit` | `number` | — | Максимум разрешённых запросов |
| `window` | `number` | — | Размер окна в секундах |
| `onLimitExceeded` | функция | глобальная опция | Коллбэк уровня обработчика |
