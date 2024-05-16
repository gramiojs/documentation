---
head:
    - - meta
      - property: "title"
        content: Get started in GramIO - Powerful Telegram Bot API framework for TypeScript/JavaScript

    - - meta
      - name: "description"
        content: GramIO is a TypeScript/JavaScript framework for building Telegram bots. To start, bootstrap a new project with "npx create gramio bot-dir" and start the development with "npm run dev". This is all it needs to do a quick start or get started with GramIO.
---

# Get started

Create new bot with GramIO in minutes. You should already have [Node.js](https://nodejs.org/), [Bun](https://bun.sh/) or [Deno](https://deno.com/) installed.

## Obtain your bot token

First, create a bot and get a `token`. You can do this using the [@BotFather](https://t.me/BotFather) bot.

Send the command `/newbot` and follow the instructions until you receive a token like `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`.

## Scaffolding the project

This command will help you create a project with GramIO the easiest way.

::: code-group

```bash [npm]
npm create gramio ./bot
```

```bash [yarn]
yarn create gramio ./bot
```

```bash [pnpm]
pnpm create gramio ./bot
```

```bash [bun]
bun create gramio ./bot
```

```bash [deno]
TODO://
```

:::

#### Supported environment

-   Linters
-   -   [Biome](https://biomejs.dev/)
-   -   [ESLint](https://eslint.org/) with some plugins
-   ORM/Query builders
-   -   [Prisma](https://www.prisma.io/)
-   -   [Drizzle](https://orm.drizzle.team/)
-   Plugins
-   -   [Session](https://gramio.dev/plugins/official/session.html)
-   -   [Autoload](https://gramio.dev/plugins/official/autoload.html)
-   -   [Prompt](https://gramio.dev/plugins/official/prompt.html)
-   -   [Auto-retry](https://gramio.dev/plugins/official/auto-retry.html)
-   -   [Media-cache](https://gramio.dev/plugins/official/media-cache.html)
-   -   [I18n](https://gramio.dev/plugins/official/i18n.html)
-   -   [Media-group](https://gramio.dev/plugins/official/media-group.html)
-   Others
-   -   [Husky](https://typicode.github.io/husky/) (Git hooks)
-   -   [Fluent2ts](https://github.com/kravetsone/fluent2ts)

> The environment can work `together`
>
> When you select [ESLint](https://eslint.org/) and [Drizzle](https://orm.drizzle.team/), you get [eslint-plugin-drizzle](https://orm.drizzle.team/docs/eslint-plugin)

## Manual installation

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
deno run --allow-net ./src/index.ts
```

:::

Done! 🎉

Now you can interact with your Telegram bot.
