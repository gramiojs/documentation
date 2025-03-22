---
title: Начало работы с GramIO - Мощный Telegram Bot API фреймворк для создания ботов Telegram на TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: GramIO - фреймворк на TypeScript/JavaScript для создания ботов Telegram, работающий на Node.js, Bun и Deno. Создайте бота с помощью «npx create gramio mybot» и запустите бота с помощью «npm run dev».

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, Grammy, Telegraf, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, как создать бота, создание бота, создание бота в Telegram, создание бота в Telegram на TypeScript, создание бота в Telegram на JavaScript, создание бота в Telegram на Node.JS, создание бота в Telegram на Nodejs, создание бота в Telegram на Deno, создание бота в Telegram на Bun
---

# Начало работы

Создайте нового бота с GramIO за считанные минуты. У вас уже должны быть установлены [Node.js](https://nodejs.org/), [Bun](https://bun.sh/) или [Deno](https://deno.com/).

## Получите токен бота

Сначала создайте бота и получите `токен`. Вы можете сделать это с помощью бота [@BotFather](https://t.me/BotFather).

Отправьте команду `/newbot` и следуйте инструкциям, пока не получите токен вида `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`.

## Создание проекта

Эта команда поможет вам создать проект с GramIO самым простым способом.

::: code-group

```bash [npm]
npm create gramio@latest ./bot
```

```bash [yarn]
yarn create gramio@latest ./bot
```

```bash [pnpm]
pnpm create gramio@latest ./bot
```

```bash [bun]
bun create gramio@latest ./bot
```

```bash [deno]
TODO:// Deno поддерживается, но не в генераторе проектов
```

:::

#### Поддерживаемые инструменты

-   ORM/Построители запросов
-   -   [Prisma](https://www.prisma.io/)
-   -   [Drizzle](https://orm.drizzle.team/)
-   Линтеры
-   -   [Biome](https://biomejs.dev/)
-   -   [ESLint](https://eslint.org/) с дополнительными плагинами
-   Плагины
-   -   [Scenes](https://gramio.dev/ru/plugins/official/scenes.html)
-   -   [Session](https://gramio.dev/ru/plugins/official/session.html)
-   -   [Autoload](https://gramio.dev/ru/plugins/official/autoload.html)
-   -   [Prompt](https://gramio.dev/ru/plugins/official/prompt.html)
-   -   [Auto-retry](https://gramio.dev/ru/plugins/official/auto-retry.html)
-   -   [Media-cache](https://gramio.dev/ru/plugins/official/media-cache.html)
-   -   [I18n](https://gramio.dev/ru/plugins/official/i18n.html)
-   -   [Media-group](https://gramio.dev/ru/plugins/official/media-group.html)
-   Другое
-   -   [Dockerfile](https://www.docker.com/) + [docker-compose.yml](https://docs.docker.com/compose/)
-   -   [Jobify](https://github.com/kravetsone/jobify) (обертка для [Bullmq](https://docs.bullmq.io/))
-   -   [Husky](https://typicode.github.io/husky/) (Git-хуки)
-   -   [Fluent2ts](https://github.com/kravetsone/fluent2ts)
-   -   [GramIO storages](https://gramio.dev/ru/storages/)
-   [Telegram apps](https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/create-mini-app)
-   [Elysia](https://elysiajs.com/) (через [create-elysiajs](https://github.com/kravetsone/create-elysiajs))

> Инструменты могут работать `вместе`
>
> Когда вы выбираете [ESLint](https://eslint.org/) и [Drizzle](https://orm.drizzle.team/), вы получаете [eslint-plugin-drizzle](https://orm.drizzle.team/docs/eslint-plugin)

## Ручная установка

Чтобы вручную создать нового бота с GramIO, установите пакет:

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

Настройте TypeScript:

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

Создайте папку `src` с файлом `index.ts` и напишите что-то вроде:

::: code-group

```ts twoslash [Bun или Node.js]
import { Bot } from "gramio";

const bot = new Bot("") // укажите ваш токен здесь
    .command("start", (context) => context.send("Привет!"))
    .onStart(console.log);

bot.start();
```

```ts [Deno]
import { Bot } from "jsr:@gramio/core";

const bot = new Bot("") // укажите ваш токен здесь
    .command("start", (context) => context.send("Привет!"))
    .onStart(console.log);

bot.start();
```

:::

И запустите бота с помощью:

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

Готово! 🎉

Теперь вы можете взаимодействовать со своим ботом Telegram. 