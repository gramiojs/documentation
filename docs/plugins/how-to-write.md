---
title: Creating Custom Plugins for GramIO - Extend Your Telegram Bot

head:
    - - meta
      - name: "description"
        content: "Learn how to write your own custom plugins for GramIO. Extend your Telegram bot's functionality with reusable modules, custom error types, and middleware components."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, custom plugins, plugin development, extend bot functionality, middleware, custom error types, reusable code, bot modules, plugin architecture, derived properties, plugin API, create bot extensions"
---

# How to Write a Plugin

It happens that you are missing something... And plugins can help you with this!

# Example

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

## Scaffolding the plugin

This command will help you create a plugin with GramIO the easiest way.

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

#### Supported environment

-   Linters
-   -   [Biome](https://biomejs.dev/)
-   -   [ESLint](https://eslint.org/) with some plugins
-   [Storage](https://gramio.dev/storages/)
-   Others
-   -   [Husky](https://typicode.github.io/husky/) (Git hooks)
