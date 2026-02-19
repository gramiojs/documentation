---
title: InputMediaDocument — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputMediaDocument Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputMediaDocument, telegram bot api types, gramio InputMediaDocument, InputMediaDocument object, InputMediaDocument typescript
---

# InputMediaDocument

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputmediadocument" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a general file to be sent.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _document_" />

<ApiParam name="media" type="String" required description="File to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file\_attach\_name>” to upload a new one using multipart/form-data under <file\_attach\_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="thumbnail" type="String" description="_Optional_. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="caption" type="String" description="_Optional_. Caption of the document to be sent, 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="disable_content_type_detection" type="Boolean" description="_Optional_. Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always _True_, if the document is sent as part of an album." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
