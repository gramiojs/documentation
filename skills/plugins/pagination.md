---
name: pagination
description: Paginated inline-keyboard menus — fluent `Pagination` builder handles data fetching, navigation buttons, page info, and item selection.
---

# Pagination (`@gramio/pagination`)

Fluent API for paginated inline keyboards. You supply a data function (`{ offset, limit } → items`) and the plugin handles the keyboard layout, prev/next/first/last buttons, page-info button, and per-item tap callbacks.

> **WIP:** API may change. Pin a minor version in production.

## Install

```bash
npm add @gramio/pagination
```

The package depends on `@gramio/callback-data`; add an override so the transitive version doesn't conflict with anything else in your tree:

```json
{
    "overrides": {
        "@gramio/callback-data": "^0.0.11"
    }
}
```

## Usage

```ts
import { Bot } from "gramio";
import { Pagination } from "@gramio/pagination";
import { paginationFor } from "@gramio/pagination/plugin";

type Item = { id: number; title: string };
const data: Item[] = [
    { id: 1, title: "Alpha" },
    { id: 2, title: "Beta" },
    { id: 3, title: "Gamma" },
    { id: 4, title: "Delta" },
    { id: 5, title: "Epsilon" },
];

const itemsPagination = new Pagination(
    "items",
    async ({ offset, limit }) => data.slice(offset, offset + limit)
)
    .count(() => Promise.resolve(data.length))
    .item((x) => ({ id: x.id, title: x.title }))
    .onSelect(({ id, context }) => {
        return context.editText(`Selected ${id}`, {
            reply_markup: context.message?.replyMarkup?.payload,
        });
    })
    .limit(2)
    .columns(2)
    .withFirstLastPage()
    .withPageInfo(
        ({ currentPage, totalPages }) => `${currentPage} / ${totalPages}`
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(paginationFor([itemsPagination]))
    .command("list", async (ctx) =>
        ctx.reply("Items", {
            reply_markup: await itemsPagination.getKeyboard(0),
        })
    );

bot.start();
```

## Builder methods

| Method | What it does |
|---|---|
| `new Pagination(name, dataFn)` | `name` = callback-data prefix (unique); `dataFn({ offset, limit })` returns one page |
| `.limit(n)` | Items per page (default 10) |
| `.columns(n)` | Grid width for item buttons |
| `.count(fn)` | Total count (runs in parallel with data fetch) — required for page info and first/last |
| `.item(fn)` | Map each item to `{ id, title }` — `title` is the button label |
| `.onSelect(cb)` | `({ id, context }) => …` — tap handler for item buttons |
| `.withPageInfo(format)` | Adds a page-info button; `format` builds its label |
| `.withFirstLastPage()` | Adds ⏮️/⏭️ first/last buttons |
| `.wrapKeyboard(fn)` | Post-process generated keyboard (e.g. append extra rows) |
| `.selectCallbackData(fn)` | Override the callback data used for item buttons |

## Getting a keyboard

```ts
const kb = await pagination.getKeyboard(0);

// With data + page metadata:
const { keyboard, data, pagination: meta } =
    await pagination.getKeyboardWithData(0);

// Data + metadata, no keyboard:
const { data, pagination: meta } =
    await pagination.getDataWithPaginationInfo(0);
```

## Two strategies

- **Without `.count()`** — plugin fetches `limit + 1` items per page to detect "has next". No total pages, no page-info button, no first/last.
- **With `.count()`** — count query runs in parallel with data. Enables `.withPageInfo()` and `.withFirstLastPage()`.

## Route registration

`paginationFor([...])` is the plugin that routes `callback_query` updates back to the right `Pagination` instance. Register every pagination you intend to use in one `paginationFor([...])` call:

```ts
bot.extend(paginationFor([usersPagination, ordersPagination]));
```

## Rules

- **Each `Pagination` name is global.** Two instances with the same `name` will collide on callback routing — pick distinct names per feature.
- **`.item({ title, id })` — nothing else.** `title` is a plain string (or `FormattableString`); `id` is serialized into callback data, so keep it small (number or short string).
- **Don't handwrite navigation callbacks.** Prev/next/first/last are wired by the plugin — overriding them manually bypasses `.onSelect` and breaks state.
- **Reuse the existing `reply_markup`** inside `onSelect` if you only want to update text (as in the example) — otherwise re-fetch via `pagination.getKeyboard(offset)` to keep the current page.
