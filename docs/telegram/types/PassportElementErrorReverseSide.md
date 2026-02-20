---
title: PassportElementErrorReverseSide — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorReverseSide Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorReverseSide, telegram bot api types, gramio PassportElementErrorReverseSide, PassportElementErrorReverseSide object, PassportElementErrorReverseSide typescript
---

# PassportElementErrorReverseSide

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrorreverseside" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes.

## Fields

<ApiParam name="source" type="String" description="Error source, must be *reverse\_side*" defaultValue="reverse_side" />

<ApiParam name="type" type="String" required description="The section of the user's Telegram Passport which has the issue, one of “driver\_license”, “identity\_card”" :enumValues='["driver_license","identity_card"]' />

<ApiParam name="file_hash" type="String" required description="Base64-encoded hash of the file with the reverse side of the document" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
