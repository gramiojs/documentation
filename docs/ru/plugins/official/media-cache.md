---
title: Плагин кэширования медиа для GramIO

head:
    - - meta
      - name: "description"
        content: "Кэшируйте ваши медиафайлы в GramIO для оптимизации повторной отправки"

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, плагин кэширования медиа, кэширование file_id, повторная отправка медиа, оптимизация медиа-файлов, хранение идентификаторов медиа, управление file_id, Redis хранилище медиа, локальное хранилище медиа, адаптеры хранилищ, кэширование изображений, кэширование видео, увеличение производительности, оптимизация трафика"
---

# Плагин кэширования медиа

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/media-cache?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/media-cache)
[![JSR](https://jsr.io/badges/@gramio/media-cache)](https://jsr.io/@gramio/media-cache)
[![JSR Score](https://jsr.io/badges/@gramio/media-cache/score)](https://jsr.io/@gramio/media-cache)

</div>

Плагин `Media cache` для [GramIO](https://gramio.dev/).

Этот плагин кэширует отправленные `file_id` и предотвращает повторную загрузку файлов.

На данный момент **sendMediaGroup** не кэшируется.

## Использование

```ts
import { Bot } from "gramio";
import { mediaCache } from "@gramio/media-cache";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(mediaCache())
    .command("start", async (context) => {
        return context.sendDocument(
            await MediaUpload.url(
                "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
            )
        );
    })
    .onStart(console.log);

bot.start();
``` 