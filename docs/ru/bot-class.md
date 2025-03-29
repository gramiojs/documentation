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
const client = Deno.createHttpClient({
    proxy: { url: "http://host:port/" },
});

const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        fetchOptions: {
            client,
        },
    },
});
```

> [!WARNING]
> This API is **unstable**, so you should run it with `deno run index.ts --unstable`

[Documentation](https://docs.deno.com/api/web/~/fetch#function_fetch_1) | [Deno.proxy](https://docs.deno.com/api/deno/~/Deno.Proxy) | [`HTTP_PROXY` environment variables](https://docs.deno.com/runtime/manual/basics/modules/proxies/)
