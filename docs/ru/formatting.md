---
title: Форматирование сообщений в Telegram ботах - Оформление текста и сущностей (entities)

head:
    - - meta
      - name: "description"
        content: "Узнайте, как форматировать сообщения в Telegram ботах с помощью GramIO. Создавайте текст с жирным, курсивом, ссылками, блоками кода, спойлерами и многим другим."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, форматирование сообщений, text formatting, parse_mode, MessageEntity, форматирование без parse_mode, жирный текст, курсив, ссылки в сообщениях, упоминания пользователей, блоки кода, pre-formatted, цитаты, спойлеры, подчеркивание, зачеркивание, HTML-разметка, MarkdownV2, template literals, форматирование списков, строковые шаблоны"
---

<script setup>
import Spoiler from '../.vitepress/components/Spoiler.vue'

</script>

# Форматирование сообщений

[`@gramio/format`](https://github.com/gramiojs/format) - это встроенный пакет GramIO. Вы также можете использовать его вне этого фреймворка, так как он не зависит от него.

Смотрите также [API Reference](https://jsr.io/@gramio/format/doc).

> [!IMPORTANT]
> **Не используйте `parse_mode` вместе с GramIO.** Шаблонный литерал `format` и функции-сущности генерируют структурированные объекты `MessageEntity`, а не HTML/Markdown-строки. Указание `parse_mode: "HTML"` или `parse_mode: "MarkdownV2"` рядом с результатом `@gramio/format` сломает ваши сообщения. GramIO сам передаёт entities при отправке — `parse_mode` не нужен.

## Format

Шаблонный литерал, который помогает создавать сущности сообщений для форматирования текста.

Используйте его, если хотите удалить все отступы в начале каждой строки. (как [common-tags#stripindents](https://www.npmjs.com/package/common-tags#stripindents) или [dedent](https://www.npmjs.com/package/dedent))

> [!IMPORTANT]
> Для форматирования с **массивами** всегда используйте помощник [`join`](#join) — никогда нативный `.join()`.

```ts twoslash
import { format, bold, link, italic, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
format`какой-то текст`;
// или
format`${bold`Хмм...`} ${link(
    "GramIO",
    "https://github.com/gramiojs/gramio",
)}?`;
```

Давайте отправим что-нибудь...

```ts twoslash
import { format, bold, link, italic, spoiler, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.api.sendMessage({
    chat_id: 12321,
    text: format`${bold`Hi!`}

		Can ${italic("you")} help ${spoiler`me`}?
	
			Can you give me ${link("a star", "https://github.com/gramiojs/gramio")}?`,
});
```

![format](/ru/formatting/format.png)

## FormatSaveIndents

Шаблонный литерал, который помогает создавать сущности сообщений для форматирования текста.

Используйте его, если хотите сохранить все отступы.

> [!IMPORTANT]
> Для форматирования с **массивами** всегда используйте помощник [`join`](#join) — никогда нативный `.join()`.

```ts twoslash
import { formatSaveIndents, bold, link, italic, spoiler, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.api.sendMessage({
    chat_id: 12321,
    text: formatSaveIndents`${bold`Hi!`}

		Can ${italic("you")} help ${spoiler`me`}?
	
			Can you give me ${link("a star", "https://github.com/gramiojs/gramio")}?`,
});
```

![format-save-indents](/formatting/format-save-indents.png)

## Сущности

### **Жирный**

Форматирует текст как **жирный**. Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, bold } from "@gramio/format";
// ---cut---
format`Format text as ${bold`bold`}`;
```

![bold example](/formatting/bold.png)

### _Курсив_

Форматирует текст как _курсив_. Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, italic } from "@gramio/format";
// ---cut---
format`Format text as ${italic`italic`}`;
```

![italic example](/formatting/italic.png)

### <u>Подчеркнутый</u>

Форматирует текст как <u>подчеркнутый</u>. Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, underline } from "@gramio/format";
// ---cut---
format`Format text as ${underline`underlined`}`;
```

![underline example](/formatting/underline.png)

### ~~Зачеркнутый~~

Форматирует текст как ~~зачеркнутый~~. Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, strikethrough } from "@gramio/format";
// ---cut---
format`Format text as ${strikethrough`strikethrough`}`;
```

![strikethrough example](/formatting/strikethrough.png)

### <Spoiler>Спойлер</Spoiler>

Форматирует текст как <Spoiler>спойлер</Spoiler>. Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, spoiler } from "@gramio/format";
// ---cut---
format`Format text as ${spoiler`spoiler`}`;
```

![spoiler example](/formatting/spoiler.png)

> ### Цитата

Форматирует текст как цитату. Не может быть вложенной.

```ts twoslash
import { format, blockquote } from "@gramio/format";
// ---cut---
format`Format text as ${blockquote`quote`}`;
```

![blockquote example](/formatting/blockquote.png)

> ### Раскрывающаяся цитата

Форматирует текст как раскрывающуюся цитату. Не может быть вложенной.

```ts twoslash
import { format, expandableBlockquote } from "@gramio/format";
function loremIpsum(options: { count: number }): string {
    return "";
}
// ---cut---
format`Format text as ${expandableBlockquote(loremIpsum({ count: 20 }))}`;
```

![expandable blockquote example](/formatting/expandable_blockquote.png)

### `Код`

Форматирует текст как `код`. Удобно для скопированных элементов. Нельзя комбинировать с любым другим форматированием.

```ts twoslash
import { format, code } from "@gramio/format";
// ---cut---
format`Format text as ${code`code`}`;
```

![code example](/formatting/code.png)

### `Pre`

Форматирует текст как `pre`. Нельзя комбинировать с любым другим форматированием. ([Поддерживаемые языки](https://github.com/TelegramMessenger/libprisma#supported-languages))

```ts twoslash
import { format, pre } from "@gramio/format";
// ---cut---
format`Format text as ${pre`pre`}`;
// или с указанием языка
format`Format text as ${pre(`console.log("pre with language")`, "js")}`;
```

![pre example](/formatting/pre.png)

### [Ссылка](https://github.com/gramiojs/gramio)

Форматирует текст как [ссылку](https://github.com/gramiojs/gramio). Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, link } from "@gramio/format";
// ---cut---
format`Format text as ${link("link", "https://github.com/gramiojs/gramio")}`;
```

![link example](/formatting/link.png)

### [Упоминание](https://github.com/gramiojs/gramio)

Форматирует текст как [упоминание](https://github.com/gramiojs/gramio). Нельзя комбинировать с `code` и `pre`.

```ts twoslash
import { format, mention } from "@gramio/format";
// ---cut---
format`Format text as ${mention("mention", {
    id: 12312312,
    is_bot: false,
    first_name: "GramIO",
})}`;
```

![mention example](/formatting/mention.png)

### 🄲 🅄 🅂 🅃 🄾 🄼 ㅤ🄴 🄼 🄾 🄹 🄸

Вставляет пользовательский эмодзи по его id.

```ts twoslash
import { format, customEmoji } from "@gramio/format";
// ---cut---
format`text with emoji - ${customEmoji("⚔️", "5222106016283378623")}`;
```

> [!WARNING]
> Telegram теперь разрешает пользовательские эмодзи для всех ботов, **если** владелец бота имеет Telegram Premium **и** выполнено одно из условий:
>
> - сообщение в личном чате бота (DM) или обычном чате **(не в канале)**, или
> - это результат inline-запроса, но вы редактируете отправленное сообщение после отправки (в исходном сообщении результата inline custom emoji недоступны; отредактируйте сообщение, чтобы они применились).
>   Ранее это было доступно только ботам, покупавшим дополнительные usernames на Fragment; теперь покупка username не требуется при выполнении условий выше.

## Составление format-шаблонов

`format` возвращает объект **Formattable** — не обычную строку. Он хранит как текст, так и смещения сущностей. Результат можно сохранить в переменную и вставить в другой `format`-шаблон: смещения сущностей будут корректно пересчитаны.

```ts twoslash
import { format, bold, italic } from "@gramio/format";
// ---cut---
// ✅ Сохраняем результат в переменную, затем встраиваем
const greeting = format`Привет, ${bold`Мир`}!`;
const message = format`${greeting} ${italic`Как дела?`}`;
// Жирный из `greeting` корректно сдвинут внутри `message`
```

> [!WARNING]
> **Никогда не вставляйте Formattable в обычный шаблонный литерал.** Вызов `.toString()` (который происходит при `` `${formattable}` ``) уничтожает все сущности и возвращает простую строку:
>
> ```ts
> // ❌ Неверно — сущности теряются
> const a = `Привет, ${bold`Мир`}`;     // bold превращается в простой текст
> const b = `${a} и ${italic`ещё`}`;    // italic сохранится, bold — нет
>
> // ✅ Верно — всегда используйте format``
> const a = format`Привет, ${bold`Мир`}`;
> const b = format`${a} и ${italic`ещё`}`;
> ```

## Помощники

### Join

Помощник для корректного форматирования массивов. Нативный `Array.prototype.join()` преобразует каждый элемент в строку через `.toString()`, что **уничтожает все данные сущностей**.

> [!WARNING]
> **Не используйте `[...].join()` с форматируемыми значениями.** Каждая функция-сущность возвращает объект Formattable. Вызов `.join()` на массиве таких объектов уничтожает все сущности, оставляя простой текст без стилей:
>
> ```ts
> // ❌ Неверно — все bold/italic/etc. молча удаляются
> const text = items.map((x) => bold(x)).join(", ");
>
> // ✅ Верно — используйте помощник join
> const text = join(items, (x) => bold(x), ", ");
> ```

Разделитель по умолчанию - `, `

```ts twoslash
import { format, join, bold } from "@gramio/format";
// ---cut---
format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`;
```

## HTML

Вы можете конвертировать HTML-разметку в Telegram-сущности с помощью функции `htmlToFormattable` из субмодуля `@gramio/format/html`.

Это удобно, когда контент приходит из CMS, редактора с форматированием (TipTap, ProseMirror) или LLM, которая генерирует HTML. Подход тот же, что и для Markdown: парсим локально в сущности и отправляем без `parse_mode`. Некорректный HTML деградирует до обычного текста, не ломая отправку.

> [!WARNING]
> Эта функция может измениться в будущем.

### Установка

Для работы с HTML требуется [`node-html-parser`](https://www.npmjs.com/package/node-html-parser) в качестве peer-зависимости:

::: code-group

```bash [npm]
npm install node-html-parser
```

```bash [yarn]
yarn add node-html-parser
```

```bash [pnpm]
pnpm add node-html-parser
```

```bash [bun]
bun add node-html-parser
```

:::

### Использование

```ts
import { htmlToFormattable } from "@gramio/format/html";
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command("start", (ctx) => {
    const html = `<h1>Привет!</h1>
<p><strong>Жирный</strong> и <em>курсив</em></p>
<ul><li>пункт один</li><li>пункт два</li></ul>
<p>Посетите <a href="https://gramio.dev">gramio.dev</a></p>`;

    ctx.send(htmlToFormattable(html));
});
```

### Поддерживаемые теги

| HTML | Telegram-сущность |
|---|---|
| `<b>`, `<strong>` | bold |
| `<i>`, `<em>` | italic |
| `<u>` | underline |
| `<s>`, `<del>`, `<strike>` | strikethrough |
| `` `<code>` `` | code |
| `<pre><code class="language-js">` | pre (с языком) |
| `<blockquote>` | blockquote |
| `<a href="...">` | text_link |
| `<h1>`–`<h6>` | bold |
| `<ul>`, `<ol>`, `<li>` | обычный текст с маркером/номером |
| `<br>` | перенос строки |

## Markdown

Вы можете конвертировать стандартный Markdown-текст в Telegram-сущности с помощью функции `markdownToFormattable` из субмодуля `@gramio/format/markdown`.

Это особенно полезно для:

- **Вывода LLM** — языковые модели (ChatGPT, Claude и др.) естественным образом генерируют стандартный Markdown. Вы можете передать их вывод напрямую в `markdownToFormattable` и отправить в Telegram с правильным форматированием.
- **Данных из баз данных или внешних источников** — когда вы храните или получаете Markdown-текст и хотите отобразить его в Telegram.

В отличие от встроенного `parse_mode` Telegram (`HTML` или `MarkdownV2`), этот подход **не сломает ваше сообщение при невалидной разметке**. `parse_mode` Telegram отклонит всё сообщение при синтаксической ошибке (например, незакрытый тег или неэкранированный символ). С `markdownToFormattable` текст парсится локально в сущности — если markdown некорректен, он graceful degradation до простого текста, а не ломает отправку.

> [!WARNING]
> Эта функция может измениться в будущем.

### Установка

Для работы с Markdown необходим [`marked`](https://www.npmjs.com/package/marked) как peer-зависимость:

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

### Использование

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

### Поддерживаемый синтаксис

| Markdown | Telegram-сущность |
|---|---|
| `**bold**` | bold |
| `*italic*` | italic |
| `~~strikethrough~~` | strikethrough |
| `` `inline code` `` | code |
| ` ```lang ... ``` ` | pre (с языком) |
| `[text](url)` | text_link |
| `![alt](url)` | text_link (изображения становятся ссылками) |
| `> blockquote` | blockquote |
| `# Heading` | bold (все уровни) |
| `- item` / `1. item` | простой текст с префиксом |
```
