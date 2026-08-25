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

Rich Messages add block layouts beyond regular `text` plus `MessageEntity[]`: headings, lists, documents, button rows, expandable quotations, tables, media collections, and streaming drafts. GramIO supports three authoring levels:

1. `@gramio/format/rich` helpers for safe composition.
2. `@gramio/jsx/rich` for rich JSX.
3. Raw `bot.api.sendRichMessage()` structures for full Bot API control and uploads.

## Compose a rich message

```ts twoslash
import { Bot, bold, format } from "gramio";
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
			table(
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
