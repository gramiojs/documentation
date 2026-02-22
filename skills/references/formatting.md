---
name: formatting
description: Text formatting utilities — template literals, entity functions, join helper, variable composition, and why to never use parse_mode.
---

# Formatting

Package: `@gramio/format` (built into GramIO, also usable standalone).

## ⚠️ Never use `parse_mode` with GramIO

**This is the most common mistake.** GramIO's `format` template literal and entity helpers produce structured `MessageEntity` arrays — not HTML or MarkdownV2 strings. If you set `parse_mode: "HTML"` or `parse_mode: "MarkdownV2"` alongside `@gramio/format` output, the message will break (Telegram tries to parse entities as markup and fails or produces garbage).

```typescript
// ❌ WRONG — never mix parse_mode with @gramio/format
context.send({
    text: format`Hello, ${bold("world")}!`,
    parse_mode: "HTML", // This will BREAK the message
});

// ✅ Correct — no parse_mode needed, entities are injected automatically
context.send(format`Hello, ${bold("world")}!`);

// ✅ Also correct — direct API call, still no parse_mode
bot.api.sendMessage({
    chat_id: chatId,
    text: format`Hello, ${bold("world")}!`,
    // No parse_mode — GramIO sends entities separately
});
```

GramIO automatically passes the `entities` field when you send a `Formattable`. `parse_mode` is only needed if you are building raw HTML/MarkdownV2 strings manually — which you should avoid.

## Template Literals

```typescript
import { format, bold, italic, link } from "@gramio/format";
// or from "gramio"

// format strips leading indentation (like dedent)
context.send(format`Hello ${bold("world")}!`);

// formatSaveIndents preserves indentation
import { formatSaveIndents } from "@gramio/format";
context.send(formatSaveIndents`
    Indented
    ${bold("text")}
`);
```

## Composing format templates as variables

`format` returns a **Formattable** object — not a plain string. It stores both text and entity offsets. You can store a `format` result in a variable and embed it in another `format` template; entities will be correctly re-offset.

```typescript
// ✅ Correct — wrap styled content in format`` to keep it Formattable
const header = format`${bold`GramIO Bot`}`;
const body = format`Supported runtimes: ${italic`Bun, Node.js, Deno`}`;
const message = format`${header}\n\n${body}`;
// All entities (bold in header, italic in body) are preserved and correctly positioned

// ✅ Reuse across handlers
const WELCOME = format`Welcome to ${bold`GramIO`}! ${italic`Type /help to start.`}`;
bot.command("start", (ctx) => ctx.send(WELCOME));
```

> **Critical rule:** **Always wrap styled content in `format\`\``** when composing or reusing. Embedding a Formattable into a plain template literal (`` `${formattable}` ``) calls `.toString()` on it, which strips ALL entities:
>
> ```typescript
> // ❌ WRONG — entities are silently lost
> const a = `Hello, ${bold`World`}`;       // bold → plain text
> const b = `${a} and ${italic`more`}`;    // italic survives, bold is gone forever
>
> // ✅ Correct
> const a = format`Hello, ${bold`World`}`;
> const b = format`${a} and ${italic`more`}`;
> ```

## ⚠️ Join helper — NEVER use native `.join()` with format

This is the second most common mistake. Every entity function (`bold`, `italic`, etc.) returns a **Formattable** object. Calling `Array.prototype.join()` on an array of Formattable values calls `.toString()` on each one, **destroying all entity data** and producing plain unstyled text.

```typescript
// ❌ WRONG — entities are destroyed, output is plain text
const items = ["TypeScript", "Bun", "Node.js"];
const broken = items.map((x) => bold(x)).join(", "); // bold is gone!
context.send(format`Runtimes: ${broken}`); // No bold at all

// ✅ Correct — use the join helper from @gramio/format
import { format, join, bold } from "@gramio/format";

const items = ["TypeScript", "Bun", "Node.js"];
context.send(
    format`Runtimes: ${join(items, (item) => bold(item), ", ")}`
);
// Default separator is ", " — can be omitted:
context.send(
    format`Runtimes:\n${join(items, (item) => bold(item), "\n")}`
);
```

The `join` helper signature: `join(array, mapper, separator?)` where `separator` defaults to `", "`.

## Entity Functions

| Function | Example | Restrictions |
|----------|---------|-------------|
| `bold(text)` | **Bold** | Cannot combine with code/pre |
| `italic(text)` | _Italic_ | Cannot combine with code/pre |
| `underline(text)` | Underline | Cannot combine with code/pre |
| `strikethrough(text)` | ~~Strike~~ | Cannot combine with code/pre |
| `spoiler(text)` | Spoiler | Cannot combine with code/pre |
| `blockquote(text)` | Blockquote | Cannot nest |
| `expandableBlockquote(text)` | Expandable | Cannot nest |
| `code(text)` | `Inline code` | Cannot combine with anything |
| `pre(text, lang?)` | Code block | Cannot combine with anything |
| `link(text, url)` | Hyperlink | Cannot combine with code/pre |
| `mention(text, user)` | User mention | Cannot combine with code/pre |
| `customEmoji(emoji, id)` | Custom emoji | Bot owner needs Telegram Premium |

All work as both tagged template literals and function calls:

```typescript
bold`text`       // tagged template
bold("text")     // function call
pre(`code`, "typescript")  // with language param
mention("Click here", { id: 123456789 })  // mention user without @username
```

## Custom Emoji

```typescript
customEmoji("⭐", "5368324170671202286");
```

Requirements:
- Bot owner must have Telegram Premium
- Works in DMs and regular group chats (not channels)

<!--
Source: https://gramio.dev/formatting
-->
