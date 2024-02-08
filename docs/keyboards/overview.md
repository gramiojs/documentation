# Overview

[`@gramio/keyboards`](https://github.com/gramiojs/keyboards) is built-in GramIO plugin. You can also use it outside of this framework because it is framework-agnostic.

See also [API Reference](https://tsdocs.dev/docs/@gramio/keyboards).

### Installation (not required for GramIO users)

::: code-group

```bash [npm]
npm install @gramio/keyboards
```

```bash [yarn]
yarn add @gramio/keyboards
```

```bash [pnpm]
pnpm add @gramio/keyboards
```

```bash [bun]
bun install @gramio/keyboards
```

:::

## Usage

```ts twoslash
import { Keyboard } from "@gramio/keyboards";

const keyboard = new Keyboard()
    .text("first row")
    .row()
    .text("second row")
    .toJSON();
```

> [!IMPORTANT]
> In gramio, you don't have to use the ".toJSON" method

## Usage with Frameworks

### Send via GramIO

GramIO is not ready yet...

### Send via [Grammy](https://grammy.dev/)

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
import { Bot } from "grammy";

const bot = new Bot(process.env.TOKEN!);

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

bot.on("message", (ctx) => {
    return ctx.reply("test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .toJSON(),
    });
});

bot.start();
```

#### Result

```json
{
    "keyboard": [
        [
            {
                "text": "simple keyboard"
            }
        ],
        [
            {
                "text": "Apple"
            }
        ],
        [
            {
                "text": "Realme"
            }
        ],
        [
            {
                "text": "Xiaomi"
            }
        ]
    ],
    "one_time_keyboard": false,
    "is_persistent": false,
    "selective": false,
    "resize_keyboard": true
}
```

![image](https://github.com/gramiojs/keyboards/assets/57632712/e65e2b0a-40f0-43ae-9887-04360e6dbeab)
