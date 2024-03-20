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

::: code-group

```ts twoslash [with GramIO]
import { Keyboard } from "gramio";

const keyboard = new Keyboard().text("first row").row().text("second row");
```

```ts twoslash [without GramIO]
import { Keyboard } from "@gramio/keyboards";

const keyboard = new Keyboard()
    .text("first row")
    .row()
    .text("second row")
    .build();
```

:::

## Usage with Frameworks

### Send via GramIO

```ts twoslash
import { Bot, Keyboard } from "gramio";

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

const bot = new Bot(process.env.TOKEN!)
    .on("message", (ctx) => {
        return ctx.reply("test", {
            reply_markup: new Keyboard()
                .columns(1)
                .text("simple keyboard")
                .add(...data.map((x) => Keyboard.text(x)))
                .filter(({ button }) => button.text !== "Tesla"),
        });
    })
    .onStart(console.log);

bot.start();
```

### Send via [Grammy](https://grammy.dev/)

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
import { Bot } from "grammy";

const data = ["Apple", "Realme", "Tesla", "Xiaomi"];

const bot = new Bot(process.env.TOKEN!).on("message", (ctx) => {
    return ctx.reply("test", {
        reply_markup: new Keyboard()
            .columns(1)
            .text("simple keyboard")
            .add(...data.map((x) => Keyboard.text(x)))
            .filter(({ button }) => button.text !== "Tesla")
            .build(),
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
