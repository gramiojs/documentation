# Overview

[`@gramio/files`](https://github.com/gramiojs/files) is built-in GramIO plugin. You can also use it outside of this framework because it is framework-agnostic.

## Usage

```ts
import { Bot, MediaInput, MediaUpload, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN);

bot.updates.on("message", async (ctx) => {
    ctx.sendMediaGroup([
        MediaInput.document(
            MediaUpload.url(
                "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
            )
        ),
        MediaInput.document(MediaUpload.path("./package.json")),
    ]);
});

bot.updates.startPolling();
```
