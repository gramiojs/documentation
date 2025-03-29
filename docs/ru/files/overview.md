---
title: Отправка файлов - Полное руководство по передаче файлов

head:
    - - meta
      - name: "description"
        content: "Узнайте, как отправлять файлы в Telegram Bot API с помощью GramIO. Это руководство охватывает все методы: отправку по file_id, URL или загрузку новых файлов с правильной обработкой."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, загрузка файлов, отправка файлов, работа с файлами, file_id, URL файлы, вложения, Bun.file, FileSystemPath, InputFile, MediaInput, MediaUpload, Buffer, ReadStream, form-data, multipart/form-data, sendPhoto, sendVideo, sendDocument"
---

# Обзор

[`@gramio/files`](https://github.com/gramiojs/files) - это встроенный пакет GramIO. Вы также можете использовать его вне этого фреймворка, так как он не зависит от него.

## Использование

```ts twoslash
// @errors: 2345
import { Bot, MediaInput, MediaUpload, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_BOT_TOKEN as string)
    .on("message", async (ctx) => {
        ctx.sendMediaGroup([
            MediaInput.document(
                await MediaUpload.url(
                    "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
                )
            ),
            MediaInput.document(await MediaUpload.path("./package.json")),
        ]);
    })
    .onStart(console.log);

bot.start();
```

## Отправка файлов

Существует три способа отправки файлов (фотографий, стикеров, аудио, медиа и т.д.):

1. Если файл уже хранится на серверах Telegram, вам не нужно загружать его повторно: каждый файловый объект имеет поле file_id, просто передайте этот file_id в качестве параметра вместо загрузки. Для файлов, отправляемых таким способом, ограничений нет.

> [!TIP]
> Вам может быть полезно использовать [media-cache](/ru/plugins/official/media-cache) плагин для кэширования file_id со стороны фреймворка.

2. Предоставьте Telegram HTTP URL для отправляемого файла. Telegram загрузит и отправит файл. Максимальный размер 5 МБ для фотографий и 20 МБ для других типов контента.
3. Отправьте файл, используя multipart/form-data обычным способом, которым файлы загружаются через браузер. Максимальный размер 10 МБ для фотографий, 50 МБ для других файлов (если TelegramBotAPI = `api.telegram.org`).

### Отправка по `file_id`

-   Невозможно изменить тип файла при повторной отправке по file_id. То есть видео нельзя отправить как фото, фото нельзя отправить как документ и т.д.
-   Невозможно повторно отправить миниатюры.
-   Повторная отправка фотографии по file_id отправит все ее размеры.
-   file_id уникален для каждого отдельного бота и не может быть передан от одного бота другому.
-   file_id однозначно идентифицирует файл, но файл может иметь разные действительные file_id даже для одного и того же бота.

Чтобы отправить файл по `file_id` с помощью GramIO, вы можете указать его `как есть`.

```ts twoslash
import { BotLike, MessageContext } from "gramio";

const fileId = "" as string;
const ctx = {} as InstanceType<MessageContext<BotLike>>;

// ---cut---
ctx.sendPhoto(fileId);
```

### Отправка по `URL`

-   При отправке по URL целевой файл должен иметь правильный MIME-тип (например, audio/mpeg для sendAudio и т.д.).
-   В sendDocument отправка по URL в настоящее время работает только для файлов GIF, PDF и ZIP.
-   Чтобы использовать sendVoice, файл должен иметь тип audio/ogg и размер не более 1 МБ. Голосовые заметки размером 1-20 МБ будут отправлены как файлы.

Чтобы отправить файл по `URL` с помощью GramIO, вы можете указать его `как есть`.

```ts twoslash
import { BotLike, MessageContext } from "gramio";

const ctx = {} as InstanceType<MessageContext<BotLike>>;

// ---cut---
ctx.sendPhoto("https://.../cute-cat.png");
```

### Загрузка файлов

Для загрузки и отправки файла вы можете использовать вспомогательный класс [`Media Upload`](/ru/files/media-upload.html), и GramIO сделает всю работу за вас.

```ts twoslash
// @errors: 2345
import { MediaUpload } from "@gramio/files";
import { BotLike, MessageContext } from "gramio";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
ctx.sendPhoto(await MediaUpload.path("../cute-cat.png"));
```

#### Использование [`File`](https://developer.mozilla.org/ru/docs/Web/API/File)

На самом деле, GramIO может принимать Web API [`File`](https://developer.mozilla.org/ru/docs/Web/API/File) и [`Blob`](https://developer.mozilla.org/ru/docs/Web/API/Blob).

Так что вы можете загружать файлы даже так:

```ts
import { Elysia } from "elysia";
import { bot } from "./bot";

new Elysia().post(
    "/",
    ({ body: { file } }) => {
        bot.api.sendPhoto({
            chat_id: 1,
            photo: file,
        });
    },
    {
        body: t.Object({
            file: t.File({
                type: "image",
                maxSize: "2m",
            }), // Elysia проверяет и принимает только тип File
        }),
    }
);
```

Или, например, с [нативным чтением файлов Bun](https://bun.sh/docs/api/file-io#reading-files-bun-file)

```ts
bot.api.sendDocument({
    chat_id: 1,
    document: Bun.file("README.md"),
});
```
