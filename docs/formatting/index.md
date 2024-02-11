# Formatting

[`@gramio/format`](https://github.com/gramiojs/format) is built-in GramIO plugin. You can also use it outside of this framework because it is framework-agnostic.

See also [API Reference](https://tsdocs.dev/docs/@gramio/format).



## Entities

### **Bold**

Format text as **bold**. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, bold } from "@gramio/format";
// ---cut---
format`Format text as ${bold`bold`}`;
```

![bold example](/formatting/bold.png)

### _Italic_

Format text as _italic_. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, italic } from "@gramio/format";
// ---cut---
format`Format text as ${italic`italic`}`;
```

![italic example](/formatting/italic.png)

### <u>Underline</u>

Format text as <u>underline</u>. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, underline } from "@gramio/format";
// ---cut---
format`Format text as ${underline`underline`}`;
```

![underline example](/formatting/underline.png)

### ~~Strikethrough~~

Format text as ~~strikethrough~~. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, strikethrough } from "@gramio/format";
// ---cut---
format`Format text as ${strikethrough`strikethrough`}`;
```

![strikethrough example](/formatting/strikethrough.png)

### Spoiler

Format text as spoiler. Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, spoiler } from "@gramio/format";
// ---cut---
format`Format text as ${spoiler`spoiler`}`;
```

![spoiler example](/formatting/spoiler.png)

> ### Blockquote

Format text as blockquote. Cannot be nested.

```ts twoslash
import { format, blockquote } from "@gramio/format";
// ---cut---
format`Format text as ${blockquote`blockquote`}`;
```

![blockquote example](/formatting/blockquote.png)

### `Code`

Format text as `code`. Convenient for copied items. Cannot be combined with any other format.

```ts twoslash
import { format, code } from "@gramio/format";
// ---cut---
format`Format text as ${code`code`}`;
```

![code example](/formatting/code.png)

### `Pre`

Format text as `pre`. Cannot be combined with any other format.

```ts twoslash
import { format, pre } from "@gramio/format";
// ---cut---
format`Format text as ${pre`pre`}`;
// or with language
format`Format text as ${pre(`console.log("pre with language")`, "js")}`;
```

![pre example](/formatting/pre.png)

### [Link](https://github.com/gramiojs/gramio)

Format text as [link](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, link } from "@gramio/format";
// ---cut---
format`Format text as ${link("link", "https://github.com/gramiojs/gramio")}`;
```

![link example](/formatting/link.png)

### [Mention](https://github.com/gramiojs/gramio)

Format text as [mention](https://github.com/gramiojs/gramio). Cannot be combined with `code` and `pre`.

```ts twoslash
import { format, mention } from "@gramio/format";
// ---cut---
format`format text as ${mention("mention", {
    id: 12312312,
    is_bot: false,
    first_name: "GramIO",
})}`;
```

![mention example](/formatting/mention.png)

### Custom Emoji (✨)

Insert custom emoji by their id.

```ts twoslash
import { format, customEmoji } from "@gramio/format";
// ---cut---
format`text with emoji - ${customEmoji("⚔️", "5222106016283378623")}`;
```

> [!WARNING]
> Custom emoji entities can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com/).
