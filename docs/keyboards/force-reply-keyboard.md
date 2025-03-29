---
title: Force Reply keyboard - Prompt users to reply

head:
    - - meta
      - name: "description"
        content: "Learn how to use Force Reply Keyboard in GramIO to make Telegram clients automatically display a reply interface, creating natural conversation flows while respecting privacy mode."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, force reply keyboard, reply interface, input placeholder, conversation flow, step-by-step interface, privacy mode compatible, user input, forced response, ForceReply, reply prompts, form-like interface, response collection"
---

# Force Reply Keyboard

Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice [privacy mode](https://core.telegram.org/bots/features#privacy-mode).

See also [API Reference](https://jsr.io/@gramio/keyboards/doc/~/ForceReplyKeyboard).

## Import

### With GramIO

```ts twoslash
import { ForceReplyKeyboard } from "gramio";
```

### Without GramIO

```ts twoslash
import { ForceReplyKeyboard } from "@gramio/keyboards";
```

## Options ([Documentation](https://core.telegram.org/bots/api/#forcereply))

These parameters are responsible for the settings of the force reply keyboard

### selective

Use this parameter if you want to force reply from specific users only.

Targets:

1. users that are \@mentioned in the _text_ of the [Message](https://core.telegram.org/bots/api/#message) object.
2. if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.

```ts twoslash
import { ForceReplyKeyboard } from "@gramio/keyboards";
// ---cut---
new ForceReplyKeyboard().selective(); // to enable
new ForceReplyKeyboard().selective(false); // to disable
```

### placeholder

The placeholder to be shown in the input field when the reply is active, 1-64 characters.

```ts twoslash
import { ForceReplyKeyboard } from "@gramio/keyboards";
// ---cut---
new ForceReplyKeyboard().placeholder("some text"); // to enable
new ForceReplyKeyboard().placeholder(); // to disable
```
