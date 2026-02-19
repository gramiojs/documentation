---
title: PassportFile — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportFile Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportFile, telegram bot api types, gramio PassportFile, PassportFile object, PassportFile typescript
---

# PassportFile

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportfile" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don't exceed 10MB.

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="file_size" type="Integer" required description="File size in bytes" />

<ApiParam name="file_date" type="Integer" required description="Unix time when the file was uploaded" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
