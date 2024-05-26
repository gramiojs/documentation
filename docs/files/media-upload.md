---
title: Upload files in Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "This class help you to upload files by path, url, stream, buffer or text"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, file upload, file_id, attach"
---

# Media Upload

Class-helper with static methods for file uploading.

## path

Method for uploading Media File by local path.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
ctx.sendDocument(MediaUpload.path("./package.json"));
// or with filename
ctx.sendDocument(MediaUpload.path("./package.json", "some-other.json"));
```

If filename not specified, the filename set to filename :)

## url

Method for uploading Media File by URL (also with fetch options).

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
ctx.sendPhoto(MediaUpload.url("https://example.com/cat.png"));
// or with filename
ctx.sendPhoto(MediaUpload.url("https://example.com/cat.png", "cute-cat.png"));
// or with filename and fetch options (for example headers)
ctx.sendPhoto(
    MediaUpload.url("https://example.com/cat.png", "cute-cat.png", {
        headers: {
            Authorization: "Bearer gramio",
        },
    })
);
```

If filename not specified, the filename set to last part after `/`.

## buffer

Method for uploading Media File by Buffer or ArrayBuffer.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
const res = await fetch("https://...");

ctx.sendDocument(
    MediaUpload.buffer(await res.arrayBuffer(), "from-buffer.json")
);
```

By default filename is `file.buffer`.

## stream

Method for uploading Media File by Readable stream.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";
import fs from "node:fs";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
ctx.sendDocument(
    MediaUpload.stream(
        fs.createReadStream("./cute-cat.png"),
        "the-same-cute-cat.png"
    )
);
```

By default filename is `file.stream`.

## text

Method for uploading Media File by text content.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
ctx.sendDocument(MediaUpload.text("GramIO is the best!", "truth.txt"));
```

By default filename is `text.txt`.
