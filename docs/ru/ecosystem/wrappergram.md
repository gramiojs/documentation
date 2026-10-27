---
title: Wrappergram v2 - Обёртка Telegram Bot API
head:
    - - meta
      - name: "description"
        content: "Wrappergram v2 — типобезопасная обёртка Telegram Bot API с middleware, опциональными файлами и форматированием."
    - - meta
      - name: "keywords"
        content: "wrappergram v2, gramio, Telegram Bot API, TypeScript, middleware, Node.js, Bun, Deno"
---

# Wrappergram

<div class="badges">

[![npm](https://img.shields.io/npm/v/wrappergram)](https://www.npmjs.com/package/wrappergram)
[![JSR](https://jsr.io/badges/@gramio/wrappergram)](https://jsr.io/@gramio/wrappergram)

</div>

Wrappergram v2 — маленькая типобезопасная обёртка Telegram Bot API для Node.js, Bun и Deno. Ядро отправляет JSON-запросы; файлы и форматирование подключаются через middleware. Для полноценного фреймворка с маршрутизацией и плагинами используйте [GramIO](/ru/get-started).

## Установка

::: pm-add wrappergram
:::

## Быстрый старт

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

Не добавляйте токен бота в браузерный бандл. Обращайтесь к Telegram с доверенного сервера.

## Результаты API и ошибки

Методы доступны через `telegram.api` и возвращают результат напрямую, без `{ ok, result }`: `sendMessage` возвращает сообщение, `getMe` — пользователя. Методы без обязательных параметров можно вызывать без аргументов.

По умолчанию неуспешный ответ Telegram вызывает `TelegramError`. У него есть поля `method`, `code`, `message`, `params` и `payload` (параметры ответа Telegram, например `retry_after`). Для возврата `TelegramError | Result` вместо исключения передайте `suppress: true`:

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

Сетевые ошибки, отмена запроса и некорректный JSON по-прежнему отклоняют промис, даже с `suppress: true`. Обрабатывайте их на границе приложения. Не логируйте токены или полные параметры запросов.

## Настройки fetch

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

`baseURL` по умолчанию — `https://api.telegram.org/bot`; токен и метод добавляются автоматически. `fetchOptions` задаёт глобальные настройки; второй аргумент API-метода переопределяет их для запроса. `method` и `body` управляются библиотекой. Создавайте timeout-сигнал для каждого запроса: глобальный сигнал остаётся отменённым после истечения срока.

## Middleware

Middleware получает изменяемый `context` (`method`, `params`, опциональный `formData`) и функцию `next()`. Возвращайте результат `next()`. Можно менять параметры до запроса и обрабатывать результаты или ошибки после него.

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

Для `[a, b]` порядок — `a → b → fetch → b → a`. При установке `context.formData` тело становится multipart, оставшиеся параметры передаются в query string. Не задавайте multipart `Content-Type` вручную: fetch добавит boundary.

## Загрузка файлов

::: pm-add @gramio/files
:::

Хелперы больше не встроены и не реэкспортируются. Импортируйте их из `@gramio/files`, зарегистрируйте `filesMiddleware`. Асинхронные `MediaUpload.path()` и `MediaUpload.url()` нужно ожидать через `await`.

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

С middleware также можно передавать `File`, `Blob` или `Bun.file()`. Для Telegram `file_id` и URL-строк middleware не нужен. Подробнее: [Файлы](/ru/files/overview).

## Форматирование

::: pm-add @gramio/format
:::

При совместном использовании регистрируйте `formatMiddleware` перед `filesMiddleware`, чтобы преобразовать подписи до сериализации multipart:

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

Передавайте форматированные значения напрямую, без `.toString()` и `parse_mode`. Если нужно только форматирование, уберите импорт files и соответствующий middleware. Подробнее: [Форматирование](/ru/formatting).

## Клавиатуры

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

Конструкторы клавиатур не требуют дополнительных middleware.

## Получение обновлений

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

Используйте один итератор на токен бота. Хелпер хранит offset в памяти, пропускает ошибки Telegram API и передаёт транспортные ошибки вызывающему коду. Настроек timeout, задержки повторов и отмены нет. Для управляемого long polling вызывайте `telegram.api.getUpdates({ offset, timeout: 30 }, { signal })` самостоятельно и управляйте offset и повторами.

## Повторы при ограничениях Telegram

```ts
import { Telegram, withRetries } from "wrappergram";

const telegram = new Telegram("BOT_TOKEN");
const message = await withRetries(() =>
    telegram.api.sendMessage({ chat_id: "@gramio_forum", text: "Hello!" }),
);
console.log(message.message_id);
```

`withRetries` ожидает `retry_after` (в секундах) и повторяет запрос для выброшенных или возвращённых через suppress значений `TelegramError`. Остальные ошибки передаются вызывающему коду. Лимита повторов и опции отмены нет. Это не общая политика повторов сетевых запросов.

## Типы

Все типы Telegram Bot API реэкспортируются из `@gramio/types` (`^10.3.1` в версии 2.0.0), наряду с типами middleware и настроек запросов.

```ts
import type {
    TelegramMessage,
    TelegramUpdate,
    Middleware,
    MiddlewareContext,
    RequestOptions,
} from "wrappergram";
```

## Миграция с v1

- Читайте результат напрямую: `response.result.message_id` → `message.message_id`.
- Замените проверки `response.ok` на `try/catch` или `suppress: true` + `instanceof TelegramError`.
- Переименуйте `requestOptions` в `fetchOptions`.
- Импортируйте хелперы файлов из `@gramio/files` и подключите `filesMiddleware`.
- Подключите `formatMiddleware` для значений `@gramio/format`.
- Имя класса остаётся `Telegram`: `new Telegram(token, options)`.

[Руководство по миграции](/ru/guides/upgrading#wrappergram-1-3-0-2-0-0).
