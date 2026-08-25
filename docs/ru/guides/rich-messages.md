---
title: Rich Messages в Bot API 10.3 | GramIO

head:
    - - meta
      - name: "description"
        content: "Создание Rich Messages в Telegram с кнопками, документами, раскрываемыми цитатами, компактными таблицами, загрузками, черновиками и остановкой генерации."

    - - meta
      - name: "keywords"
        content: "gramio, telegram бот, rich messages, sendRichMessage, sendRichMessageDraft, кнопки, загрузка документов, stopped_message_generation, Bot API 10.3"
---

# Rich Messages

Rich Messages добавляют блочную разметку поверх обычных `text` и `MessageEntity[]`: заголовки, списки, документы, ряды кнопок, раскрываемые цитаты, таблицы, медиаколлекции и потоковые черновики. GramIO предоставляет три уровня:

1. Хелперы `@gramio/format/rich` для безопасной композиции.
2. `@gramio/jsx/rich` для rich JSX.
3. Сырые структуры `bot.api.sendRichMessage()` для полного контроля и загрузок.

## Сборка rich-сообщения

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
			heading(1, "Отчёт о релизе"),
			paragraph(format`Статус: ${bold`готово`}`),
			quote("Подробности можно раскрыть", {
				expandable: true,
				credit: "Система сборки",
			}),
			document({
				url: "https://example.com/report.pdf",
				caption: "Полный отчёт",
			}),
			table(
				[
					["Пакет", "Версия"],
					["gramio", "0.14.0"],
				],
				{ compact: true, align: ["left", "right"] },
			),
			buttonRow(
				[
					button("Открыть", { type: "url", url: "https://gramio.dev" }),
					button("Обновить", {
						type: "callback_data",
						data: "refresh-report",
					}),
					button("Скоро", { type: "disabled" }),
				],
				{ align: "right" },
			),
		]),
	),
);
```

Хелперы экранируют пользовательские строки. Не собирайте raw rich Markdown/HTML конкатенацией вокруг недоверенных данных.

## Rich JSX

Используйте отдельный JSX import source, чтобы обычный форматирующий JSX и rich JSX не смешивались:

```tsx
/** @jsxImportSource @gramio/jsx/rich */

const message = (
	<rich>
		<h1>Отчёт о релизе</h1>
		<blockquote expandable credit="Система сборки">
			Подробности можно раскрыть
		</blockquote>
		<document url="https://example.com/report.pdf" caption="Полный отчёт" />
		<table compact align={["left", "right"]}>
			<tr><th>Пакет</th><th>Версия</th></tr>
			<tr><td>gramio</td><td>0.14.0</td></tr>
		</table>
		<button-row align="right">
			<button type="url" url="https://gramio.dev">Открыть</button>
			<button type="disabled">Скоро</button>
		</button-row>
	</rich>
);
```

Передайте `message` в `ctx.send()` так же, как значение от `rich()`.

## Загрузка файлов внутри rich-сообщения

`@gramio/files` рекурсивно находит загрузки в `rich_message.blocks` и `rich_message.media`, включая вложенные документы, миниатюры и обложки. Middleware заменяет каждую загрузку ссылкой `attach://…`.

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

Документ можно поместить и напрямую в `rich_message.blocks` как `InputRichBlockDocument`; рекурсивные загрузки там тоже поддерживаются.

## Потоковый черновик

Draft ID — заданное приложением ненулевое число. Повторное использование ID анимирует следующий частичный результат. Черновик временный: после завершения отправьте итог через `sendRichMessage`.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

await bot.api.sendRichMessageDraft({
	chat_id: 42,
	draft_id: 1001,
	rich_message: { markdown: "## Генерация…" },
	can_stop: true,
	keep_on_stop: true,
});
```

::: warning В черновиках нет прямых загрузок
Telegram запрещает прямую загрузку файлов в `sendRichMessageDraft`, поэтому GramIO исключает этот метод из upload extraction. Переиспользуйте существующий `file_id`; не передавайте `MediaUpload`, `Blob` или новый URL для загрузки.
:::

## Обработка остановки генерации

Если включён `can_stop` и пользователь нажал Stop, Telegram отправляет `stopped_message_generation`. Обновление входит в стандартный набор GramIO — ручной opt-in не нужен.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("stopped_message_generation", async (ctx) => {
	console.log(ctx.draftId, ctx.threadId, ctx.chatId, ctx.chatType);
	await ctx.send("Генерация остановлена.");
});
```

`ctx.draftId` идентифицирует остановленный черновик. `ctx.threadId` присутствует в теме, а последующая отправка автоматически сохраняет эту тему.

## Смотрите также

- [`sendRichMessage`](/telegram/methods/sendRichMessage)
- [`sendRichMessageDraft`](/telegram/methods/sendRichMessageDraft)
- [`InputRichMessage`](/telegram/types/InputRichMessage)
- [`MessageGenerationStopped`](/telegram/types/MessageGenerationStopped)
- [Файлы](/ru/files/overview)
- [Эфемерные сообщения](/ru/guides/ephemeral-messages)
