---
title: Send file in Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "How to send files in Telegram Bot API?"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, file upload, file_id, attach"
---

# Overview

[`@gramio/files`](https://github.com/gramiojs/files) is built-in GramIO package. You can also use it outside of this framework because it is framework-agnostic.

> [!WARNING]
> Currently, uploading files in [`Bun`](https://bun.sh/) working, but filenames is wrong... ([Issue](https://github.com/oven-sh/bun/issues/8750), [Other Issue](https://github.com/oven-sh/bun/issues/2644))

## Usage

```ts twoslash
// @errors: 2345
import { Bot, MediaInput, MediaUpload, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!)
    .on("message", async (ctx) => {
        ctx.sendMediaGroup([
            MediaInput.document(
                MediaUpload.url(
                    "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
                )
            ),
            MediaInput.document(MediaUpload.path("./package.json")),
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
import { Bot, MessageContext } from "gramio";

const fileId = "" as string;
const ctx = {} as InstanceType<MessageContext<Bot>>;

// ---cut---
ctx.sendPhoto(fileId);
```

### Sending by `URL`

-   When sending by URL the target file must have the correct MIME type (e.g., audio/mpeg for sendAudio, etc.).
-   In sendDocument, sending by URL will currently only work for GIF, PDF and ZIP files.
-   To use sendVoice, the file must have the type audio/ogg and be no more than 1MB in size. 1-20MB voice notes will be sent as files.

To send a file by `URL` with GramIO, you can put it `as is`.

```ts twoslash
import { Bot, MessageContext } from "gramio";

const ctx = {} as InstanceType<MessageContext<Bot>>;

// ---cut---
ctx.sendPhoto("https://.../cute-cat.png");
```

### File uploading

To upload and send file you can use [`Media Upload`](/files/media-upload.html) Class-helper and GramIO will do all the work for you.

```ts twoslash
// @errors: 2345
import { MediaUpload } from "@gramio/files";
import { Bot, MessageContext } from "gramio";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
ctx.sendPhoto(MediaUpload.path("../cute-cat.png"));
```

#### Use [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

In fact, GramIO can accept Web API's [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).

So you can upload files even like this:

```ts
import { Elysia } from "elysia";

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
            }),
        }),
    }
);
```
