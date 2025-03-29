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
import Spoiler from '../../.vitepress/components/Spoiler.vue'

</script>

# Форматирование сообщений

[`@gramio/format`](https://github.com/gramiojs/format) - это встроенный пакет GramIO. Вы также можете использовать его вне этого фреймворка, так как он не зависит от него.

Смотрите также [API Reference](https://jsr.io/@gramio/format/doc).

## Format

Шаблонный литерал, который помогает создавать сущности сообщений для форматирования текста.

Используйте его, если хотите удалить все отступы в начале каждой строки. (как [common-tags#stripindents](https://www.npmjs.com/package/common-tags#stripindents) или [dedent](https://www.npmjs.com/package/dedent))

> [!IMPORTANT]
> Для форматирования с **массивами** используйте его с помощником [`join`](#join)

```ts twoslash
import { format, bold, link, italic, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
format`какой-то текст`;
// или
format`${bold`Хмм...`} ${link(
    "GramIO",
    "https://github.com/gramiojs/gramio"
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

**ПРИМЕЧАНИЕ**: для форматирования с **массивами** используйте его с помощником [`join`](#join)

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
> Сущности пользовательских эмодзи могут использоваться только ботами, которые приобрели дополнительные имена пользователей на [Fragment](https://fragment.com/).

## Помощники

### Join

Помощник для отличной работы с форматируемыми массивами. ([].join разрушает стилизацию)

Разделитель по умолчанию - `, `

```ts twoslash
import { format, join, bold } from "@gramio/format";
// ---cut---
format`${join(["test", "other"], (x) => format`${bold(x)}`, "\n")}`;
```
