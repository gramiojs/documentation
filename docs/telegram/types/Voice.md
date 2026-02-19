---
title: Voice — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Voice Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Voice, telegram bot api types, gramio Voice, Voice object, Voice typescript
---

# Voice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#voice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a voice note.

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="duration" type="Integer" required description="Duration of the audio in seconds as defined by the sender" />

<ApiParam name="mime_type" type="String" description="_Optional_. MIME type of the file as defined by the sender" />

<ApiParam name="file_size" type="Integer" description="_Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
