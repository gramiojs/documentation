---
title: SharedUser — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SharedUser Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SharedUser, telegram bot api types, gramio SharedUser, SharedUser object, SharedUser typescript
---

# SharedUser

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#shareduser" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about a user that was shared with the bot using a [KeyboardButtonRequestUsers](https://core.telegram.org/bots/api#keyboardbuttonrequestusers) button.

## Fields

<ApiParam name="user_id" type="Integer" required description="Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means." />

<ApiParam name="first_name" type="String" description="*Optional*. First name of the user, if the name was requested by the bot" />

<ApiParam name="last_name" type="String" description="*Optional*. Last name of the user, if the name was requested by the bot" />

<ApiParam name="username" type="String" description="*Optional*. Username of the user, if the username was requested by the bot" />

<ApiParam name="photo" type="PhotoSize[]" description="*Optional*. Available sizes of the chat photo, if the photo was requested by the bot" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
