---
title: BusinessConnection — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: BusinessConnection Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: BusinessConnection, telegram bot api types, gramio BusinessConnection, BusinessConnection object, BusinessConnection typescript
---

# BusinessConnection

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#businessconnection" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes the connection of the bot with a business account.

## Fields

<ApiParam name="id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="user" type="User" required description="Business account user that created the business connection" />

<ApiParam name="user_chat_id" type="Integer" required description="Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="date" type="Integer" required description="Date the connection was established in Unix time" />

<ApiParam name="rights" type="BusinessBotRights" description="_Optional_. Rights of the business bot" />

<ApiParam name="is_enabled" type="Boolean" required description="_True_, if the connection is active" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
