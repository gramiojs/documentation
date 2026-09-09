---
name: rich-messages
description: Bot API 10.3 rich-message authoring with gramio/rich helpers, rich JSX, recursive uploads, streaming drafts, and stopped_message_generation handling.
---

# Rich Messages

Rich messages are not regular `text` plus `entities`. They are sent through `sendRichMessage` as exactly one of `rich_message.markdown`, `.html`, or `.blocks`. In `gramio/rich`, `rich` and `markdownTable` target the Markdown lane; `blocks` and `table` target native structured blocks.

## Prefer the safe helpers

```typescript
import { bold, format } from "gramio";
import {
    button,
    buttonRow,
    document,
    heading,
    markdownTable,
    paragraph,
    quote,
    rich,
} from "gramio/rich";

const report = rich([
    heading(1, "Release report"),
    paragraph(format`Status: ${bold`ready`}`),
    quote("Expandable details", { expandable: true, credit: "Build bot" }),
    document({ url: "https://example.com/report.pdf", caption: "Report" }),
    markdownTable(
        [["Package", "Version"], ["gramio", "0.15.1"]],
        { compact: true, align: ["left", "right"] },
    ),
    buttonRow([
        button("Open", { type: "url", url: "https://gramio.dev" }),
        button("Refresh", { type: "callback_data", data: "refresh" }),
        button("Soon", { type: "disabled" }),
    ], { align: "right" }),
]);

bot.command("report", (ctx) => ctx.send(report));
```

## Native structured tables

```typescript
import { blocks, table } from "gramio/rich";

const report = blocks([
    blocks.heading(1, "Release report"),
    table(
        [["Package", "Version"], ["gramio", "0.15.1"]],
        { bordered: true, striped: true, compact: true, align: ["left", "right"] },
    ),
]);

bot.command("native-report", (ctx) => ctx.send(report));
```

The first row is a header by default. Use `blocks.cell("Total", { colSpan: 2 })` for spans and
per-cell alignment. Native blocks cannot be interpolated into `rich` Markdown content.
`streamRichMessage()` is Markdown-chunk based; pass native blocks to `ctx.send()` or
`ctx.sendRichMessage()` instead of appending them to a draft.

The complete native DSL lives under `blocks`: `heading`/`h1`–`h6`, `paragraph`, `pre`, `footer`,
`divider`/`hr`, `mathBlock`, `anchor`, `list`/`orderedList`/`taskList`, `blockquote`,
`expandableBlockquote`, `pullQuote`, `collage`, `slideshow`, `details`, `map`, `table`, media
(`animation`, `audio`, `document`, `photo`, `video`, `voiceNote`), `thinking`, and `buttonRow`.
Inline rich-text nodes (`bold`, `italic`, `underline`, `strikethrough`, `spoiler`, `code`, `marked`,
`subscript`, `superscript`, `dateTime`, `textMention`, `customEmoji`, links, mentions, references,
and formulas) are available from the same namespace and can be nested in block text. Media accepts
a URL/file id, an uploaded `Blob`/`File`, or a complete `InputMedia*` object. Upload helpers are
async; await them before passing a file to a native media helper:

```typescript
import { MediaUpload } from "gramio";
import { blocks } from "gramio/rich";

bot.command("upload-cover", async (ctx) => {
    const cover = await MediaUpload.path("./cover.jpg");
    return ctx.send(blocks([blocks.photo(cover, { caption: "Cover" })]));
});
```

Serialization checks Telegram's 10.3 limits
(32,768 UTF-8 text bytes, 500 blocks, 16 nesting levels, 50 media attachments, and 20 table
columns); button rows are limited to 1–8 buttons.

Use a complete `InputMedia*` object when you need media options such as a thumbnail or video cover,
for example `MediaInput.video(file, { thumbnail, cover })`. Put the visible rich-block caption in
the helper options; Telegram ignores `caption` nested inside `InputMedia*` for native rich media
blocks. File extraction also walks nested blockquotes, lists, collages, slideshows, and details.

Helpers escape strings. Do not concatenate untrusted input into raw rich HTML/Markdown.

## Rich JSX

```tsx
/** @jsxImportSource @gramio/jsx/rich */

const report = (
    <rich>
        <blockquote expandable credit="Build bot">Details</blockquote>
        <document url="https://example.com/report.pdf" caption="Report" />
        <table compact align={["left", "right"]}>
            <tr><th>Package</th><th>Version</th></tr>
            <tr><td>gramio</td><td>0.15.1</td></tr>
        </table>
        <button-row align="right">
            <button type="url" url="https://gramio.dev">Open</button>
            <button type="disabled">Soon</button>
        </button-row>
    </rich>
);
```

## Uploads are recursive

`@gramio/files` finds `MediaUpload`, `Blob`, `File`, and promised files under `sendRichMessage.rich_message.blocks` and `.media`, including nested document media, thumbnails, and covers.

Inline-result rich content (`InputRichMessageContent`) and `editMessageText` with an
`inline_message_id` are upload-free Telegram paths: use an existing `file_id`, not a new
`Blob`/`File` or an explicit media URL.

```typescript
import { MediaUpload } from "gramio";

const report = await MediaUpload.path("./report.pdf");
await bot.api.sendRichMessage({
    chat_id: chatId,
    rich_message: {
        html: '<tg-document src="tg://document?id=report"></tg-document>',
        media: [{
            id: "report",
            media: { type: "document", media: report },
        }],
    },
});
```

## Drafts and stopping

```typescript
await bot.api.sendRichMessageDraft({
    chat_id: userId,
    draft_id: 1001,
    rich_message: { markdown: "## Generating…" },
    can_stop: true,
    keep_on_stop: true,
});

bot.on("stopped_message_generation", (ctx) => {
    ctx.draftId;
    ctx.threadId;
    ctx.chatId;
    return ctx.send("Generation stopped.");
});
```

- Draft IDs are application-defined, non-zero integers.
- Finalize with `sendRichMessage`; streamed drafts expire.
- Never pass `MediaUpload`, `Blob`, or a fresh URL upload to `sendRichMessageDraft`. Telegram forbids direct draft uploads and GramIO deliberately excludes the method from extraction.
- `stopped_message_generation` is in `AllowedUpdatesFilter.default`; it is not opt-in.

## Ephemeral rich messages

Use the strict 10.3 nesting. Top-level `receiver_user_id` / `callback_query_id` aliases do not exist.

```typescript
await bot.api.sendRichMessage({
    chat_id: chatId,
    rich_message: report.toInputRichMessage(),
    ephemeral_message_parameters: {
        receiver_user_id: userId,
        callback_query_id: callbackQueryId,
        replace_callback_query_message: true,
    },
});
```

<!--
Source: https://gramio.dev/guides/rich-messages
-->
