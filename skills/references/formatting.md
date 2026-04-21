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

## Passing `FormattableString` to edit/send methods

Every `format\`…\`` expression returns a `FormattableString` (text + entities). GramIO's `formatMiddleware` (registered by default) decomposes it into `text` + `entities` when the HTTP request is made. So you must **pass the result directly** as the `text:` or `caption:` parameter to `sendMessage`, `editMessageText`, `editMessageCaption`, `editText` (context alias), etc.

```typescript
import { format, link, bold } from "gramio";

const rendered = format`Magic: ${link`click here`("https://example.com")} · ${bold`verified`}`;

// ✅ send — entities survive
await ctx.send(rendered);

// ✅ edit — entities survive
await ctx.editText(rendered);
await ctx.editMessageText(rendered);

// ✅ low-level API call — still fine, formatMiddleware decomposes
await bot.api.editMessageText({
    chat_id: chatId,
    message_id: messageId,
    text: rendered,
});

// ❌ .toString() strips ALL entities — magic-link becomes plain text
await ctx.editText(rendered.toString());
await bot.api.editMessageText({ chat_id, message_id, text: rendered.toString() });

// ❌ template-literal interpolation strips them too
await ctx.send(`Answer: ${rendered}`); // `${rendered}` → toString() → no entities
// ✅ use format``
await ctx.send(format`Answer: ${rendered}`);
```

**Never call `.toString()` on a `FormattableString` in production code — it is always a bug.** If TypeScript is complaining about a union type (`string | FormattableString`), the fix is to widen the parameter type upstream or pass the value through — not to coerce to string.

## `string | { toString(): string }` — every such field is a FormattableString sink

Many Bot API fields are typed `string | { toString(): string }` in `@gramio/types`. **The `{ toString(): string }` branch is misleading** — GramIO's `formatMiddleware` does **not** call `.toString()`; it recognizes a `FormattableString` at request-serialization time and decomposes it into `text`/`caption`/etc. + `entities`. Pass `format\`…\`` directly.

**Reliable heuristic: if the field has a sibling `parse_mode` / `*_parse_mode` in its type, it is a FormattableString sink.**

Verified sinks in the current `@gramio/types` (non-exhaustive — all follow the heuristic above):

| Where | Field |
|---|---|
| `sendMessage` / `editMessageText` params | `text` |
| `sendPhoto` / `sendVideo` / `sendAudio` / `sendDocument` / `sendAnimation` / `sendVoice` / `sendPaidMedia` / `editMessageCaption` / `copyMessage` params | `caption` |
| `sendPoll` params | `question`, `explanation` |
| `sendInvoice` params | `description` |
| `sendGift` / `sendChecklist` params | `text` |
| `ReplyParameters` | `quote` |
| `InputPollOption` | `text` |
| `InputChecklistTask` | `text` |
| `InputChecklist` | `title` |
| `InputMediaPhoto` / `InputMediaVideo` / `InputMediaAnimation` / `InputMediaAudio` / `InputMediaDocument` / `InputPaidMediaPhoto` / `InputPaidMediaVideo` | `caption` |
| **`InputTextMessageContent`** (inline-query results) | **`message_text`** |

```typescript
import { format, bold, InlineQueryResult, InputMessageContent } from "gramio";

// ✅ FormattableString survives all the way to the rendered inline-result message
bot.inlineQuery(/find (.*)/i, async (ctx) => {
    await ctx.answer(
        [
            InlineQueryResult.article(
                "id-1",
                `Result for ${ctx.args![1]}`,
                InputMessageContent.text(format`Found: ${bold(ctx.args![1])}`),
            ),
        ],
        { cache_time: 0 },
    );
});
```

**To verify any specific field yourself**, use the introspection tool shipped with this skill:

```bash
node tools/get-bot-api-type.mjs InputTextMessageContent
node tools/get-bot-api-method.mjs sendInvoice
```

If the field's type shows `string | { toString(): string }` (or there is a `parse_mode` sibling), it accepts a `FormattableString` — do not stringify defensively.

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
