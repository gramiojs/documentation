---
title: Autoload Plugin for GramIO

head:
    - - meta
      - name: "description"
        content: "Autoload commands in runtime with autoload plugin"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, plugin, autoload, glob, fs"
---

# Autoload Plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/autoload?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/autoload)
[![JSR](https://jsr.io/badges/@gramio/autoload)](https://jsr.io/@gramio/autoload)
[![JSR Score](https://jsr.io/badges/@gramio/autoload/score)](https://jsr.io/@gramio/autoload)

</div>

Autoload commands plugin for GramIO with [`Bun.build`](#bun-build-usage) support.

### Installation

::: code-group

```bash [npm]
npm install @gramio/autoload
```

```bash [yarn]
yarn add @gramio/autoload
```

```bash [pnpm]
pnpm add @gramio/autoload
```

```bash [bun]
bun install @gramio/autoload
```

:::

## Usage

> [full example](https://github.com/gramiojs/autoload/tree/main/example)

## Register the plugin

<!-- prettier-ignore -->
```ts twoslash
// index.ts
import { Bot } from "gramio";
import { autoload } from "@gramio/autoload";

const bot = new Bot(process.env.TOKEN!)
    .extend(autoload())
    .onStart(console.log);

bot.start();

export type BotType = typeof bot;
```

## Create command

```ts
// commands/command.ts
import type { BotType } from "..";

export default (bot: BotType) =>
    bot.command("start", (context) => context.send("hello!"));
```

## Options

| Key       | Type                                                          | Default                    | Description                                                         |
| --------- | ------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------- |
| pattern?  | string                                                        | "\*\*\/\*.{ts,js,cjs,mjs}" | [Glob patterns](<https://en.wikipedia.org/wiki/Glob_(programming)>) |
| path?     | string                                                        | "./commands"               | the path to the folder                                              |
| onLoad?   | (params: { absolute: string; relative: string }) => unknown   |                            | the hook that is called when loading a file                         |
| onFinish? | (paths: { absolute: string; relative: string }[]) => unknown; |                            | the hook that is called after loading all files                     |

and other [glob package options](https://www.npmjs.com/package/glob#options)

### [Bun build](https://bun.sh/docs/bundler) usage

You can use this plugin with [`Bun.build`](https://bun.sh/docs/bundler), thanks to [esbuild-plugin-autoload](https://github.com/kravetsone/esbuild-plugin-autoload)!

```ts
// @filename: build.ts
import { autoload } from "esbuild-plugin-autoload"; // default import also supported

await Bun.build({
    entrypoints: ["src/index.ts"],
    target: "bun",
    outdir: "out",
    plugins: [autoload("./src/commands")],
}).then(console.log);
```

Then, build it with `bun build.ts` and run with `bun out/index.ts`.

### [Bun compile](https://bun.sh/docs/bundler/executables) usage

You can bundle and then compile it into a [single executable binary file](https://bun.sh/docs/bundler/executables)

```ts
import { autoload } from "esbuild-plugin-autoload"; // default import also supported

await Bun.build({
    entrypoints: ["src/index.ts"],
    target: "bun",
    outdir: "out",
    plugins: [autoload("./src/commands")],
}).then(console.log);

await Bun.$`bun build --compile out/index.js`;
```

> [!WARNING]
> You cannot use it in `bun build --compile` mode without extra step ([Feature issue](https://github.com/oven-sh/bun/issues/11895))

[Read more](https://github.com/kravetsone/esbuild-plugin-autoload)
