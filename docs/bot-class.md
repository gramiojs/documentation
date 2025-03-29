---
title: Bot class in GramIO - Core class for building Telegram bots

head:
    - - meta
      - name: "description"
        content: Learn about the Bot class in GramIO - the core class for creating and managing Telegram bots. Discover its methods, properties, and how to configure your bot for optimal performance.

    - - meta
      - name: "keywords"
        content: telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, Bot class, bot instance, bot configuration, bot initialization, bot token, bot methods, update handling, bot middleware, event listeners, on method, command method, webhook setup, bot polling, bot lifecycle

---

# Main bot class

[`Bot`](https://jsr.io/@gramio/core/doc/~/Bot) - the main class of the framework. You use it to interact with the [Telegram Bot API](/bot-api).

## [Constructor](https://jsr.io/@gramio/core/doc/~/Bot#constructors)

There are [two ways](https://jsr.io/@gramio/core/doc/~/Bot#constructors) to pass the token and parameters.

1. Pass the token as the first argument and (optionally) options

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

2. Pass the options with the required `token` field

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

### Bot info

When the bot begins to listen for updates, `GramIO` retrieves information about the bot to verify if the **bot token is valid**
and to utilize some bot metadata. For example, this metadata will be used to strip bot mentions in commands.
If you set it up, `GramIO` will not send a `getMe` request on startup.

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
> You should set this up when **horizontally scaling** your bot (because `rate limits` on `getMe` method and **faster start up time**) or working in **serverless** environments.

### Default plugins

Some plugins are used by default, but you can disable them.

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
        // disable formatting. All format`` will be text without formatting
        format: false,
    },
});
```

## API options

### fetchOptions

Configure [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) [parameters](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)

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

URL which will be used to send requests to. `"https://api.telegram.org/bot"` by default.

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
        // random domain
        baseURL: "https://telegram.io/bot",
    },
});
```

### useTest

Should we send requests to `test` data center? `false` by default.
The test environment is completely separate from the main environment, so you will need to create a new user account and a new bot with `@BotFather`.

[Documentation](https://core.telegram.org/bots/webapps#using-bots-in-the-test-environment)

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

Time in milliseconds before calling `getUpdates` again. `1000` by default.

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

## Proxy support

In GramIO, it is quite simple to set up a proxy for requests.

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
> Despite the fact that `undici` works under the hood of `Node.js`, you'll have to install it. Also make sure you don't have `"lib": ["DOM"]` in your `tsconfig.json`, otherwise you won't see the **dispatcher** property in the **types** (although `undici` will process it anyway).

[Documentation](https://github.com/nodejs/undici/blob/e461407c63e1009215e13bbd392fe7919747ab3e/docs/api/ProxyAgent.md)

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
        /** Bun-only API */
        proxy: string;
    }
}
// ---cut--- -->

```ts
const bot = new Bot(process.env.BOT_TOKEN, {
    api: {
        fetchOptions: {
            proxy: "https://username:password@proxy.example.com:8080",
        },
    },
});
```

[Guide](https://bun.sh/guides/http/proxy)

### Deno

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
        /** Missing Deno Types */
        client: any;
    }
}
export {};

/** Sorry zero typings */
const Deno = {} as any;

// ---cut--- -->

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
