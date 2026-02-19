---
title: InlineQueryResultDocument — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultDocument Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultDocument, telegram bot api types, gramio InlineQueryResultDocument, InlineQueryResultDocument object, InlineQueryResultDocument typescript
---

# InlineQueryResultDocument

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultdocument" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the file. Currently, only **.PDF** and **.ZIP** files can be sent using this method.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _document_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="title" type="String" required description="Title for the result" />

<ApiParam name="caption" type="String" description="_Optional_. Caption of the document to be sent, 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="document_url" type="String" required description="A valid URL for the file" />

<ApiParam name="mime_type" type="String" required description="MIME type of the content of the file, either “application/pdf” or “application/zip”" />

<ApiParam name="description" type="String" description="_Optional_. Short description of the result" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the file" />

<ApiParam name="thumbnail_url" type="String" description="_Optional_. URL of the thumbnail (JPEG only) for the file" />

<ApiParam name="thumbnail_width" type="Integer" description="_Optional_. Thumbnail width" />

<ApiParam name="thumbnail_height" type="Integer" description="_Optional_. Thumbnail height" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
