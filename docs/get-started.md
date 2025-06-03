---
title: Get Started with GramIO - Create Telegram bots using TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: Get started with GramIO by bootstrapping a new project with «npx create gramio bot-dir» and start development with «npm run dev». Create a Telegram bot in minutes with this powerful Telegram Bot API framework (TypeScript/JavaScript).

    - - meta
      - name: "keywords"
        content: telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, quick start, setup guide, beginner guide, bot token, BotFather, npm init, bootstrapping project, bot development tutorial, create telegram bot fast, bot setup, starter template, bot project structure, command handling, first telegram bot
---

# Get Started

Create a new bot with GramIO in minutes. You should already have [Node.js](https://nodejs.org/), [Bun](https://bun.sh/) or [Deno](https://deno.com/) installed.

## Obtain your bot token

First, create a bot and get a `token`. You can do this using the [@BotFather](https://t.me/BotFather) bot.

Send him the `/newbot` command and follow the instructions until you receive a token like `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`.

## Create your bot project

There are two ways to create a bot project:

### Automatically

The easiest way is to use `create-gramio`.

::: code-group

```bash [npm]
npm create gramio bot-example
```

```bash [yarn]
yarn create gramio bot-example
```

```bash [pnpm]
pnpm create gramio bot-example
```

```bash [bun]
bunx create-gramio bot-example
```

:::

And then:

::: code-group

```bash [npm]
cd bot-example
npm run dev
```

```bash [yarn]
cd bot-example
yarn dev
```

```bash [pnpm]
cd bot-example
pnpm dev
```

```bash [bun]
cd bot-example
bun dev
```

:::

#### Supported environment

-   ORM/Query builders
-   -   [Prisma](https://www.prisma.io/)
-   -   [Drizzle](https://orm.drizzle.team/)
-   Linters
-   -   [Biome](https://biomejs.dev/)
-   -   [ESLint](https://eslint.org/) with some plugins
-   Plugins
-   -   [Scenes](https://gramio.dev/plugins/official/scenes.html)
-   -   [Session](https://gramio.dev/plugins/official/session.html)
-   -   [Autoload](https://gramio.dev/plugins/official/autoload.html)
-   -   [Prompt](https://gramio.dev/plugins/official/prompt.html)
-   -   [Auto-retry](https://gramio.dev/plugins/official/auto-retry.html)
-   -   [Media-cache](https://gramio.dev/plugins/official/media-cache.html)
-   -   [I18n](https://gramio.dev/plugins/official/i18n.html)
-   -   [Media-group](https://gramio.dev/plugins/official/media-group.html)
-   Others
-   -   [Dockerfile](https://www.docker.com/) + [docker-compose.yml](https://docs.docker.com/compose/)
-   -   [Jobify](https://github.com/kravetsone/jobify) ([Bullmq](https://docs.bullmq.io/) wrapper)
-   -   [Husky](https://typicode.github.io/husky/) (Git hooks)
-   -   [Fluent2ts](https://github.com/kravetsone/fluent2ts)
-   -   [GramIO storages](https://gramio.dev/storages/)
-   [Telegram apps](https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/create-mini-app)
-   [Elysia](https://elysiajs.com/) (by [create-elysiajs](https://github.com/kravetsone/create-elysiajs))

> The environment can work `together`
>
> When you select [ESLint](https://eslint.org/) and [Drizzle](https://orm.drizzle.team/), you get [eslint-plugin-drizzle](https://orm.drizzle.team/docs/eslint-plugin)

## Manually

To manually create a new bot with GramIO, install the package:

::: code-group

```bash [npm]
npm install gramio
```

```bash [yarn]
yarn add gramio
```

```bash [pnpm]
pnpm add gramio
```

```bash [bun]
bun install gramio
```

:::

Setup TypeScript:

::: code-group

```bash [npm]
npm install typescript -D
npx tsc --init
```

```bash [yarn]
yarn add typescript -D
yarn dlx tsc --init
```

```bash [pnpm]
pnpm add typescript -D
pnpm exec tsc --init
```

```bash [bun]
bun install typescript -D
bunx tsc --init
```

:::

create `src` folder with `index.ts` file and write something like:

::: code-group

```ts twoslash [Bun or Node.js]
import { Bot } from "gramio";

const bot = new Bot("") // put you token here
    .command("start", (context) => context.send("Hi!"))
    .onStart(console.log);

bot.start();
```

```ts [Deno]
import { Bot } from "jsr:@gramio/core";

const bot = new Bot("") // put you token here
    .command("start", (context) => context.send("Hi!"))
    .onStart(console.log);

bot.start();
```

:::

and run the bot with:

::: code-group

```bash [tsx]
npx tsx ./src/index.ts
```

```bash [bun]
bun ./src/index.ts
```

```bash [deno]
deno run --allow-net --allow-env ./src/index.ts
```

:::

Done! 🎉

Now you can interact with your Telegram bot.
