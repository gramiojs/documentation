---
title: sendMediaGroup in Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "This class help you to work with file types in sendMediaGroup and other methods"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, file upload, file_id, attach"
---

# Media Input

Class-helper with static methods that represents the content of a media message to be sent.

[API Reference](https://jsr.io/@gramio/files/doc)

[Documentation](https://core.telegram.org/bots/api/#inputmedia)

## document

Represents a general file to be sent.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
// ctx from bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.document(
        MediaUpload.url(
            "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
        )
    ),
    MediaInput.document(MediaUpload.path("./package.json")),
]);
```

[Documentation](https://core.telegram.org/bots/api/#inputmediadocument)

## audio

Represents an audio file to be treated as music to be sent.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---

// ctx from bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.audio(MediaUpload.url("https://.../music.mp3")),
    MediaInput.audio(MediaUpload.path("./music.mp3")),
]);
```

[Documentation](https://core.telegram.org/bots/api/#inputmediaaudio)

## photo

Represents a photo to be sent.

```ts twoslash
// @errors: 2345
import { Bot, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
// ctx from bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.photo(
        MediaUpload.url(
            "https://w7.pngwing.com/pngs/140/552/png-transparent-kitten-if-cats-could-talk-the-meaning-of-meow-pet-sitting-dog-pet-dog-mammal-animals-cat-like-mammal.png"
        ),
        { has_spoiler: true, caption: "MaybeCat<TelegramInputFile>" }
    ),
    MediaInput.photo(MediaUpload.path("./no-cat.png")),
]);
```

[Documentation](https://core.telegram.org/bots/api/#inputmediaphoto)

## video

Represents a video to be sent.

```ts twoslash
// @noErrors
import { Bot, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<Bot>>;
// ---cut---
// ctx from bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.video(MediaUpload.url("https://.../video.mp4"), {
        has_spoiler: true,
        thumbnail: MediaUpload.buffer(/**file buffer */),
    }),
    MediaInput.photo(MediaUpload.path("./cat-walk.mp4")),
]);
```

[Documentation](https://core.telegram.org/bots/api/#inputmediavideo)

## animation

Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.

```ts twoslash
// @noErrors
import { MediaInput, MediaUpload } from "@gramio/files";
// ---cut---
MediaInput.animation(
    MediaUpload.url(
        "https://media1.tenor.com/m/47qpxBq_Tw0AAAAd/cat-cat-meme.gif"
    )
);
```

[Documentation](https://core.telegram.org/bots/api/#inputmediaanimation)
