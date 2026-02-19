---
title: InlineQueryResultCachedSticker — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultCachedSticker Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultCachedSticker, telegram bot api types, gramio InlineQueryResultCachedSticker, InlineQueryResultCachedSticker object, InlineQueryResultCachedSticker typescript
---

# InlineQueryResultCachedSticker

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultcachedsticker" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the sticker.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _sticker_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="sticker_file_id" type="String" required description="A valid file identifier of the sticker" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the sticker" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
