---
title: Pagination Plugin for GramIO - Paginated Inline Keyboards for Telegram Bots

head:
    - - meta
      - name: "description"
        content: "Create paginated inline keyboard menus in Telegram bots with GramIO Pagination plugin. Fluent API for data pagination, navigation buttons, page info, and item selection."

    - - meta
      - name: "keywords"
        content: "Telegram bot pagination, inline keyboard pagination, paginated menu GramIO, Telegram bot list navigation, callback query pagination, page navigation buttons, telegram bot data browsing, GramIO plugins, pagination plugin, inline keyboard pages"
---

# Pagination

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/pagination?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/pagination)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/pagination?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/pagination)
[![JSR](https://jsr.io/badges/@gramio/pagination)](https://jsr.io/@gramio/pagination)
[![JSR Score](https://jsr.io/badges/@gramio/pagination/score)](https://jsr.io/@gramio/pagination)

</div>

A fluent, chainable API for creating **paginated inline keyboard menus** in Telegram bots. Handles data fetching, keyboard generation, navigation buttons, page info, and item selection callbacks.

> [!WARNING]
> This package is in WIP stage — the API may change.

## Installation

::: code-group

```bash [npm]
npm install @gramio/pagination
```

```bash [yarn]
yarn add @gramio/pagination
```

```bash [pnpm]
pnpm add @gramio/pagination
```

```bash [bun]
bun install @gramio/pagination
```

:::

> [!IMPORTANT]
> You must override `@gramio/callback-data` version in your `package.json`:
>
> ```json
> {
>     "overrides": {
>         "@gramio/callback-data": "^0.0.11"
>     }
> }
> ```

## Usage

```ts
import { Bot } from "gramio";
import { Pagination } from "@gramio/pagination";
import { paginationFor } from "@gramio/pagination/plugin";

const data = [
    { id: 1, title: "test" },
    { id: 2, title: "test2" },
    { id: 3, title: "test3" },
    { id: 4, title: "test4" },
    { id: 5, title: "test5" },
];

const paginationTest = new Pagination("test", async ({ offset, limit }) => {
    return data.slice(offset, offset + limit);
})
    .count(() => Promise.resolve(data.length))
    .item((x) => ({
        title: x.title,
        id: x.id,
    }))
    .onSelect(({ id, context }) => {
        return context.editText(`Selected ${id}`, {
            reply_markup: context.message?.replyMarkup?.payload,
        });
    })
    .limit(2)
    .columns(2)
    .withFirstLastPage()
    .withPageInfo(
        ({ totalPages, currentPage }) => `${currentPage} / ${totalPages}`
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(paginationFor([paginationTest]))
    .command("start", async (ctx) =>
        ctx.reply("Hello", {
            reply_markup: await paginationTest.getKeyboard(0),
        })
    )
    .onStart(console.log);

await bot.start();
```

## API

### `new Pagination(name, dataFunction)`

Create a pagination instance.

- `name` — unique identifier (used as callback data prefix)
- `dataFunction` — `async ({ offset, limit }) => Data[]` — fetches one page of items

### Chainable methods

| Method | Description |
|---|---|
| `.limit(count)` | Items per page (default: `10`) |
| `.columns(count)` | Button columns in the keyboard grid |
| `.count(func)` | `async () => number` — total item count for full page info |
| `.item(func)` | `(data) => { title, id }` — map each item to a button |
| `.onSelect(callback)` | `({ id, context }) => void` — handler for item button taps |
| `.withPageInfo(format)` | `({ totalPages, currentPage }) => string` — page info button text |
| `.withFirstLastPage()` | Add ⏮️/⏭️ first/last page buttons |
| `.wrapKeyboard(func)` | Post-process the keyboard to add extra buttons |
| `.selectCallbackData(func)` | Override callback data for selection buttons |

### Getting the keyboard

```ts
// Get just the keyboard
const keyboard = await pagination.getKeyboard(offset);

// Get keyboard + fetched data + pagination info
const { keyboard, data, pagination: info } = await pagination.getKeyboardWithData(offset);

// Get data + pagination info without keyboard
const { data, pagination: info } = await pagination.getDataWithPaginationInfo(offset);
```

### `paginationFor(paginationList)`

GramIO plugin that routes `callback_query` events to the correct `Pagination` instance.

```ts
import { paginationFor } from "@gramio/pagination/plugin";

const bot = new Bot("")
    .extend(paginationFor([pagination1, pagination2]));
```

## Pagination strategies

### Without `.count()` (limit+1)

Fetches `limit + 1` items to detect if there's a next page. No total pages or current page info.

### With `.count()`

Runs count and data queries **in parallel**. Enables `.withPageInfo()` and `.withFirstLastPage()` features.

## Navigation buttons

| Button | Condition |
|---|---|
| ⏮️ First page | `.withFirstLastPage()` + has previous |
| ⬅️ Previous | has previous page |
| Page info | `.withPageInfo()` + `.count()` set |
| ➡️ Next | has next page |
| ⏭️ Last page | `.withFirstLastPage()` + has next |
