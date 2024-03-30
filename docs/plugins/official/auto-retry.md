# Auto retry plugin

A plugin that catches errors with the `retry_after` field (**rate limit** errors), **waits** for the specified time and **repeats** the API request.

### Installation

::: code-group

```bash [npm]
npm install @gramio/auto-retry
```

```bash [yarn]
yarn add @gramio/auto-retry
```

```bash [pnpm]
pnpm add @gramio/auto-retry
```

```bash [bun]
bun install @gramio/auto-retry
```

:::

### Usage

```ts
import { Bot } from "gramio";
import { autoRetry } from "@gramio/auto-retry";

const bot = new Bot(process.env.TOKEN!)
    .extend(autoRetry())
    .command("start", async (context) => {
        for (let index = 0; index < 100; index++) {
            await context.reply(`some ${index}`);
        }
    })
    .onStart(console.log);

bot.start();
```
