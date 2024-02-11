# Formatting

[`@gramio/format`](https://github.com/gramiojs/format) is built-in GramIO plugin. You can also use it outside of this framework because it is framework-agnostic.

See also [API Reference](https://tsdocs.dev/docs/@gramio/format).

## Usage

```ts twoslash
import { format, bold, link, italic, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
format`some text`;
// or
format`${bold`Hmm...`} ${link(
    "GramIO",
    "https://github.com/gramiojs/gramio"
)}?`;
```

```ts twoslash
import { format, bold, link, italic, spoiler, Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.api.sendMessage({
    chat_id: 12321,
    text: format`${bold`Hi!`} Can ${italic(
        `you`
    )} help ${spoiler`me`}? Can you give me a ${link(
        "star",
        "https://github.com/gramiojs/gramio"
    )}?`,
});
```

result is

![example](/formatting/example.png)

## Entities

### **Bold**

Format text as **bold**. Cannot be combined with `code` and `pre`.

```ts
format`Format text as ${bold`bold`}`;
```

![bold example](/formatting/bold.png)

### _Italic_

Format text as _italic_. Cannot be combined with `code` and `pre`.

```ts
format`Format text as ${italic`italic`}`;
```

![italic example](/formatting/italic.png)

### <u>Underline</u>

Format text as <u>underline</u>. Cannot be combined with `code` and `pre`.

```ts
format`Format text as ${underline`underline`}`;
```

![underline example](/formatting/underline.png)

### ~~Strikethrough~~

Format text as ~~strikethrough~~. Cannot be combined with `code` and `pre`.

```ts
format`Format text as ${strikethrough`strikethrough`}`;
```

![strikethrough example](/formatting/strikethrough.png)

### Spoiler

Format text as spoiler. Cannot be combined with `code` and `pre`.

```ts
format`Format text as ${spoiler`spoiler`}`;
```

![spoiler example](/formatting/spoiler.png)

> ### Blockquote

Format text as blockquote. Cannot be nested.

```ts
format`Format text as ${blockquote`blockquote`}`;
```

![blockquote example](/formatting/blockquote.png)

### `Code`

Format text as `code`. Convenient for copied items. Cannot be combined with any other format.

```ts
format`Format text as ${code`code`}`;
```

![code example](/formatting/code.png)

### `Pre`

Format text as `pre`. Cannot be combined with any other format.

```ts
format`Format text as ${pre`pre`}`;
// or with language
format`Format text as ${pre(`console.log("pre with language")`, "js")}`;
```

![pre example](/formatting/pre.png)

### [Link](https://github.com/gramiojs/gramio)

Format text as [link](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.

```ts
format`Format text as ${link("link", "https://github.com/gramiojs/gramio")}`;
```

![link example](/formatting/link.png)

### [Mention](https://github.com/gramiojs/gramio)

Format text as [mention](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.

```ts
format`format text as ${mention("mention", {
    id: 12312312,
    is_bot: false,
    first_name: "GramIO",
})}`;
```

![mention example](/formatting/mention.png)

### Custom Emoji (✨)

Insert custom emoji by their id.

```ts
format`text with emoji - ${customEmoji("⚔️", "5222106016283378623")}`;
```

> [!WARNING]
> Custom emoji entities can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com/).
