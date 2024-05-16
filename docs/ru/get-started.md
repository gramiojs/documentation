---
head:
    - - meta
      - property: "title"
        content: GramIO - Telegram Bot API фреймворк для TypeScript/JavaScript

    - - meta
      - name: "description"
        content: GramIO это TypeScript/JavaScript фреймворк для создания Телеграм ботов. Чтобы начать, вы можете ввести в консоль "npx create gramio bot-dir" и запустить своего бота с помощью "npm run dev". Это всё что вам нужно чтобы начать работать с GramIO.
---

# Давайте начнём!

Создайте своего бота с GramIO за пару минут. У вас уже должен быть установлен [Node.js](https://nodejs.org/), [Bun](https://bun.sh/) или [Deno](https://deno.com/).

## Получение токена бота

Для начала, создайте своего бота и получите `токен`. Вы можете сделать это воспользовавшись ботом [@BotFather](https://t.me/BotFather).

Отправьте ему команду `/newbot` и следуйте инструкциям пока вы не получите токен вида `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`.

## Развертывание проекта

Эта команда поможет вам создать ваш проект с GramIO наилегчайшим путём.

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

#### Поддерживаемое окружение

-   Линтеры
-   -   [Biome](https://biomejs.dev/)
-   -   [ESLint](https://eslint.org/) with some plugins
-   ORM/Query builders
-   -   [Prisma](https://www.prisma.io/)
-   -   [Drizzle](https://orm.drizzle.team/)
-   Плагины
-   -   [Session](https://gramio.dev/plugins/official/session.html)
-   -   [Media-cache](https://gramio.dev/plugins/official/media-cache.html)
-   -   [Autoload](https://gramio.dev/plugins/official/autoload.html)
-   -   [I18n](https://gramio.dev/plugins/official/i18n.html) ([Fluent](https://projectfluent.org/))
-   -   [Prompt](https://gramio.dev/plugins/official/prompt.html)
-   -   [Auto-retry](https://gramio.dev/plugins/official/auto-retry.html)
-   Others
-   -   [Husky](https://typicode.github.io/husky/) (Git hooks)

> Окружение может работать `вместе`
>
> Когда вы выбираете [ESLint](https://eslint.org/) и [Drizzle](https://orm.drizzle.team/), вы получаете [eslint-plugin-drizzle](https://orm.drizzle.team/docs/eslint-plugin)

## Ручная установка

Чтобы вручную создать нового бота с GramIO, вам нужно установить пакет:

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

Установить и настроить TypeScript:

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

Создать папку `src` в котором создать файл `index.ts` и написать в нём что-то типа:

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

затем, запустить вашего бота с помощью команды:

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

Всё! 🎉

Теперь вы можете взаимодействовать с вашим Телеграм ботом!
