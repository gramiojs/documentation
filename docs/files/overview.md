---
title: Send files - Complete guide to file sharing

head:
    - - meta
      - name: "description"
        content: "Learn how to send files in Telegram Bot API using GramIO. This guide covers all methods: sending by file_id, URL, or uploading new files with proper handling."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, file upload, file_id, attach, Bun.file, fs, file system, sending photos, sending documents, media sharing, file limitations, MIME types, multipart/form-data"
---

# Overview

[`@gramio/files`](https://github.com/gramiojs/files) is built-in GramIO package. You can also use it outside of this framework because it is framework-agnostic.

## Usage

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

## Sending files

There are three ways to send files (photos, stickers, audio, media, etc.):

1. If the file is already stored somewhere on the Telegram servers, you don't need to reupload it: each file object has a file_id field, simply pass this file_id as a parameter instead of uploading. There are no limits for files sent this way.
2. Provide Telegram with an HTTP URL for the file to be sent. Telegram will download and send the file. 5 MB max size for photos and 20 MB max for other types of content.
3. Post the file using multipart/form-data in the usual way that files are uploaded via the browser. 10 MB max size for photos, 50 MB for other files.

### Sending by `file_id`

-   It is not possible to change the file type when resending by file_id. I.e. a video can't be sent as a photo, a photo can't be sent as a document, etc.
-   It is not possible to resend thumbnails.
-   Resending a photo by file_id will send all of its sizes.
-   file_id is unique for each individual bot and can't be transferred from one bot to another.
-   file_id uniquely identifies a file, but a file can have different valid file_ids even for the same bot.

To send a file by `file_id` with GramIO, you can put it `as is`.

```ts twoslash
import { BotLike, MessageContext } from "gramio";

const fileId = "" as string;
const ctx = {} as InstanceType<MessageContext<BotLike>>;

// ---cut---
ctx.sendPhoto(fileId);
```

### Sending by `URL`

-   When sending by URL the target file must have the correct MIME type (e.g., audio/mpeg for sendAudio, etc.).
-   In sendDocument, sending by URL will currently only work for GIF, PDF and ZIP files.
-   To use sendVoice, the file must have the type audio/ogg and be no more than 1MB in size. 1-20MB voice notes will be sent as files.

To send a file by `URL` with GramIO, you can put it `as is`.

```ts twoslash
import { BotLike, MessageContext } from "gramio";

const ctx = {} as InstanceType<MessageContext<BotLike>>;

// ---cut---
ctx.sendPhoto("https://.../cute-cat.png");
```

### File uploading

To upload and send file you can use [`Media Upload`](/files/media-upload.html) Class-helper and GramIO will do all the work for you.

```ts twoslash
// @errors: 2345
import { MediaUpload } from "@gramio/files";
import { BotLike, MessageContext } from "gramio";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
ctx.sendPhoto(await MediaUpload.path("../cute-cat.png"));
```

#### Use [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

In fact, GramIO can accept Web API's [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) and [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

So you can upload files even like this:

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
            }), // Elysia validates and accepts only the File type
        }),
    }
);
```

Or, for example, with [Bun native File reader](https://bun.sh/docs/api/file-io#reading-files-bun-file)

```ts
bot.api.sendDocument({
    chat_id: 1,
    document: Bun.file("README.md"),
});
```
