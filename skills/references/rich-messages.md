---
name: rich-messages
description: Bot API 10.3 rich-message authoring with gramio/rich helpers, rich JSX, recursive uploads, streaming drafts, and stopped_message_generation handling.
---

# Rich Messages

Rich messages are not regular `text` plus `entities`. They are sent through `sendRichMessage` as exactly one of `rich_message.markdown`, `.html`, or `.blocks`.

## Prefer the safe helpers

```typescript
import { bold, format } from "gramio";
import {
    button,
    buttonRow,
    document,
    heading,
    paragraph,
    quote,
    rich,
    table,
} from "gramio/rich";

const report = rich([
    heading(1, "Release report"),
    paragraph(format`Status: ${bold`ready`}`),
    quote("Expandable details", { expandable: true, credit: "Build bot" }),
    document({ url: "https://example.com/report.pdf", caption: "Report" }),
    table(
        [["Package", "Version"], ["gramio", "0.14.0"]],
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
            <tr><td>gramio</td><td>0.14.0</td></tr>
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
