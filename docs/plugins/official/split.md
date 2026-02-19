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

# Split

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![JSR](https://jsr.io/badges/@gramio/split)](https://jsr.io/@gramio/split)
[![JSR Score](https://jsr.io/badges/@gramio/split/score)](https://jsr.io/@gramio/split)

</div>

This package splits messages that exceed the Telegram character limit into multiple parts. It also **correctly splits Telegram message entities** (bold, italic, links, etc.) across boundaries, so formatting is preserved in each part without manual offset recalculation.

## Installation

::: code-group

```bash [npm]
npm install @gramio/split
```

```bash [yarn]
yarn add @gramio/split
```

```bash [pnpm]
pnpm add @gramio/split
```

```bash [bun]
bun add @gramio/split
```

:::

## Usage

```ts
import { Bot, format, bold } from "gramio";
import { splitMessage } from "@gramio/split";

const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", async (context) => {
        const messages = await splitMessage(
            format`${bold("a".repeat(4096 * 2))}`,
            (str) => context.send(str)
        );

        console.log(messages); // array of send results
    });

await bot.start();
```

> [!WARNING]
> If you want to pass `context.send` without a function wrapper, use `context.send.bind(context)` — otherwise it will lose context data.

### Usage with other frameworks

`@gramio/split` can be used independently of GramIO — the `action` callback receives a `FormattableString` with `.text` and `.entities` properties:

```ts
import { splitMessage } from "@gramio/split";
import { format, bold } from "@gramio/format";

const messages = await splitMessage(
    format`${bold("a".repeat(4096 * 2))}`,
    ({ text, entities }) => {
        return someOtherFramework.sendMessage(text, { entities });
    }
);
```

## API

### splitMessage

```ts
function splitMessage<ReturnData>(
    text: FormattableString | string,
    action: (formattableString: FormattableString) => MaybePromise<ReturnData>,
    limit?: number
): Promise<ReturnData[]>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | `FormattableString \| string` | — | The message text to split. Can be a plain string or a `FormattableString` from `@gramio/format` (which carries entities). |
| `action` | `(formattableString: FormattableString) => MaybePromise<ReturnData>` | — | A callback invoked **sequentially** for each split part. The return value is collected into the result array. |
| `limit` | `number` | `4096` | Maximum character length per part. |

**Returns:** `Promise<ReturnData[]>` — an array of results from each `action` call, in order.

The `action` callback is called sequentially (not in parallel), which preserves correct message ordering in Telegram.

## Custom limit

The default limit is **4096** characters (`sendMessage`). For photo/video captions use **1024**:

```ts
import { splitMessage } from "@gramio/split";
import { format, bold } from "@gramio/format";

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

## How entity splitting works

When a message is split, entities are handled as follows:

- Entities that fit **entirely within** the current part are kept as-is.
- Entities that **span the split boundary** are split: the first part gets the entity truncated to the boundary, and the remaining part gets a new entity with recalculated `offset` and `length`.
- Entities **entirely in the remaining text** get their `offset` shifted accordingly.

This means formatting like **bold**, _italic_, [links](https://example.com), `code`, and other Telegram entities are always preserved correctly across all parts.
