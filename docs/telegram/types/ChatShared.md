---
title: ChatShared — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatShared Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatShared, telegram bot api types, gramio ChatShared, ChatShared object, ChatShared typescript
---

# ChatShared

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatshared" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about a chat that was shared with the bot using a [KeyboardButtonRequestChat](https://core.telegram.org/bots/api#keyboardbuttonrequestchat) button.

## Fields

<ApiParam name="request_id" type="Integer" required description="Identifier of the request" />

<ApiParam name="chat_id" type="Integer" required description="Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means." />

<ApiParam name="title" type="String" description="_Optional_. Title of the chat, if the title was requested by the bot." />

<ApiParam name="username" type="String" description="_Optional_. Username of the chat, if the username was requested by the bot and available." />

<ApiParam name="photo" type="PhotoSize[]" description="_Optional_. Available sizes of the chat photo, if the photo was requested by the bot" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
