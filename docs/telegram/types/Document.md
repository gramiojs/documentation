---
title: Document — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Document Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Document, telegram bot api types, gramio Document, Document object, Document typescript
---

# Document

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#document" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a general file (as opposed to [photos](https://core.telegram.org/bots/api#photosize), [voice messages](https://core.telegram.org/bots/api#voice) and [audio files](https://core.telegram.org/bots/api#audio)).

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="thumbnail" type="PhotoSize" description="*Optional*. Document thumbnail as defined by the sender" />

<ApiParam name="file_name" type="String" description="*Optional*. Original filename as defined by the sender" />

<ApiParam name="mime_type" type="String" description="*Optional*. MIME type of the file as defined by the sender" />

<ApiParam name="file_size" type="Integer" description="*Optional*. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
