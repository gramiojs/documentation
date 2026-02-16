---
title: Wrappergram - Lightweight Telegram Bot API Wrapper for TypeScript

head:
    - - meta
      - name: "description"
        content: "Wrappergram is a simple, tiny, code-generated Telegram Bot API wrapper for TypeScript. Type-safe, multi-runtime (Node.js, Bun, Deno), with file upload support."

    - - meta
      - name: "keywords"
        content: "Telegram Bot API wrapper, TypeScript Telegram client, lightweight bot API, wrappergram, gramio ecosystem, type-safe Telegram API, Telegram bot Node.js, Telegram bot Bun, Telegram bot Deno, sendMessage API, file upload Telegram, getUpdates long polling"
---

# Wrappergram

<div class="badges">

[![npm](https://img.shields.io/npm/v/wrappergram?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/wrappergram)
[![npm downloads](https://img.shields.io/npm/dw/wrappergram?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/wrappergram)
[![JSR](https://jsr.io/badges/@gramio/wrappergram)](https://jsr.io/@gramio/wrappergram)
[![JSR Score](https://jsr.io/badges/@gramio/wrappergram/score)](https://jsr.io/@gramio/wrappergram)

</div>

A simple, tiny, **code-generated** Telegram Bot API wrapper for TypeScript. Wrappergram provides a minimal, type-safe layer over the Telegram Bot API with file upload support. It is designed for lightweight use cases — browser, serverless environments, or situations where a full framework like [GramIO](/get-started) is overkill.

## Installation

::: code-group

```bash [npm]
npm install wrappergram
```

```bash [yarn]
yarn add wrappergram
```

```bash [pnpm]
pnpm add wrappergram
```

```bash [bun]
bun install wrappergram
```

:::

## Quick start

```ts
import { Telegram, getUpdates } from "wrappergram";

const telegram = new Telegram(process.env.BOT_TOKEN as string);

for await (const update of getUpdates(telegram)) {
    if (update.message?.from) {
        await telegram.api.sendMessage({
            chat_id: update.message.from.id,
            text: "Hi! Thanks for the message",
        });
    }
}
```

## API

### `Telegram` class

The main class. Every Telegram Bot API method is available through the type-safe `api` proxy.

```ts
import { Telegram } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");

// Methods with no required params
const me = await telegram.api.getMe();

// Methods with required params
const response = await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: "Hello, world!",
});

if (!response.ok) console.error("Something went wrong");
else console.log(`Message id: ${response.result.message_id}`);
```

The `api` property returns the **raw Telegram API response**:

```ts
// On success:
{ ok: true, result: T }

// On failure:
{ ok: false, error_code: number, description: string }
```

### Options

```ts
const telegram = new Telegram("BOT_TOKEN", {
    // Custom API server (default: "https://api.telegram.org/bot")
    baseURL: "https://my-custom-server.com/bot",

    // Custom fetch options
    requestOptions: {
        headers: { "X-Custom-Header": "value" },
        signal: AbortSignal.timeout(30000),
    },
});
```

### `getUpdates` — Long polling

An async generator for receiving updates via long polling.

```ts
import { Telegram, getUpdates } from "wrappergram";

const telegram = new Telegram(process.env.BOT_TOKEN as string);

for await (const update of getUpdates(telegram)) {
    console.log(update);
}
```

> [!WARNING]
> Use `getUpdates` only **once** in your code. Calling it multiple times causes duplicate `getUpdates` requests to the Telegram API.

## File uploads

Wrappergram re-exports `MediaUpload` and `MediaInput` from [`@gramio/files`](https://github.com/gramiojs/files) for file handling.

### `MediaUpload`

```ts
import { Telegram, MediaUpload } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");

// From local file path
await telegram.api.sendPhoto({
    chat_id: "@gramio_forum",
    photo: MediaUpload.path("./cute-cat.png"),
});

// From URL
await telegram.api.sendPhoto({
    chat_id: 123456,
    photo: MediaUpload.url("https://example.com/image.png"),
});

// From buffer
await telegram.api.sendDocument({
    chat_id: 123456,
    document: MediaUpload.buffer(myBuffer, "data.bin"),
});

// From text content
await telegram.api.sendDocument({
    chat_id: 123456,
    document: MediaUpload.text("Hello world", "hello.txt"),
});
```

### `MediaInput`

Use `MediaInput` for `sendMediaGroup` and similar methods:

```ts
import { Telegram, MediaInput, MediaUpload } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");

await telegram.api.sendMediaGroup({
    chat_id: 123456,
    media: [
        MediaInput.document(
            MediaUpload.url("https://example.com/file.pdf")
        ),
        MediaInput.document(MediaUpload.path("./package.json")),
    ],
});
```

## Keyboards

For inline and reply keyboards, install [`@gramio/keyboards`](https://github.com/gramiojs/keyboards):

```ts
import { Telegram } from "wrappergram";
import { InlineKeyboard } from "@gramio/keyboards";

const telegram = new Telegram("BOT_TOKEN");

await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: "Hello!",
    reply_markup: new InlineKeyboard().url(
        "GitHub",
        "https://github.com/gramiojs/wrappergram"
    ),
});
```

## Types

Wrappergram re-exports **all** Telegram Bot API types from [`@gramio/types`](https://github.com/gramiojs/types):

```ts
import type { TelegramMessage, TelegramUpdate } from "wrappergram";
```
