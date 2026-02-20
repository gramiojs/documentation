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

Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use *input\_message\_content* to send a message with the specified content instead of the file. Currently, only **.PDF** and **.ZIP** files can be sent using this method.

## Fields

<ApiParam name="type" type="String" description="Type of the result, must be *document*" defaultValue="document" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="title" type="String" required description="Title for the result" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the document to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="document_url" type="String" required description="A valid URL for the file" />

<ApiParam name="mime_type" type="String" required description="MIME type of the content of the file, either “application/pdf” or “application/zip”" :enumValues='["application/pdf","application/zip"]' />

<ApiParam name="description" type="String" description="*Optional*. Short description of the result" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="*Optional*. Content of the message to be sent instead of the file" />

<ApiParam name="thumbnail_url" type="String" description="*Optional*. URL of the thumbnail (JPEG only) for the file" />

<ApiParam name="thumbnail_width" type="Integer" description="*Optional*. Thumbnail width" />

<ApiParam name="thumbnail_height" type="Integer" description="*Optional*. Thumbnail height" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
