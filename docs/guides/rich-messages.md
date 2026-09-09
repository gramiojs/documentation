---
title: Rich Messages in Bot API 10.3 | GramIO

head:
    - - meta
      - name: "description"
        content: "Build Telegram rich messages with GramIO buttons, documents, expandable quotes, compact tables, uploads, streaming drafts, and stop-generation updates."

    - - meta
      - name: "keywords"
        content: "gramio, telegram bot, rich messages, sendRichMessage, sendRichMessageDraft, rich buttons, document upload, compact table, stopped_message_generation, Bot API 10.3"
---

# Rich Messages

Rich Messages add block layouts beyond regular `text` plus `MessageEntity[]`: headings, lists, documents, button rows, expandable quotations, tables, media collections, and streaming drafts. GramIO supports two rich-formatting lanes plus JSX and raw API surfaces:

1. The Markdown lane (`rich`, `markdownTable`) for the rich-markdown dialect.
2. The native structured lane (`blocks`, `table`) for `InputRichBlock*` objects.
3. `@gramio/jsx/rich` for rich JSX.
4. Raw `bot.api.sendRichMessage()` structures for full Bot API control and uploads.

## Compose a rich message

```ts twoslash
import { Bot, bold, format } from "gramio";
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

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("report", (ctx) =>
	ctx.send(
		rich([
			heading(1, "Release report"),
			paragraph(format`Status: ${bold`ready`}`),
			quote("Details can be expanded", {
				expandable: true,
				credit: "Build system",
			}),
			document({
				url: "https://example.com/report.pdf",
				caption: "Full report",
			}),
			markdownTable(
				[
					["Package", "Version"],
					["gramio", "0.14.0"],
				],
				{ compact: true, align: ["left", "right"] },
			),
			buttonRow(
				[
					button("Open", { type: "url", url: "https://gramio.dev" }),
					button("Refresh", {
						type: "callback_data",
						data: "refresh-report",
					}),
					button("Soon", { type: "disabled" }),
				],
				{ align: "right" },
			),
		]),
	),
);
```

The helpers escape user-controlled strings. Do not concatenate raw rich Markdown/HTML around untrusted input.
For a complete string from a trusted serializer, `rawRich()` is the explicit escape hatch; it keeps
Markdown/HTML syntax intact and must never receive user-controlled text.

## Native structured tables

Use `table()` when the message should contain Telegram's native `InputRichBlockTable`. It can be sent directly, or composed with other structured blocks through `blocks([...])`. The first row is a header by default; `align` and `valign` default to `left` and `top`, so the required Telegram cell fields are filled automatically.

```ts twoslash
import { Bot } from "gramio";
import { blocks, table } from "gramio/rich";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("native-report", (ctx) =>
	ctx.send(
		blocks([
			blocks.heading(1, "Release report"),
			table(
				[
					["Package", "Version"],
					["gramio", "0.14.0"],
				],
				{ bordered: true, striped: true, compact: true, align: ["left", "right"] },
			),
		]),
	),
);
```

For spans or per-cell formatting, use `cell()`. When a cell spans rows, omit the covered cells in
the following rows; alignment is calculated against the resulting logical column:

```ts
import { blocks, table } from "gramio/rich";

const summary = table({
	rows: [
		[
			blocks.cell("Package", { header: true }),
			blocks.cell("Version", { header: true, align: "right" }),
		],
		[blocks.cell("Total", { colSpan: 2, align: "center" })],
	],
	caption: "Release summary",
});
```

`markdownTable()` remains available when Markdown output is intentional, especially when composing a legacy `rich([...])` message. Do not interpolate a native block into `rich` — Markdown and structured rich messages are separate send formats.
`streamRichMessage()` is Markdown-chunk based; send native blocks with `ctx.send()` or
`ctx.sendRichMessage()` instead.

### Native DSL

The `blocks` namespace covers every `InputRichBlock` and every `RichText` node from Bot API 10.3.
Inline nodes can be nested and mixed with `format` values; block helpers return a `RichBlockNode`
that can be sent directly or composed in `blocks([...])`:

```ts
import { bold, format } from "gramio";
import { blocks } from "gramio/rich";

const report = blocks([
	blocks.h1("Release report"),
	blocks.paragraph([
		blocks.bold("Status: "),
		format`${bold("ready")}`,
		" — ",
		blocks.url("open changelog", "https://gramio.dev/changelog"),
	]),
	blocks.orderedList([
		blocks.listItem("First step"),
		blocks.listItem("Second step"),
	], { start: 1, type: "1" }),
	blocks.taskList([
		{ content: "Ship", done: true },
		{ content: "Announce" },
	]),
	blocks.details("Diagnostics", [
		blocks.pre("bun test", "sh"),
		blocks.table([
			["Package", "Version"],
			[blocks.cell("gramio"), blocks.cell("0.15.0")],
		], { bordered: true, striped: true }),
	], { open: true }),
	blocks.photo("https://example.com/cover.jpg", {
		caption: "Cover",
		credit: "Build bot",
	}),
	blocks.buttonRow([
		blocks.button("Open", { type: "url", url: "https://gramio.dev" }),
		blocks.button("Refresh", { type: "callback_data", data: "refresh" }),
	]),
]);

bot.command("native-report", (ctx) => ctx.send(report));
```

Useful aliases include `blocks.h1`–`blocks.h6`, `blocks.hr`, `blocks.quote`,
`blocks.expandableQuote`, `blocks.pre`, `blocks.voice`, and `blocks.link`. Media helpers accept a
URL/file id or a complete `InputMedia*` object. `blocks.map()` accepts either a
`{ latitude, longitude }` location or latitude/longitude numbers. `blocks.buttonRow()` checks
Telegram's 1–8 button limit; native serialization also checks the Bot API limits (500 blocks,
50 media attachments, 20 table columns, 16 nesting levels, and 32,768 UTF-8 text bytes).

### Migration from `@gramio/format` 0.11

This release intentionally changes the meaning of `table()`: it now creates a native Telegram
table. Code that used the old Markdown serializer must rename the call to `markdownTable()`.
This is a breaking release (`@gramio/format` 0.12 and `gramio` 0.15).

## Rich JSX

Use a separate JSX import source so regular formatting JSX and rich JSX stay distinct:

```tsx
/** @jsxImportSource @gramio/jsx/rich */

const message = (
	<rich>
		<h1>Release report</h1>
		<blockquote expandable credit="Build system">
			Details can be expanded
		</blockquote>
		<document url="https://example.com/report.pdf" caption="Full report" />
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

Pass `message` to `ctx.send()` exactly like a value created by `rich()`.

## Upload files inside rich content

`@gramio/files` recursively finds uploads in `rich_message.blocks` and `rich_message.media`, including nested document media, thumbnails, and covers. The middleware rewrites each upload to an `attach://…` reference.

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("upload-report", async (ctx) => {
	const report = await MediaUpload.path("./report.pdf");

	return bot.api.sendRichMessage({
		chat_id: ctx.chatId,
		rich_message: {
			html: '<tg-document src="tg://document?id=report"></tg-document>',
			media: [
				{
					id: "report",
					media: { type: "document", media: report },
				},
			],
		},
	});
});
```

You can also put a document directly in `rich_message.blocks` with an `InputRichBlockDocument`; recursive uploads are supported there too.

## Stream a draft

Draft IDs are application-defined non-zero integers. Reusing an ID animates the next partial result. A draft is temporary: send the finalized message with `sendRichMessage` when generation finishes.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

await bot.api.sendRichMessageDraft({
	chat_id: 42,
	draft_id: 1001,
	rich_message: { markdown: "## Generating…" },
	can_stop: true,
	keep_on_stop: true,
});
```

::: warning No direct uploads in drafts
Telegram forbids direct file uploads in `sendRichMessageDraft`. GramIO therefore excludes this method from upload extraction. Reuse an existing `file_id`; do not pass `MediaUpload`, `Blob`, or a new upload URL.
:::

## Handle stop-generation updates

When `can_stop` is enabled and the user presses Stop, Telegram sends `stopped_message_generation`. It is part of GramIO's default allowed updates; no manual opt-in is needed.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("stopped_message_generation", async (ctx) => {
	console.log(ctx.draftId, ctx.threadId, ctx.chatId, ctx.chatType);
	await ctx.send("Generation stopped.");
});
```

`ctx.draftId` identifies the stopped draft. `ctx.threadId` is present for a topic, and follow-up sends automatically keep that thread.

## See also

- [`sendRichMessage`](/telegram/methods/sendRichMessage)
- [`sendRichMessageDraft`](/telegram/methods/sendRichMessageDraft)
- [`InputRichMessage`](/telegram/types/InputRichMessage)
- [`MessageGenerationStopped`](/telegram/types/MessageGenerationStopped)
- [Files](/files/overview)
- [Ephemeral Messages](/guides/ephemeral-messages)
