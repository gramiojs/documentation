---
title: Отправка файлов группами - Использование MediaInput для альбомов

head:
    - - meta
      - name: "description"
        content: "Этот класс помогает вам работать с типами файлов в sendMediaGroup и других методах"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, MediaInput, sendMediaGroup, отправка альбомов, группы медиа, InputMediaPhoto, InputMediaVideo, InputMediaAudio, InputMediaDocument, InputMediaAnimation, отправка нескольких файлов, медиа-группы, медиа-сообщения, альбомы в Telegram, mediaGroup, способы отправки медиа"
---

# Media Input

Класс-помощник со статическими методами, который представляет содержимое медиа-сообщения для отправки.

[API Reference](https://jsr.io/@gramio/files/doc)

[Документация](https://core.telegram.org/bots/api/#inputmedia)

## document

Представляет общий файл для отправки.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
// ctx из bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.document(
        await MediaUpload.url(
            "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
        )
    ),
    MediaInput.document(await MediaUpload.path("./package.json")),
]);
```

[Документация](https://core.telegram.org/bots/api/#inputmediadocument)

## audio

Представляет аудиофайл, который будет обрабатываться как музыка для отправки.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---

// ctx из bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.audio(await MediaUpload.url("https://.../music.mp3")),
    MediaInput.audio(await MediaUpload.path("./music.mp3")),
]);
```

[Документация](https://core.telegram.org/bots/api/#inputmediaaudio)

## photo

Представляет фотографию для отправки.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
// ctx из bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.photo(
        await MediaUpload.url(
            "https://w7.pngwing.com/pngs/140/552/png-transparent-kitten-if-cats-could-talk-the-meaning-of-meow-pet-sitting-dog-pet-dog-mammal-animals-cat-like-mammal.png"
        ),
        { has_spoiler: true, caption: "MaybeCat<TelegramInputFile>" }
    ),
    MediaInput.photo(await MediaUpload.path("./no-cat.png")),
]);
```

[Документация](https://core.telegram.org/bots/api/#inputmediaphoto)

## video

Представляет видео для отправки.

```ts twoslash
// @noErrors
import { BotLike, MessageContext } from "gramio";
import { MediaInput, MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
// ctx из bot.on("message", (ctx) => ...)
ctx.sendMediaGroup([
    MediaInput.video(await MediaUpload.url("https://.../video.mp4"), {
        has_spoiler: true,
        thumbnail: MediaUpload.buffer(/**буфер файла */),
    }),
    MediaInput.photo(await MediaUpload.path("./cat-walk.mp4")),
]);
```

[Документация](https://core.telegram.org/bots/api/#inputmediavideo)

## animation

Представляет анимационный файл (GIF или видео H.264/MPEG-4 AVC без звука) для отправки.

```ts twoslash
// @noErrors
import { MediaInput, MediaUpload } from "@gramio/files";
// ---cut---
MediaInput.animation(
    await MediaUpload.url(
        "https://media1.tenor.com/m/47qpxBq_Tw0AAAAd/cat-cat-meme.gif"
    )
);
```

[Документация](https://core.telegram.org/bots/api/#inputmediaanimation) 