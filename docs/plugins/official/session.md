# Session Plugin

Session plugin for GramIO.

**Currently not optimized.**

### Installation

::: code-group

```bash [npm]
npm install @gramio/session
```

```bash [yarn]
yarn add @gramio/session
```

```bash [pnpm]
pnpm add @gramio/session
```

```bash [bun]
bun install @gramio/session
```

:::

## Usage

```ts twoslash
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(process.env.token!)
    .extend(
        session({
            key: "sessionKey",
            initial: () => ({ apple: 1 }),
        })
    )
    .on("message", (context) => {
        context.send(`🍏 apple count is ${++context.sessionKey.apple}`);
        //                                              ^?
    })
    .onStart(console.log);

bot.start();
```

You can use this plugin with any storage ([Read more](/storages))

### Redis example

[More info](https://github.com/gramiojs/storages/tree/master/packages/redis)

```ts
import { Bot } from "gramio";
import { session } from "@gramio/session";
import { redisStorage } from "@gramio/storage-redis";

const bot = new Bot(process.env.token!)
    .extend(
        session({
            key: "sessionKey",
            initial: () => ({ apple: 1 }),
            storage: redisStorage(),
        })
    )
    .on("message", (context) => {
        context.send(`🍏 apple count is ${++context.sessionKey.apple}`);
    })
    .onStart(console.log);

bot.start();
```
