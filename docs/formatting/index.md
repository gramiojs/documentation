---
title: How to format messages in Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "Format your messages without the pain of parse_mode in a convenient way!"

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, format, entities, bold, italic, link, mention, code, pre, blockquote, expandable blockquote, spoiler, underline, strikethrough, dedent"
---

<script setup>
import Spoiler from '../.vitepress/components/Spoiler.vue'

</script>

# Format messages

[`@gramio/format`](https://github.com/gramiojs/format) is built-in GramIO package. You can also use it outside of this framework because it is framework-agnostic.

See also [API Reference](https://jsr.io/@gramio/format/doc).

## Format

Template literal that helps construct message entities for text formatting.

Use if you want to strip all of the indentation from the beginning of each line. (like [common-tags#stripindents](https://www.npmjs.com/package/common-tags#stripindents) or [dedent](https://www.npmjs.com/package/dedent))

**NOTE**: for format with **arrays** use it with [`join`](#join) helper

```ts twoslash
import { format, bold, link, italic, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
format`some text`;
// or
format`${bold`Hmm...`} ${link(
    "GramIO",
    "https://github.com/gramiojs/gramio"
)}?`;
```

Let's send something...

```ts twoslash
import { format, bold, link, italic, spoiler, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.api.sendMessage({
    chat_id: 12321,
    text: format`${bold`Hi!`}

		Can ${italic("you")} help ${spoiler`me`}?
	
			Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`,
});
```

![format](/formatting/format.png)

## FormatSaveIndents

Template literal that helps construct message entities for text formatting.

Use if you want to save all of the indentation.

**NOTE**: for format with **arrays** use it with [`join`](#join) helper

```ts twoslash
import { formatSaveIndents, bold, link, italic, spoiler, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.api.sendMessage({
    chat_id: 12321,
    text: formatSaveIndents`${bold`Hi!`}

		Can ${italic("you")} help ${spoiler`me`}?
	
			Can you give me a ${link("star", "https://github.com/gramiojs/gramio")}?`,
});
```

![format-save-indents](/formatting/format-save-indents.png)

## Entities

### **Bold**

Format text as **bold**. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, bold } from "@gramio/format";
// ---cut---
format`Format text as ${bold`bold`}`;
```

![bold example](/formatting/bold.png)

### _Italic_

Format text as _italic_. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, italic } from "@gramio/format";
// ---cut---
format`Format text as ${italic`italic`}`;
```

![italic example](/formatting/italic.png)

### <u>Underline</u>

Format text as <u>underline</u>. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, underline } from "@gramio/format";
// ---cut---
format`Format text as ${underline`underline`}`;
```

![underline example](/formatting/underline.png)

### ~~Strikethrough~~

Format text as ~~strikethrough~~. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, strikethrough } from "@gramio/format";
// ---cut---
format`Format text as ${strikethrough`strikethrough`}`;
```

![strikethrough example](/formatting/strikethrough.png)

### <Spoiler>Spoiler</Spoiler>

Format text as <Spoiler>spoiler</Spoiler>. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, spoiler } from "@gramio/format";
// ---cut---
format`Format text as ${spoiler`spoiler`}`;
```

![spoiler example](/formatting/spoiler.png)

> ### Blockquote

Format text as blockquote. Cannot be nested.

```ts twoslash
import { format, blockquote } from "@gramio/format";
// ---cut---
format`Format text as ${blockquote`blockquote`}`;
```

![blockquote example](/formatting/blockquote.png)

> ### Expandable blockquote

Format text as expandable blockquote. Cannot be nested.

```ts twoslash
import { format, expandableBlockquote } from "@gramio/format";
function loremIpsum(options: { count: number }): string {
    return "";
}
// ---cut---
format`Format text as ${expandableBlockquote(loremIpsum({ count: 20 }))}`;
```

![expandable blockquote example](/formatting/expandable_blockquote.png)

### `Code`

Format text as `code`. Convenient for copied items. Cannot be combined with any other format.

```ts twoslash
import { format, code } from "@gramio/format";
// ---cut---
format`Format text as ${code`code`}`;
```

![code example](/formatting/code.png)

### `Pre`

Format text as `pre`. Cannot be combined with any other format. ([Supported languages](https://github.com/TelegramMessenger/libprisma#supported-languages))

```ts twoslash
import { format, pre } from "@gramio/format";
// ---cut---
format`Format text as ${pre`pre`}`;
// or with language
format`Format text as ${pre(`console.log("pre with language")`, "js")}`;
```

![pre example](/formatting/pre.png)

### [Link](https://github.com/gramiojs/gramio)

Format text as [link](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, link } from "@gramio/format";
// ---cut---
format`Format text as ${link("link", "https://github.com/gramiojs/gramio")}`;
```

![link example](/formatting/link.png)

### [Mention](https://github.com/gramiojs/gramio)

Format text as [mention](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, mention } from "@gramio/format";
// ---cut---
format`format text as ${mention("mention", {
    id: 12312312,
    is_bot: false,
    first_name: "GramIO",
})}`;
```

![mention example](/formatting/mention.png)

### 🄲 🅄 🅂 🅃 🄾 🄼 ㅤ🄴 🄼 🄾 🄹 🄸

Insert custom emoji by their id.

```ts twoslash
import { format, customEmoji } from "@gramio/format";
// ---cut---
format`text with emoji - ${customEmoji("⚔️", "5222106016283378623")}`;
```

> [!WARNING]
> Custom emoji entities can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com/).

## Helpers

### Join

Helper for great work with formattable arrays. ([].join break styling)

Separator by default is `, `

```ts twoslash
import { format, join, bold } from "@gramio/format";
// ---cut---
format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`;
```
