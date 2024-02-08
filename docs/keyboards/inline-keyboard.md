# Inline Keyboard

Inline Keyboard is attached to the message. Represents an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) that appears right next to the message it belongs to.

See also [API Reference](https://tsdocs.dev/docs/@gramio/keyboards/classes/InlineKeyboard.html).

## Import

### With GramIO

```ts
import { InlineKeyboard } from "gramio";
```

### Without GramIO

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
```

## Buttons ([Documentation](https://core.telegram.org/bots/api/#inlinekeyboardbutton))

Buttons are methods that assemble a inline keyboard for you.

### text

Text button with data to be sent in a [callback query](https://core.telegram.org/bots/api/#callbackquery) to the bot when button is pressed, 1-64 bytes.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().text("some text", "payload");
// or
new InlineKeyboard().text("some text", {
    json: "payload",
}); // it uses JSON.stringify
```

### url

HTTP or tg:// URL to be opened when the button is pressed. Links `tg://user?id=<user_id>` can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().url("GitHub", "https://github.com/gramiojs/gramio");
```

### webApp

Description of the [Web App](https://core.telegram.org/bots/webapps) that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method [answerWebAppQuery](https://core.telegram.org/bots/api/#answerwebappquery). Available only in private chats between a user and the bot.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().webApp("some text", "https://...");
```

### login

This inline keyboard button used to automatically authorize a user. Serves as a great replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login) when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:

Telegram apps support these buttons as of [version 5.7](https://telegram.org/blog/privacy-discussions-web-bots#meet-seamless-web-bots).

Sample bot: [@discussbot](https://t.me/discussbot)

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().login("some text", "https://...");
// or
new InlineKeyboard().login("some text", {
    url: "https://...",
    request_write_access: true,
});
```

More about options in [documentation](https://core.telegram.org/bots/api/#loginurl)

### pay

Send a [Pay button](https://core.telegram.org/bots/api/#payments).

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().pay("5 coins");
```

> [!WARNING]
> This type of button **must** always be the first button in the first row and can only be used in invoice messages.

### switchToChat

Pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field.

By default empty, in which case just the bot's username will be inserted.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().switchToChat("Select chat");
// or
new InlineKeyboard().switchToChat("Select chat", "InlineQuery");
```

### switchToChosenChat

Pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().switchToChosenChat("Select chat");
// or
new InlineKeyboard().switchToChosenChat("Select chat", "InlineQuery");
// or
new InlineKeyboard().switchToChosenChat("Select chat", {
    query: "InlineQuery",
    allow_channel_chats: true,
    allow_group_chats: true,
    allow_bot_chats: true,
    allow_user_chats: true,
});
```

More about options in [documentation](https://core.telegram.org/bots/api/#switchinlinequerychosenchat)

### switchToCurrentChat

Pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted.

This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().switchToChosenChat("Open Inline mod");
// or
new InlineKeyboard().switchToChosenChat("Open Inline mod", "InlineQuery");
```

### game

Description of the game that will be launched when the user presses the button.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().game("text", {}); // ??? no params...
```

> [!DANGER]
> TelegramCallbackGame is empty (placeholder Telegram Bot API Object) and keyboard is not working yet

> [!WARNING]
> This type of button **must** always be the first button in the first row.

## Helpers

Methods that help you build a keyboard.

### row

Adds a `line break`. Call this method to make sure that the next added buttons will be on a new row.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .text("first row", "payload")
    .row()
    .text("second row", "payload");
```

### columns

Allows you to limit the number of columns in the keyboard.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .columns(1)
    .text("first row", "payload")
    .text("second row", "payload")
    .text("third row", "payload");
```

### wrap

A custom handler that controls row wrapping.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .wrap(({ button }) => button.callback_data === "2")
    .text("first row", "1")
    .text("first row", "1")
    .text("second row", "2");
```

handler is

```ts
(options: { button: T; index: number; row: T[]; rowIndex: number }) => boolean;
```

### pattern

An array with the number of columns per row. Allows you to set a «template».

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .pattern([1, 3, 2])
    .text("1", "payload")
    .text("2", "payload")
    .text("2", "payload")
    .text("2", "payload")
    .text("3", "payload")
    .text("3", "payload");
```

### filter

A handler that helps filter keyboard buttons.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .filter(({ button }) => button.callback_data !== "hidden")
    .text("button", "pass")
    .text("button", "hidden")
    .text("button", "pass");
```

### add

Allows you to add multiple buttons in _raw_ format.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
const labels = ["some", "buttons"];

new InlineKeyboard()
    .add({ text: "raw button", callback_data: "payload" })
    .add(InlineKeyboard.text("raw button by InlineKeyboard.text", "payload"))
    .add(...labels.map((x) => InlineKeyboard.text(x, `${x}payload`)));
```

### addIf

Allows you to dynamically substitute buttons depending on something.

```ts twoslash
// @noErrors
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
const labels = ["some", "buttons"];
const isAdmin = true;

new InlineKeyboard()
    .addIf(1 === 2, { text: "raw button", callback_data: "payload" })
    .addIf(
        isAdmin,
        InlineKeyboard.text("raw button by InlineKeyboard.text", "payload")
    )
    .addIf(
        ({ index, rowIndex }) => rowIndex === index,
        ...labels.map((x) => InlineKeyboard.text(x, `${x}payload`))
    );
```

### matrix

Allows you to create a button matrix.

```ts twoslash
// @noErrors
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
import { randomInt } from "node:crypto";

const bomb = [randomInt(0, 9), randomInt(0, 9)] as const;

new InlineKeyboard().matrix(10, 10, ({ rowIndex, index }) =>
    InlineKeyboard.text(
        rowIndex === bomb[0] && index === bomb[1] ? "💣" : "ㅤ",
        "payload"
    )
);
```

The result is keyboard with a bomb on a random button

handler is

```ts
(options: { index: number; rowIndex: number }) => T;
```

### combine

Allows you to combine keyboards. Only keyboards are combined. You need to call the `.row()` method to line-break after combine.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .combine(new InlineKeyboard().text("first row", "payload"))
    .row()
    .combine(
        new InlineKeyboard()
            .text("second row", "payload")
            .row()
            .text("third row", "payload")
    );
```
