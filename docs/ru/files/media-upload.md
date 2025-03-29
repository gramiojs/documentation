---
title: Загрузка файлов - Использование MediaUpload для работы с файлами

head:
    - - meta
      - name: "description"
        content: "Этот класс помогает вам загружать файлы по пути, URL, потоку, буферу или тексту"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, MediaUpload, загрузка файлов в Telegram, загрузка по URL, загрузка из файловой системы, загрузка из буфера, загрузка из потока, загрузка текста, локальные файлы, удаленные файлы, buffer, stream, path, url, text, InputFile, InputMedia, форматы загрузки файлов"
---

# Media Upload

Класс-помощник со статическими методами для загрузки файлов.

## path

Метод для загрузки медиа-файла по локальному пути.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
ctx.sendDocument(await MediaUpload.path("./package.json"));
// или с указанием имени файла
ctx.sendDocument(await MediaUpload.path("./package.json", "some-other.json"));
```

Если имя файла не указано, в качестве имени файла используется исходное имя файла.

## url

Метод для загрузки медиа-файла по URL (также с опциями fetch).

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
ctx.sendPhoto(await MediaUpload.url("https://example.com/cat.png"));
// или с указанием имени файла
ctx.sendPhoto(
    await MediaUpload.url("https://example.com/cat.png", "cute-cat.png")
);
// или с именем файла и опциями fetch (например, заголовками)
ctx.sendPhoto(
    await MediaUpload.url("https://example.com/cat.png", "cute-cat.png", {
        headers: {
            Authorization: "Bearer gramio",
        },
    })
);
```

Если имя файла не указано, в качестве имени файла используется последняя часть после `/`.

## buffer

Метод для загрузки медиа-файла из Buffer или ArrayBuffer.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
const res = await fetch("https://...");

ctx.sendDocument(
    MediaUpload.buffer(await res.arrayBuffer(), "from-buffer.json")
);
```

По умолчанию имя файла - `file.buffer`.

## stream

Метод для загрузки медиа-файла из потока `Readable`.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

// import fs from "node:fs";
// https://github.com/gramiojs/documentation/actions/runs/10424909870/job/28874689592 wtf
const fs = {} as any;

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
ctx.sendDocument(
    await MediaUpload.stream(
        fs.createReadStream("./cute-cat.png"),
        "the-same-cute-cat.png"
    )
);
```

По умолчанию имя файла - `file.stream`.

## text

Метод для загрузки медиа-файла из текстового содержимого.

```ts twoslash
// @errors: 2345
import { BotLike, MessageContext } from "gramio";
import { MediaUpload } from "@gramio/files";

const ctx = {} as InstanceType<MessageContext<BotLike>>;
// ---cut---
ctx.sendDocument(MediaUpload.text("GramIO лучший!", "правда.txt"));
```

По умолчанию имя файла - `text.txt`.
