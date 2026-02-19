---
title: CallbackQuery — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: CallbackQuery Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: CallbackQuery, telegram bot api types, gramio CallbackQuery, CallbackQuery object, CallbackQuery typescript
---

# CallbackQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#callbackquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents an incoming callback query from a callback button in an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If the button that originated the query was attached to a message sent by the bot, the field _message_ will be present. If the button was attached to a message sent via the bot (in [inline mode](https://core.telegram.org/bots/api#inline-mode)), the field _inline\_message\_id_ will be present. Exactly one of the fields _data_ or _game\_short\_name_ will be present.

## Fields

<ApiParam name="id" type="String" required description="Unique identifier for this query" />

<ApiParam name="from" type="User" required description="Sender" />

<ApiParam name="message" type="MaybeInaccessibleMessage" description="_Optional_. Message sent by the bot with the callback button that originated the query" />

<ApiParam name="inline_message_id" type="String" description="_Optional_. Identifier of the message sent via the bot in inline mode, that originated the query." />

<ApiParam name="chat_instance" type="String" required description="Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in [games](https://core.telegram.org/bots/api#games)." />

<ApiParam name="data" type="String" description="_Optional_. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data." />

<ApiParam name="game_short_name" type="String" description="_Optional_. Short name of a [Game](https://core.telegram.org/bots/api#games) to be returned, serves as the unique identifier for the game" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
