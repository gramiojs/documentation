---
title: PassportElementErrorFrontSide — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorFrontSide Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorFrontSide, telegram bot api types, gramio PassportElementErrorFrontSide, PassportElementErrorFrontSide object, PassportElementErrorFrontSide typescript
---

# PassportElementErrorFrontSide

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrorfrontside" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes.

## Fields

<ApiParam name="source" type="String" required description="Error source, must be _front\_side_" />

<ApiParam name="type" type="String" required description="The section of the user's Telegram Passport which has the issue, one of “passport”, “driver\_license”, “identity\_card”, “internal\_passport”" />

<ApiParam name="file_hash" type="String" required description="Base64-encoded hash of the file with the front side of the document" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
