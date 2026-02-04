---
title: Как написать свой плагин для GramIO - Руководство по созданию плагинов

head:
    - - meta
      - name: "description"
        content: Подробное руководство по созданию собственных плагинов для фреймворка GramIO. Узнайте, как расширить функциональность вашего Telegram бота с помощью плагинов.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, разработка плагинов, создание плагинов GramIO, API плагинов, расширение функциональности бота, типобезопасные плагины, NPM пакеты для ботов, derive в плагинах, обработка ошибок плагинов, публикация плагинов, Plugin API
---

# Как написать плагин

Бывает, что вам чего-то не хватает... И плагины могут помочь вам с этим!

# Пример

```ts twoslash
import { Plugin, Bot } from "gramio";

export class PluginError extends Error {
    wow: "type" | "safe" = "type";
}

const plugin = new Plugin("gramio-example")
    .error("PLUGIN", PluginError)
    .derive(() => {
        return {
            some: ["derived", "props"] as const,
        };
    });

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(plugin)
    .onError(({ context, kind, error }) => {
        if (context.is("message") && kind === "PLUGIN") {
            console.log(error.wow);
            //                 ^?
        }
    })
    .use((context) => {
        console.log(context.some);
        //                  ^^^^
    });
```

## Создание плагина

Эта команда поможет вам создать плагин с GramIO самым простым способом.

::: code-group

```bash [npm]
npm create gramio-plugin ./plugin
```

```bash [yarn]
yarn create gramio-plugin ./plugin
```

```bash [pnpm]
pnpm create gramio-plugin ./plugin
```

```bash [bun]
bun create gramio-plugin ./plugin
```

:::

## Поддерживаемые инструменты

#### Линтеры

- [Biome](https://biomejs.dev/)
- [ESLint](https://eslint.org/) (с некоторыми плагинами)

#### Хранилища

- [Storage](https://gramio.dev/storages/)

#### Остальное

- [Husky](https://typicode.github.io/husky/) (Гит хуки)