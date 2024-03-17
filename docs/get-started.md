# Get started

Create new bot with GramIO in minutes. You should already have [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) installed.

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

:::

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

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("") // put you token here
    .command("start", (context) => context.send("Hi!"))
    .onStart(console.log);

bot.start();
```

and run the bot with:

::: code-group

```bash [tsx]
npx tsx ./src/index.ts
```

```bash [bun]
bun ./src/index.ts
```

:::

Done! 🎉

Now you can interact with your Telegram bot.
