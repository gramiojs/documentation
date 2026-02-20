---
title: InlineQuery — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQuery Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQuery, telegram bot api types, gramio InlineQuery, InlineQuery object, InlineQuery typescript
---

# InlineQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.

## Fields

<ApiParam name="id" type="String" required description="Unique identifier for this query" />

<ApiParam name="from" type="User" required description="Sender" />

<ApiParam name="query" type="String" required description="Text of the query (up to 256 characters)" />

<ApiParam name="offset" type="String" required description="Offset of the results to be returned, can be controlled by the bot" />

<ApiParam name="chat_type" type="String" description="*Optional*. Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat" :enumValues='["sender","private","group","supergroup","channel"]' />

<ApiParam name="location" type="Location" description="*Optional*. Sender location, only for bots that request user location" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
