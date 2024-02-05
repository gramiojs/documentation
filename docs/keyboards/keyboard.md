# Keyboard

This keyboard is shown under the input field and also known as Reply/Custom Keyboard.
Represents a [custom keyboard](https://core.telegram.org/bots/features#keyboards) with reply options (see [Introduction to bots](https://core.telegram.org/bots/features#keyboards) for details and examples).

## Import

### With GramIO

```ts
import { Keyboard } from "gramio";
```

### Without GramIO

```ts
import { Keyboard } from "@gramio/keyboards";
```

## Buttons ([Documentation](https://core.telegram.org/bots/api/#keyboardbutton))

Buttons are methods that assemble a keyboard for you.

### text

Text button. It will be sent as a message when the button is pressed

```ts
new Keyboard().text("some button text");
```

### requestUsers

Request users button. Pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a `users_shared` service message. Available in private chats only. `Second parameter` is signed 32-bit identifier of the request that will be received back in the [UsersShared](https://core.telegram.org/bots/api/#usersshared) object. Must be unique within the message

```ts
new Keyboard().requestUsers("some button text", 228, {
    user_is_premium: true,
});
```

More about options in [documentation](https://core.telegram.org/bots/api/#keyboardbuttonrequestusers)

### requestChats

Request users button. Pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a `chat_shared` service message. Available in private chats only.. Available in private chats only. `Second parameter` is signed 32-bit identifier of the request, which will be received back in the [ChatShared](https://core.telegram.org/bots/api/#chatshared) object. Must be unique within the message

```ts
new Keyboard().requestChat("gramio", 255, {
    chat_is_forum: true,
});
```

> [!WARNING]
> By default, the `chat_is_channel` parameter is false!

More about options in [documentation](https://core.telegram.org/bots/api/#keyboardbuttonrequestchat)

### requestPoll

Request poll button. Pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a `users_shared` service message. Available in private chats only.

```ts
new Keyboard().requestPoll("some button text", "quiz");
```

More about options in [documentation](https://core.telegram.org/bots/api/#keyboardbuttonpolltype)

### requestLocation

Request user's location button. The user's current location will be sent when the button is pressed. Available in private chats only.

```ts
new Keyboard().requestLocation("some button text");
```

### requestContact

Request contact button. The user's phone number will be sent as a contact when the button is pressed. Available in private chats only.

```ts
new Keyboard().requestContact("some button text");
```

### webApp

webApp button. Described [Web App](https://core.telegram.org/bots/webapps) will be launched when the button is pressed. The Web App will be able to send a `web_app_data` service message. Available in private chats only.

```ts
new Keyboard().webApp("some button text", "https://...");
```

## Options ([Documentation](https://core.telegram.org/bots/api/#replykeyboardmarkup))

These parameters are responsible for the settings of the buttons

### resized

Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). If `false`, in which case the custom keyboard is always of the same height as the app's standard keyboard. Defaults to `true`.

```ts
new Keyboard().text("some text").resized(); // to enable
new Keyboard().text("some text").resized(false); // to disable
```

> [!WARNING]
> The buttons are resized by default! To cancel this, use `.resized(false)`

### oneTime

Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to `false`.

```ts
new Keyboard().text("some text").oneTime(); // to enable
new Keyboard().text("some text").oneTime(false); // to disable
```

### persistent

Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to `false`, in which case the custom keyboard can be hidden and opened with a keyboard icon. Defaults to `false`.

```ts
new Keyboard().text("some text").persistent(); // to enable
new Keyboard().text("some text").persistent(false); // to disable
```

### persistent

Use this parameter if you want to show the keyboard to specific users only.

Targets:

1. users that are \@mentioned in the _text_ of the [Message](https://core.telegram.org/bots/api/#message) object.

2. if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.

_Example:_ A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard. Defaults to `false`.

```ts
new Keyboard().text("some text").selective(); // to enable
new Keyboard().text("some text").selective(false); // to disable
```

### placeholder

The placeholder to be shown in the input field when the keyboard is active. 1-64 characters. Defaults to `not to be`.

```ts
new Keyboard().text("some text").placeholder("some text"); // to enable
new Keyboard().text("some text").placeholder(); // to disable
```

## Helpers

Methods that help you build a keyboard.

### row

Adds a `line break`. Call this method to make sure that the next added buttons will be on a new row.

```ts
new Keyboard().text("first row").row().text("second row");
```

### columns

Allows you to limit the number of columns in the keyboard.

```ts
new Keyboard()
    .columns(1)
    .text("first row")
    .text("second row")
    .text("third row");
```

### wrap

A custom handler that controls row wrapping.

```ts
new Keyboard()
    .wrap(({ button }) => button.text === "second row")
    .text("first row")
    .text("first row")
    .text("second row");
```

handler is

```ts
(options: { button: T; index: number; row: T[]; rowIndex: number }) => boolean;
```

### pattern

An array with the number of columns per row. Allows you to set a «template».

```ts
new Keyboard()
    .pattern([1, 3, 2])
    .text("1")
    .text("2")
    .text("2")
    .text("2")
    .text("3")
    .text("3");
```

### filter

A handler that helps filter keyboard buttons.

```ts
new Keyboard()
    .filter(({ button }) => button.text !== "hidden")
    .text("pass")
    .text("hidden")
    .text("pass");
```

### add

Allows you to add multiple buttons in _raw_ format.

```ts
const labels = ["some", "buttons"];

new Keyboard()
    .add({ text: "raw button" })
    .add(Keyboard.text("raw button by Keyboard.text"))
    .add(...labels.map((x) => Keyboard.text(x)));
```

### addIf

Allows you to dynamically substitute buttons depending on something.

```ts
const labels = ["some", "buttons"];
const isAdmin = true;

new Keyboard()
    .addIf(1 === 2, { text: "raw button" })
    .addIf(isAdmin, Keyboard.text("raw button by Keyboard.text"))
    .addIf(
        ({ index, rowIndex }) => rowIndex === index,
        ...labels.map((x) => Keyboard.text(x))
    );
```

handler is

```ts
(options: { rowIndex: number; index: number }) => boolean;
```

### matrix

Allows you to create a button matrix.

```ts
import { randomInt } from "node:crypto";

const bomb = [randomInt(0, 9), randomInt(0, 9)] as const;

new Keyboard().matrix(10, 10, ({ rowIndex, index }) =>
    Keyboard.text(rowIndex === bomb[0] && index === bomb[1] ? "💣" : "ㅤ")
);
```

The result is keyboard with a bomb on a random button

handler is

```ts
(options: { index: number; rowIndex: number }) => T;
```

### combine

Allows you to combine keyboards. Only keyboards are combined. You need to call the `.row()` method to line-break after combine.

```ts
new Keyboard()
    .combine(new Keyboard().text("first"))
    .row()
    .combine(new Keyboard().text("second").row().text("third"));
```
