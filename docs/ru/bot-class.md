---
title: Класс Bot в GramIO - Основной класс для создания Telegram ботов

head:
    - - meta
      - name: "description"
        content: Подробное описание класса Bot в GramIO - основного класса для создания и управления Telegram ботами. Узнайте о методах, событиях и возможностях.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, класс Bot, конструктор бота, методы бота, события бота, управление ботом, long polling, webhook, middleware, обработчики событий, хуки, start метод, stop метод, инициализация бота, обработка команд, обработка сообщений
---

# Основной класс бота

[`Bot`](https://jsr.io/@gramio/core/doc/~/Bot) - главный класс фреймворка. Вы используете его для взаимодействия с [Telegram Bot API](/ru/bot-api).

## [Конструктор](https://jsr.io/@gramio/core/doc/~/Bot#constructors)

Существует [два способа](https://jsr.io/@gramio/core/doc/~/Bot#constructors) передачи токена и параметров.

1. Передать токен в качестве первого аргумента и (опционально) параметры

 <!-- twoslash
import { Bot } from "gramio";

const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        fetchOptions: {
            headers: {
                "X-Hi-Telegram": "10",
            },
        },
    },
});
```

2. Передать параметры с обязательным полем `token`

 <!-- twoslash
import { Bot } from "gramio";
const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot({
    token: process.env.BOT_TOKEN,
    api: {
        fetchOptions: {
            headers: {
                "X-Hi-Telegram": "10",
            },
        },
    },
});
```

### Информация о боте

Когда бот начинает прослушивать обновления, `GramIO` получает информацию о боте, чтобы проверить, является ли **токен бота действительным**,
и использовать некоторые данные бота. Например, эти данные будут использоваться для обработки упоминаний бота в командах.
Если вы это настроите это поле сами, `GramIO` не будет отправлять запрос `getMe` при запуске.

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    info: process.env.NODE_ENV === "production" ?
		 {
					id: 1,
					is_bot: true,
					first_name:
						"Bot example",
					username: "example_bot",
                    // ..
				}
			 : undefined
    },
});
```

> [!IMPORTANT]
> Вам следует настроить это при **горизонтальном масштабировании** вашего бота (из-за `ограничений частоты запросов` метода `getMe` и **более быстрого времени запуска**) или при работе в **бессерверных** средах.

### Плагины по умолчанию

Некоторые плагины используются по умолчанию, но вы можете отключить их.

 <!-- twoslash
import { Bot } from "gramio";
const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    plugins: {
        // отключить форматирование. Все format`` будут текстом без форматирования
        format: false,
    },
});
```

## Параметры API

### fetchOptions

Настройка [параметров](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)

 <!-- twoslash
import { Bot } from "gramio";
const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        fetchOptions: {
            headers: {
                "X-Hi-Telegram": "10",
            },
        },
    },
});
```

### baseURL

URL, который будет использоваться для отправки запросов. По умолчанию `"https://api.telegram.org/bot"`.

 <!-- twoslash
import { Bot } from "gramio";
const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        // случайный домен
        baseURL: "https://telegram.io/bot",
    },
});
```

### useTest

Следует ли отправлять запросы в `тестовый` дата-центр? По умолчанию `false`.
Тестовая среда полностью отделена от основной среды, поэтому вам потребуется создать новую учетную запись пользователя и нового бота с помощью `@BotFather`.

[Документация](https://core.telegram.org/bots/webapps#using-bots-in-the-test-environment)

 <!-- twoslash
import { Bot } from "gramio";
const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        useTest: true,
    },
});
```

### retryGetUpdatesWait

Время в миллисекундах перед повторным вызовом `getUpdates`. По умолчанию `1000`.

 <!-- twoslash
import { Bot } from "gramio";
const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        retryGetUpdatesWait: 300,
    },
});
```

## Поддержка прокси

В GramIO очень просто настроить прокси для запросов.

### Node.js

```ts
import { ProxyAgent } from "undici";

const proxyAgent = new ProxyAgent("my.proxy.server");

const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        fetchOptions: {
            dispatcher: proxyAgent,
        },
    },
});
```

> [!WARNING]
> Несмотря на то, что `undici` работает под капотом `Node.js`, вам придется установить его. Также убедитесь, что у вас нет `"lib": ["DOM"]` в вашем `tsconfig.json`, иначе вы не увидите свойство **dispatcher** в **типах** (хотя `undici` всё равно будет его обрабатывать).

[Документация](https://github.com/nodejs/undici/blob/e461407c63e1009215e13bbd392fe7919747ab3e/docs/api/ProxyAgent.md)

### Bun

 <!-- twoslash
import { Bot } from "gramio";

const process = {} as {
    env: {
        BOT_TOKEN: string;
        [key: string]: string | undefined;
    };
};

declare global {
    interface RequestInit {
        proxy?: string;
    }
}

// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        fetchOptions: {
            proxy: "https://my.proxy.server",
        },
    },
});
```

[Документация](https://bun.sh/docs/api/fetch#proxy-requests)

### Deno

```ts
import { Bot } from "jsr:@gramio/core";

/**
 * npm:proxy-agent works in Deno
 * https://github.com/TooTallNate/node-proxy-agent
 */
import ProxyAgent from "npm:proxy-agent";
import { fetch } from "npm:undici";

const bot = new Bot(Deno.env.get("BOT_TOKEN")!, {
    api: {
        fetch: async (url, options) => {
            // @ts-ignore
            const proxyAgent = new ProxyAgent("https://proxy.example.com:3128");

            return await fetch(url, {
                ...options,
                // @ts-ignore
                dispatcher: proxyAgent,
            });
        },
    },
});
```

## Управление жизненным циклом

### Запуск

#### Long-polling (поллинг)

**Long-polling** - это метод получения обновлений от Telegram, когда ваш бот регулярно отправляет запросы Telegram для получения обновлений. По сравнению с webhook, вам не нужно иметь публичный IP-адрес или домен, а ваш бот может работать где угодно.

Вы можете запустить своего бота в режиме long-polling, вызвав метод `bot.start()`.

Опции по умолчанию:

```ts
{
    // Получение информации о боте
    getInfo: true,
    method: "long-polling",
    // Параметры для getUpdates
    polling: {
        // Максимальное количество обновлений для получения за один раз.
        // Значение ограничено 100 на стороне сервера.
        limit: 100,
        // Таймаут в секундах для long polling.
        // Должно быть положительным, краткосрочные опросы следует
        // избегать во избежание перегрузки сервера.
        timeout: 30,
        // Список разрешенных типов обновлений, если не undefined.
        allowedUpdates: undefined,
    },
}
```

```ts
bot.start({
    polling: {
        allowedUpdates: ["message", "callback_query"],
    },
});
```

#### webhook

**Webhook** — это метод получения обновлений от Telegram, когда Telegram отправляет данные на ваш сервер, когда происходит обновление. По сравнению с long-polling, вам нужно иметь публичный IP-адрес или домен.

```ts
bot.start({
    method: "webhook",
    webhook: {
        path: "/webhook",
        port: 3000,
        host: "0.0.0.0",
        launchOptions: {
            // Временные опции, которые передаются в setWebhook
            dropPendingUpdates: true,
        },
    },
});
```

[Подробнее](updates/webhook)

## Другие методы

### direct

Отправляет запрос, не прикрепленный к какому-либо [обработчику обновлений](updates/overview.md).

```ts
await bot.direct.onStart(() => {
    console.log("Bot started!");
});
```

### use

Добавить промежуточное ПО (middleware) для обработки всех обновлений.

```ts
bot.use(async (context, next) => {
    console.log("before");
    await next();
    console.log("after");
});
```

### derive

Преобразует контекст обновления, добавляя свои собственные данные.

```ts
bot.derive("message", (context) => {
    return {
        myCustomField: "custom value",
    };
});

bot.on("message", (context) => {
    console.log(context.myCustomField); // "custom value";
});
```

Вы можете изменить контекст настолько, насколько захотите.

```ts
import { Bot } from "gramio";

interface MyCustomContext {
    user: {
        id: number;
        name: string;
    };
}

// Передаём настраиваемый контекст как обобщённый тип, но это не обязательно
const bot = new Bot<{}, {}, MyCustomContext>(process.env.BOT_TOKEN as string);

// Поля, которые вы вернёте из функции,
// будут добавлены в ваш контекст обновлений
bot.derive("message", async (context) => {
    return {
        // Этот аргумент станет context.user
        user: {
            // Вы можете получить идентификатор пользователя из самого контекста
            id: context.from!.id,
            name: context.from!.first_name,
        },
    };
});

bot.on("message", (context) => {
    // Вы можете обращаться к контексту как к своему собственному типу
    context.user;
});

// Этот код ошибочен, поскольку тип "callback_query"
// не поддерживает метод "derive"
bot.on("callback_query", (context) => {
    // @ts-expect-error
    context.user;
});
```

### Кастомные хранилища

Вы можете настроить, как [бот](https://jsr.io/@gramio/core/doc/~/Dispatcher) хранит обработчики.

```ts
bot.handlersStorage.add("message", (context) => {
    console.log("Handler from storage");
});
```

#### Реализация собственного хранилища

Ниже приведен пример реализации [собственного хранилища](https://jsr.io/@gramio/core/doc/~/HandlersStorage) для вашего бота.
Возможно, вы захотите реализовать свою собственную систему маршрутизации или изменить поведение хранилища по умолчанию
(например, если вам не нравится [порядок обработчиков](https://jsr.io/@gramio/core/doc/~/HandlersStorage) в `GramIO`).

```ts
import { HandlersStorage, Update } from "gramio";

// Создаём класс хранилища, который наследуется от HandlersStorage
class MyStorage extends HandlersStorage {
    override add<U extends Update["update"]>(
        handlerType: U,
        handler: (context: any) => unknown,
        options?: object
    ) {
        // Перезаписываем стандартное поведение
        return super.add(handlerType, handler, options);
    }
}

// Передаём наше собственное хранилище при создании экземпляра бота
const bot = new Bot(process.env.BOT_TOKEN, {
    handlersStorage: new MyStorage(),
});
```
