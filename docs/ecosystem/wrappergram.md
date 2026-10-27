---
title: Wrappergram v2 - Telegram Bot API Wrapper
head:
    - - meta
      - name: "description"
        content: "Wrappergram v2 is a type-safe Telegram Bot API wrapper with middleware, opt-in files and formatting."
    - - meta
      - name: "keywords"
        content: "wrappergram v2, gramio, Telegram Bot API, TypeScript, middleware, Node.js, Bun, Deno"
---

# Wrappergram

<div class="badges">

[![npm](https://img.shields.io/npm/v/wrappergram)](https://www.npmjs.com/package/wrappergram)
[![JSR](https://jsr.io/badges/@gramio/wrappergram)](https://jsr.io/@gramio/wrappergram)

</div>

Wrappergram v2 is a tiny, type-safe Telegram Bot API wrapper for Node.js, Bun and Deno. The core sends JSON requests; uploads and formatting are opt-in middleware. For a full bot framework with routing and plugins, use [GramIO](https://gramio.dev).

## Installation

::: pm-add wrappergram
:::

## Quick start

```ts
import { Telegram } from "wrappergram";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is required");

const telegram = new Telegram(token);
const message = await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: "Hello, world!",
});
console.log(message.message_id);
```

Keep bot tokens on a trusted backend, never in browser bundles.

## API results and errors

Methods are available through `telegram.api` and return results directly, not `{ ok, result }`: `sendMessage` returns a message, `getMe` returns a user. Methods without required parameters can be called without arguments.

Failed Telegram responses throw `TelegramError` by default. It exposes `method`, `code`, `message`, `params` and `payload` (Telegram response parameters, such as `retry_after`). Pass `suppress: true` to return `TelegramError | Result` instead:

```ts
import { Telegram, TelegramError } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");
const result = await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: "Hello!",
    suppress: true,
});

if (result instanceof TelegramError) {
    console.error(result.method, result.code, result.message);
} else {
    console.log(result.message_id);
}
```

Network failures, aborts and invalid JSON still reject the promise with `suppress: true`. Catch those at your application's boundary. Do not log tokens or complete request parameters.

## Fetch options

```ts
import { Telegram } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN", {
    baseURL: "https://api.telegram.org/bot",
    fetchOptions: { headers: { "X-Custom-Header": "value" } },
});

const me = await telegram.api.getMe(undefined, {
    signal: AbortSignal.timeout(5000),
});
console.log(me.username);
```

`baseURL` defaults to `https://api.telegram.org/bot`; the token and method are appended automatically. `fetchOptions` sets global options; the second API-method argument overrides them per request. `method` and `body` are managed internally. Create timeout signals per request: a global signal stays aborted after its deadline.

## Middleware

Middleware receives mutable `context` (`method`, `params`, optional `formData`) and `next()`. Return the result of `next()`. You can mutate parameters before the request and handle results or errors afterward.

```ts
import { Telegram, type Middleware } from "wrappergram";

const timing: Middleware = async (context, next) => {
    const start = performance.now();
    try {
        return await next();
    } finally {
        console.log(context.method, performance.now() - start);
    }
};

const telegram = new Telegram("BOT_TOKEN", { middlewares: [timing] });
await telegram.api.getMe();
```

For `[a, b]`, execution is `a → b → fetch → b → a`. Setting `context.formData` makes the body multipart; remaining parameters go in the query string. Let fetch generate the multipart Content-Type boundary.

## File uploads

::: pm-add @gramio/files
:::

File helpers are no longer bundled or re-exported. Import them from `@gramio/files` and register `filesMiddleware`. Await asynchronous helpers such as `MediaUpload.path()` and `MediaUpload.url()`.

```ts
import { Telegram } from "wrappergram";
import { MediaInput, MediaUpload } from "@gramio/files";
import { filesMiddleware } from "@gramio/files/middleware";

const telegram = new Telegram("BOT_TOKEN", {
    middlewares: [filesMiddleware],
});

await telegram.api.sendPhoto({
    chat_id: "@gramio_forum",
    photo: await MediaUpload.path("./cute-cat.png"),
});

await telegram.api.sendDocument({
    chat_id: "@gramio_forum",
    document: MediaUpload.text("Hello world", "hello.txt"),
});

await telegram.api.sendMediaGroup({
    chat_id: "@gramio_forum",
    media: [
        MediaInput.document(await MediaUpload.path("./report.pdf")),
        MediaInput.document(MediaUpload.text("Summary", "summary.txt")),
    ],
});
```

With the middleware you can also pass `File`, `Blob` or `Bun.file()`. Telegram file IDs and URL strings need no middleware. See [Files](https://gramio.dev/files/overview).

## Formatting

::: pm-add @gramio/format
:::

When using both, register `formatMiddleware` before `filesMiddleware` so captions are converted before multipart serialization:

```ts
import { Telegram } from "wrappergram";
import { bold, format } from "@gramio/format";
import { formatMiddleware } from "@gramio/format/middleware";
import { filesMiddleware } from "@gramio/files/middleware";

const telegram = new Telegram("BOT_TOKEN", {
    middlewares: [formatMiddleware, filesMiddleware],
});

await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: format`Hello, ${bold("world")}!`,
});
```

Pass formatted values directly, without `.toString()` or `parse_mode`. Omit the files import and middleware if you only need formatting. See [Formatting](https://gramio.dev/formatting).

## Keyboards

::: pm-add @gramio/keyboards
:::

```ts
import { Telegram } from "wrappergram";
import { InlineKeyboard } from "@gramio/keyboards";

const telegram = new Telegram("BOT_TOKEN");
await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: "Source code",
    reply_markup: new InlineKeyboard().url(
        "GitHub",
        "https://github.com/gramiojs/wrappergram",
    ),
});
```

Keyboard builders need no additional middleware.

## Polling

```ts
import { Telegram, getUpdates } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");

for await (const update of getUpdates(telegram)) {
    if (update.message?.text) {
        await telegram.api.sendMessage({
            chat_id: update.message.chat.id,
            text: "Thanks for the message!",
        });
    }
}
```

Use one iterator per bot token. The helper tracks offsets in memory, skips Telegram API errors and propagates transport errors. It has no timeout, backoff or cancellation options. For controlled long polling, call `telegram.api.getUpdates({ offset, timeout: 30 }, { signal })` and manage offsets/retries yourself.

## Rate-limit retries

```ts
import { Telegram, withRetries } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");
const message = await withRetries(() =>
    telegram.api.sendMessage({ chat_id: "@gramio_forum", text: "Hello!" }),
);
console.log(message.message_id);
```

`withRetries` waits for `retry_after` (seconds) and retries thrown or suppressed `TelegramError` values. Other errors propagate. There is no retry limit or cancellation option. This is not a general network retry policy.

## Types

All Telegram Bot API types are re-exported from `@gramio/types` (`^10.3.1` in v2.0.0), alongside middleware and request-option types.

```ts
import type {
    TelegramMessage,
    TelegramUpdate,
    Middleware,
    MiddlewareContext,
    RequestOptions,
} from "wrappergram";
```

## Migration from v1

- Use results directly: `response.result.message_id` → `message.message_id`.
- Replace `response.ok` checks with `try/catch` or `suppress: true` + `instanceof TelegramError`.
- Rename `requestOptions` to `fetchOptions`.
- Import file helpers from `@gramio/files` and register `filesMiddleware`.
- Register `formatMiddleware` for `@gramio/format` values.
- The class remains `Telegram`: `new Telegram(token, options)`.

[Migration guide](https://gramio.dev/guides/upgrading#wrappergram-1-3-0-2-0-0).
