# Media cache plugin

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
