---
title: Remove keyboard builder for Telegram Bot API

head:
    - - meta
      - name: "description"
        content: "Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, keyboard, builder, remove keyboard"
---

# Remove Keyboard

Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see [ReplyKeyboardMarkup](https://core.telegram.org/bots/api/#replykeyboardmarkup)).

See also [API Reference](https://tsdocs.dev/docs/@gramio/keyboards/classes/RemoveKeyboard.html).

## Import

### With GramIO

```ts twoslash
import { RemoveKeyboard } from "gramio";
```

### Without GramIO

```ts twoslash
import { RemoveKeyboard } from "@gramio/keyboards";
```

## Options ([Documentation](https://core.telegram.org/bots/api/#replykeyboardremove))

These parameters are responsible for the settings of the removal buttons

### selective

Use this parameter if you want to remove the keyboard for specific users only.

Targets:

1. users that are \@mentioned in the
   _text_ of the [Message](https://core.telegram.org/bots/api/#message) object.
2. if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.

Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet.

```ts twoslash
import { RemoveKeyboard } from "@gramio/keyboards";
// ---cut---
new RemoveKeyboard().selective(); // to enable
new RemoveKeyboard().selective(false); // to disable
```
