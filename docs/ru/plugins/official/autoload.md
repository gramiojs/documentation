---
title: Плагин автозагрузки для GramIO

head:
    - - meta
      - name: "description"
        content: "Автозагрузка команд во время выполнения с помощью плагина autoload"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин автозагрузки, динамическая загрузка команд, модульная архитектура бота, glob шаблоны, автозагрузка модулей, структура каталогов, Bun.build, esbuild-plugin-autoload, горячая перезагрузка, picomatch, модульная разработка бота, динамический импорт"
---

# Плагин автозагрузки

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/autoload?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/autoload)
[![JSR](https://jsr.io/badges/@gramio/autoload)](https://jsr.io/@gramio/autoload)
[![JSR Score](https://jsr.io/badges/@gramio/autoload/score)](https://jsr.io/@gramio/autoload)

</div>

Плагин автозагрузки команд для GramIO с поддержкой [`Bun.build`](#использование-bun-build).

### Установка

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

## Использование

> [полный пример](https://github.com/gramiojs/autoload/tree/main/example)

> [!IMPORTANT]
> Пожалуйста, прочитайте о [Ленивой загрузке плагинов](https://gramio.dev/ru/plugins/official/autoload.html)

## Регистрация плагина

<!-- prettier-ignore -->
```ts twoslash
// index.ts
import { Bot } from "gramio";
import { autoload } from "@gramio/autoload";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(await autoload())
    .onStart(console.log);

bot.start();

export type BotType = typeof bot;
```

## Создание команды

```ts
// commands/command.ts
import type { BotType } from "..";

export default (bot: BotType) =>
    bot.command("start", (context) => context.send("привет!"));
```

## Опции

| Ключ              | Тип                                                                                                | По умолчанию               | Описание                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------ |
| pattern?          | string \| string[]                                                                                 | "\*\*\/\*.{ts,js,cjs,mjs}" | [Шаблоны Glob](<https://en.wikipedia.org/wiki/Glob_(programming)>)       |
| path?             | string                                                                                             | "./commands"               | Путь к папке                                                             |
| import?           | string \| (file: any) => string                                                                    | "default"                  | Импорт конкретного `export` из файла                                     |
| failGlob?         | boolean                                                                                            | true                       | Бросать ошибку, если не найдены совпадения                               |
| skipImportErrors? | boolean                                                                                            | false                      | Пропускать импорты, где нужный `export` не определён                     |
| onLoad?           | (params: { absolute: string; relative: string }) => unknown                                        |                            | Хук, вызываемый при загрузке файла                                       |
| onFinish?         | (paths: { absolute: string; relative: string }[]) => unknown;                                      |                            | Хук, вызываемый после загрузки всех файлов                               |
| fdir?             | [Options](https://github.com/thecodrr/fdir/blob/HEAD/documentation.md#method-chaining-alternative) |                            | Настройки для [fdir](https://github.com/thecodrr/fdir)                   |
| picomatch?        | [PicomatchOptions](https://github.com/micromatch/picomatch?tab=readme-ov-file#picomatch-options)   |                            | Настройки для [picomatch](https://www.npmjs.com/package/picomatch)       |

### Использование [Bun build](https://bun.sh/docs/bundler)

Вы можете использовать этот плагин с [`Bun.build`](https://bun.sh/docs/bundler) благодаря [esbuild-plugin-autoload](https://github.com/kravetsone/esbuild-plugin-autoload)!

```ts
// @filename: build.ts
import { autoload } from "esbuild-plugin-autoload"; // также поддерживается импорт по умолчанию

await Bun.build({
    entrypoints: ["src/index.ts"],
    target: "bun",
    outdir: "out",
    plugins: [autoload("./src/commands")],
}).then(console.log);
```

Затем соберите с помощью `bun build.ts` и запустите с помощью `bun out/index.ts`.

### Использование [Bun compile](https://bun.sh/docs/bundler/executables)

Вы можете собрать, а затем скомпилировать в [единый исполняемый бинарный файл](https://bun.sh/docs/bundler/executables)

```ts
import { autoload } from "esbuild-plugin-autoload"; // также поддерживается импорт по умолчанию

await Bun.build({
    entrypoints: ["src/index.ts"],
    target: "bun",
    outdir: "out",
    plugins: [autoload("./src/commands")],
}).then(console.log);

await Bun.$`bun build --compile out/index.js`;
```

> [!WARNING]
> Вы не можете использовать это в режиме `bun build --compile` без дополнительного шага ([Issue с функционалом](https://github.com/oven-sh/bun/issues/11895))

[Узнать больше](https://github.com/kravetsone/esbuild-plugin-autoload) 