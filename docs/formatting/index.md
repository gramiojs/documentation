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
// send
bot.api.sendMessage({
    chat_id: 1233,
    text: format`Hi! ${bold(italic("You're cool!"))}`,
});
```
