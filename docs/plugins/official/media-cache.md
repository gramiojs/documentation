# Media cache plugin

[![npm](https://img.shields.io/npm/v/@gramio/media-cache?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/media-cache)
[![JSR](https://jsr.io/badges/@gramio/media-cache)](https://jsr.io/@gramio/media-cache)
[![JSR Score](https://jsr.io/badges/@gramio/media-cache/score)](https://jsr.io/@gramio/media-cache)

`Media cache` plugin for [GramIO](https://gramio.netlify.app/).

This plugin caches the sent `file_id`'s and prevents files from being uploaded again.

Currently, **sendMediaGroup** is not cached.

## Usage

```ts
import { Bot } from "gramio";
import { mediaCache } from "@gramio/media-cache";

const bot = new Bot(process.env.token!)
    .extend(mediaCache())
    .command("start", async (context) => {
        return context.sendDocument(
            MediaUpload.url(
                "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
            )
        );
    })
    .onStart(console.log);

bot.start();
```
