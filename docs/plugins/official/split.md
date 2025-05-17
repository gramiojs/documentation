---
title: "Split Plugin for GramIO - Auto-Split Long Messages for Telegram Bots"

head:
    - - meta
      - name: "description"
        content: "Automatically split long messages exceeding Telegram limits with GramIO Split plugin. Preserve formatting entities, handle captions, and maintain message integrity across multiple parts."

    - - meta
      - name: "keywords"
        content: "Telegram bot message splitting, split long messages GramIO, Telegram API limits workaround, message entity preservation, auto-split entities, handle large text messages, Telegram caption splitting, message chunking plugin, splitMessage function, text segmentation for bots, message size limit solution, Telegram bot tools, GramIO plugins"
---

# Split Plugin

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![JSR](https://jsr.io/badges/@gramio/split)](https://jsr.io/@gramio/split)
[![JSR Score](https://jsr.io/badges/@gramio/split/score)](https://jsr.io/@gramio/split)

</div>

This package can split messages which reach the Telegram limit into multiple parts (messages). This package also split entities so you don't need to do it manually.

# Usage

```ts
import { splitMessage } from "@gramio/split";

const bot = new Bot(process.env.BOT_TOKEN!).command(
    "start",
    async (context) => {
        const messages = await splitMessage(
            format`${bold("a".repeat(4096 * 2))}`,
            (str) => context.send(str)
            // be worry. if u wants provide an context.send without function wrapper
            // you should use context.send.bind(context) it is required because otherwise it will lose context data
        );

        console.log(messages); // messages is array of second argument results
    }
);

await bot.start();
```

You can also use it in other frameworks.

```ts
import { splitMessage } from "@gramio/split";

const messages = await splitMessage(
    format`${bold("a".repeat(4096 * 2))}`,
    ({ text, entities }) => {
        return someOtherFramework.sendMessage(text, { entities });
    }
);
```

### Configuration

You can also configure maximum text length. By default it's `4096` symbols, but `sendPhoto` caption has limit `1024` symbols.

```ts
const messages = await splitMessage(
    format`${bold("a".repeat(4096))}`,
    ({ text, entities }) => {
        return context.sendPhoto(PHOTO, {
            caption: text,
            caption_entities: entities,
        });
    },
    1024
);
```

> [!NOTE]
> This package mostly in the WIP stage.

## TODO:

-   [ ] More tests
-   [ ] Plugin with auto-split
-   [ ] Split mode by entities
-   [ ] Auto split action strategies (like `sendPhoto` caption next splits to `sendMessage` text)
