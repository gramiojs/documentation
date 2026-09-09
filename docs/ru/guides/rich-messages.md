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

Rich Messages добавляют блочную разметку поверх обычных `text` и `MessageEntity[]`: заголовки, списки, документы, ряды кнопок, раскрываемые цитаты, таблицы, медиаколлекции и потоковые черновики. В GramIO есть два rich-формата, а также поверхности JSX и raw API:

1. Markdown-путь (`rich`, `markdownTable`) для rich-markdown диалекта.
2. Native structured-путь (`blocks`, `table`) для объектов `InputRichBlock*`.
3. `@gramio/jsx/rich` для rich JSX.
4. Сырые структуры `bot.api.sendRichMessage()` для полного контроля и загрузок.

## Сборка rich-сообщения

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
			markdownTable(
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
Для полной строки от доверенного сериализатора есть явный escape hatch `rawRich()` — он сохраняет
Markdown/HTML как есть; пользовательский текст передавать в него нельзя.

## Native structured-таблицы

Используйте `table()`, если сообщению нужна настоящая Telegram-таблица `InputRichBlockTable`. Её можно отправить напрямую или собрать вместе с другими structured-блоками через `blocks([...])`. Первый ряд по умолчанию считается заголовком; `align` и `valign` автоматически получают значения `left` и `top`, поэтому обязательные поля Telegram для ячеек заполняются сами.

```ts twoslash
import { Bot } from "gramio";
import { blocks, table } from "gramio/rich";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("native-report", (ctx) =>
	ctx.send(
		blocks([
			blocks.heading(1, "Отчёт о релизе"),
			table(
				[
					["Пакет", "Версия"],
					["gramio", "0.14.0"],
				],
				{ bordered: true, striped: true, compact: true, align: ["left", "right"] },
			),
		]),
	),
);
```

Для spans и форматирования отдельных ячеек используйте `cell()`. Если ячейка занимает несколько
рядов, в следующих рядах пропускайте занятые ею ячейки — выравнивание рассчитывается по логической
колонке:

```ts
import { blocks, table } from "gramio/rich";

const summary = table({
	rows: [
		[
			blocks.cell("Пакет", { header: true }),
			blocks.cell("Версия", { header: true, align: "right" }),
		],
		[blocks.cell("Всего", { colSpan: 2, align: "center" })],
	],
	caption: "Сводка релиза",
});
```

`markdownTable()` остаётся доступной, когда нужен именно Markdown, особенно при композиции старого сообщения `rich([...])`. Native block нельзя интерполировать в `rich`: это разные форматы отправки rich-сообщений.
`streamRichMessage()` работает с Markdown-чанками; native-блоки отправляйте через `ctx.send()` или
`ctx.sendRichMessage()`.

### Native DSL

Пространство имён `blocks` покрывает все `InputRichBlock` и все узлы `RichText` из Bot API 10.3.
Inline-узлы можно вкладывать друг в друга и смешивать со значениями `format`; блочные хелперы
возвращают `RichBlockNode`, который можно отправить отдельно или собрать в `blocks([...])`:

```ts
import { bold, format } from "gramio";
import { blocks } from "gramio/rich";

const report = blocks([
	blocks.h1("Отчёт о релизе"),
	blocks.paragraph([
		blocks.bold("Статус: "),
		format`${bold("готово")}`,
		" — ",
		blocks.url("открыть changelog", "https://gramio.dev/changelog"),
	]),
	blocks.orderedList([
		blocks.listItem("Первый шаг"),
		blocks.listItem("Второй шаг"),
	], { start: 1, type: "1" }),
	blocks.taskList([
		{ content: "Опубликовать", done: true },
		{ content: "Объявить" },
	]),
	blocks.details("Диагностика", [
		blocks.pre("bun test", "sh"),
		blocks.table([
			["Пакет", "Версия"],
			[blocks.cell("gramio"), blocks.cell("0.15.0")],
		], { bordered: true, striped: true }),
	], { open: true }),
	blocks.photo("https://example.com/cover.jpg", {
		caption: "Обложка",
		credit: "Система сборки",
	}),
	blocks.buttonRow([
		blocks.button("Открыть", { type: "url", url: "https://gramio.dev" }),
		blocks.button("Обновить", { type: "callback_data", data: "refresh" }),
	]),
]);

bot.command("native-report", (ctx) => ctx.send(report));
```

Полезные алиасы: `blocks.h1`–`blocks.h6`, `blocks.hr`, `blocks.quote`,
`blocks.expandableQuote`, `blocks.pre`, `blocks.voice` и `blocks.link`. Медиахелперы принимают
URL/file id или полный объект `InputMedia*`. `blocks.map()` принимает либо локацию
`{ latitude, longitude }`, либо два числа latitude/longitude. `blocks.buttonRow()` проверяет лимит
Telegram в 1–8 кнопок; native-сериализация также проверяет лимиты Bot API (500 блоков, 50 медиа,
20 колонок таблицы, 16 уровней вложенности и 32 768 UTF-8 байт текста).

### Миграция с `@gramio/format` 0.11

В этом релизе смысл `table()` намеренно изменён: теперь функция создаёт native-таблицу Telegram.
Код, который использовал старый Markdown-сериализатор, нужно заменить на `markdownTable()`.
Это breaking release (`@gramio/format` 0.12 и `gramio` 0.15).

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
