---
title: PassportElementErrorTranslationFiles — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorTranslationFiles Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorTranslationFiles, telegram bot api types, gramio PassportElementErrorTranslationFiles, PassportElementErrorTranslationFiles object, PassportElementErrorTranslationFiles typescript
---

# PassportElementErrorTranslationFiles

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrortranslationfiles" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change.

## Fields

<ApiParam name="source" type="String" required description="Error source, must be _translation\_files_" />

<ApiParam name="type" type="String" required description="Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver\_license”, “identity\_card”, “internal\_passport”, “utility\_bill”, “bank\_statement”, “rental\_agreement”, “passport\_registration”, “temporary\_registration”" />

<ApiParam name="file_hashes" type="String[]" required description="List of base64-encoded file hashes" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
