---
title: Wrappergram - Лёгкая обёртка Telegram Bot API для TypeScript

head:
    - - meta
      - name: "description"
        content: "Wrappergram — простая, минималистичная обёртка Telegram Bot API для TypeScript. Типобезопасная, мультирантаймовая (Node.js, Bun, Deno), с поддержкой загрузки файлов."

    - - meta
      - name: "keywords"
        content: "Telegram Bot API обёртка, TypeScript Telegram клиент, лёгкий bot API, wrappergram, gramio экосистема, типобезопасный Telegram API, Telegram бот Node.js, Telegram бот Bun, Telegram бот Deno, sendMessage API, загрузка файлов Telegram, getUpdates long polling"
---

# Wrappergram

<div class="badges">

[![npm](https://img.shields.io/npm/v/wrappergram?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/wrappergram)
[![npm downloads](https://img.shields.io/npm/dw/wrappergram?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/wrappergram)
[![JSR](https://jsr.io/badges/@gramio/wrappergram)](https://jsr.io/@gramio/wrappergram)
[![JSR Score](https://jsr.io/badges/@gramio/wrappergram/score)](https://jsr.io/@gramio/wrappergram)

</div>

Простая, минималистичная, **кодогенерируемая** обёртка Telegram Bot API для TypeScript. Wrappergram предоставляет минимальный, типобезопасный слой над Telegram Bot API с поддержкой загрузки файлов. Предназначен для лёгких сценариев — браузер, serverless-среды, или ситуации, где полноценный фреймворк вроде [GramIO](/ru/get-started) избыточен.

## Установка

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

## Быстрый старт

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

### Класс `Telegram`

Основной класс. Каждый метод Telegram Bot API доступен через типобезопасный прокси `api`.

```ts
import { Telegram } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");

// Методы без обязательных параметров
const me = await telegram.api.getMe();

// Методы с обязательными параметрами
const response = await telegram.api.sendMessage({
    chat_id: "@gramio_forum",
    text: "Hello, world!",
});

if (!response.ok) console.error("Something went wrong");
else console.log(`Message id: ${response.result.message_id}`);
```

Свойство `api` возвращает **сырой ответ Telegram API**:

```ts
// Успех:
{ ok: true, result: T }

// Ошибка:
{ ok: false, error_code: number, description: string }
```

### Параметры

```ts
const telegram = new Telegram("BOT_TOKEN", {
    // Свой API-сервер (по умолчанию: "https://api.telegram.org/bot")
    baseURL: "https://my-custom-server.com/bot",

    // Свои параметры fetch
    requestOptions: {
        headers: { "X-Custom-Header": "value" },
        signal: AbortSignal.timeout(30000),
    },
});
```

### `getUpdates` — Long polling

Асинхронный генератор для получения обновлений через long polling.

```ts
import { Telegram, getUpdates } from "wrappergram";

const telegram = new Telegram(process.env.BOT_TOKEN as string);

for await (const update of getUpdates(telegram)) {
    console.log(update);
}
```

> [!WARNING]
> Используйте `getUpdates` только **один раз** в коде. Множественные вызовы приводят к дублированию запросов `getUpdates` к Telegram API.

## Загрузка файлов

Wrappergram реэкспортирует `MediaUpload` и `MediaInput` из [`@gramio/files`](https://github.com/gramiojs/files) для работы с файлами.

### `MediaUpload`

```ts
import { Telegram, MediaUpload } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");

// Из локального файла
await telegram.api.sendPhoto({
    chat_id: "@gramio_forum",
    photo: MediaUpload.path("./cute-cat.png"),
});

// Из URL
await telegram.api.sendPhoto({
    chat_id: 123456,
    photo: MediaUpload.url("https://example.com/image.png"),
});

// Из буфера
await telegram.api.sendDocument({
    chat_id: 123456,
    document: MediaUpload.buffer(myBuffer, "data.bin"),
});

// Из текстового содержимого
await telegram.api.sendDocument({
    chat_id: 123456,
    document: MediaUpload.text("Hello world", "hello.txt"),
});
```

### `MediaInput`

Используйте `MediaInput` для `sendMediaGroup` и подобных методов:

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

## Клавиатуры

Для inline и reply клавиатур установите [`@gramio/keyboards`](https://github.com/gramiojs/keyboards):

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

## Типы

Wrappergram реэкспортирует **все** типы Telegram Bot API из [`@gramio/types`](https://github.com/gramiojs/types):

```ts
import type { TelegramMessage, TelegramUpdate } from "wrappergram";
```
