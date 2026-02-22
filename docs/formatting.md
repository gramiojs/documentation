---
title: Formatting messages in Telegram bots - Text styling and entities

head:
    - - meta
      - name: "description"
        content: "Learn how to format messages in Telegram bots with GramIO. Create rich text with bold, italic, links, code blocks, spoilers and more without the complexity of parse_mode."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, message formatting, text styling, bold text, italic text, underline, strikethrough, links, code blocks, pre blocks, blockquotes, mentioning users, spoilers, text entities, message entities, MessageEntity, parse_mode, HTML formatting, MarkdownV2, rich text messages"
---

<script setup>
import Spoiler from './.vitepress/components/Spoiler.vue'

</script>

# Format messages

[`@gramio/format`](https://github.com/gramiojs/format) is built-in GramIO package. You can also use it outside of this framework because it is framework-agnostic.

See also [API Reference](https://jsr.io/@gramio/format/doc).

> [!IMPORTANT]
> **Do not use `parse_mode` with GramIO.** The `format` template literal and entity helpers produce structured `MessageEntity` objects, not escaped HTML/Markdown strings. Setting `parse_mode: "HTML"` or `parse_mode: "MarkdownV2"` alongside `@gramio/format` output will break your messages. GramIO handles entity injection automatically — no `parse_mode` needed.

## Format

Template literal that helps construct message entities for text formatting.

Use if you want to strip all of the indentation from the beginning of each line. (like [common-tags#stripindents](https://www.npmjs.com/package/common-tags#stripindents) or [dedent](https://www.npmjs.com/package/dedent))

> [!IMPORTANT]
> For formatting with **arrays** always use the [`join`](#join) helper — never native `.join()`.

```ts twoslash
import { format, bold, link, italic, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
format`some text`;
// or
format`${bold`Hmm...`} ${link(
    "GramIO",
    "https://github.com/gramiojs/gramio",
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

> [!IMPORTANT]
> For formatting with **arrays** always use the [`join`](#join) helper — never native `.join()`.

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
> Telegram now allows custom emoji for all bots **if** the bot owner has Telegram Premium **and** one of the following is true:
>
> - the message is in the bot's private chat (DM) or a regular chat **(not channels)**, or
> - it's an inline query result where you edit the sent message afterwards (custom emoji aren't allowed in the initial inline result; edit the message to apply them).
>   Previously this was only available to bots that paid for additional usernames (Fragment). Now the username purchase is no longer required under the conditions above.

## Composing format templates

`format` returns a **Formattable** object — not a plain string. It tracks both the text and entity offsets. You can store it in a variable and embed it in another `format` template; entities will be correctly re-offset.

```ts twoslash
import { format, bold, italic } from "@gramio/format";
// ---cut---
// ✅ Store result in a variable, then embed it
const greeting = format`Hello, ${bold`World`}!`;
const message = format`${greeting} ${italic`How are you?`}`;
// Bold entity from `greeting` is correctly shifted inside `message`
```

> [!WARNING]
> **Never interpolate a Formattable into a plain template literal.** Calling `.toString()` (which happens in `` `${formattable}` ``) discards all entities and produces a plain string:
>
> ```ts
> // ❌ Wrong — entities are lost
> const a = `Hello, ${bold`World`}`;    // bold is stripped to plain text
> const b = `${a} and ${italic`more`}`; // italic survives, bold is gone
>
> // ✅ Correct — always use format``
> const a = format`Hello, ${bold`World`}`;
> const b = format`${a} and ${italic`more`}`;
> ```

## Helpers

### Join

Helper for correct formatting of arrays. Native `Array.prototype.join()` converts each element to a string via `.toString()`, which **destroys all entity data**.

> [!WARNING]
> **Do not use `[...].join()` with formattable values.** Each entity function returns a Formattable object. Calling `.join()` on an array of them discards every entity, producing plain unstyled text:
>
> ```ts
> // ❌ Wrong — every bold/italic/etc. is silently stripped
> const text = items.map((x) => bold(x)).join(", ");
>
> // ✅ Correct — use the join helper
> const text = join(items, (x) => bold(x), ", ");
> ```

Separator by default is `, `

```ts twoslash
import { format, join, bold } from "@gramio/format";
// ---cut---
format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`;
```

## Markdown

You can convert standard Markdown text into Telegram entities using the `markdownToFormattable` function from `@gramio/format/markdown` sub-module.

This is especially useful for:

- **LLM output** — language models (ChatGPT, Claude, etc.) naturally produce standard Markdown. You can pass their output directly to `markdownToFormattable` and send it to Telegram with proper formatting.
- **Data from databases or external sources** — when you store or receive Markdown text and need to render it in Telegram.

Unlike Telegram's built-in `parse_mode` (`HTML` or `MarkdownV2`), this approach **won't break your message if the markup is invalid**. Telegram's `parse_mode` will reject the entire message on a syntax error (e.g. an unclosed tag or unescaped character). With `markdownToFormattable`, the text is parsed locally into entities — if the markdown is malformed, it gracefully degrades to plain text instead of failing.

> [!WARNING]
> This function may change in the future.

### Installation

The markdown feature requires [`marked`](https://www.npmjs.com/package/marked) as a peer dependency:

::: code-group

```bash [npm]
npm install marked
```

```bash [yarn]
yarn add marked
```

```bash [pnpm]
pnpm add marked
```

```bash [bun]
bun install marked
```

:::

### Usage

```ts
import { markdownToFormattable } from "@gramio/format/markdown";
import { Bot } from "gramio";

const bot = new Bot("");

bot.command("start", (context) => {
    context.send(
        markdownToFormattable(`**Hello** *world*!

> This is a blockquote

- **Bold** list item
- *Italic* list item
- [Link](https://gramio.dev)

\`\`\`js
console.log("code block with syntax highlighting")
\`\`\`
`)
    );
});
```

### Supported syntax

| Markdown | Telegram entity |
|---|---|
| `**bold**` | bold |
| `*italic*` | italic |
| `~~strikethrough~~` | strikethrough |
| `` `inline code` `` | code |
| ` ```lang ... ``` ` | pre (with language) |
| `[text](url)` | text_link |
| `![alt](url)` | text_link (images become links) |
| `> blockquote` | blockquote |
| `# Heading` | bold (all levels) |
| `- item` / `1. item` | plain text with prefix |
```
