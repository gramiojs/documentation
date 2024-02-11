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
