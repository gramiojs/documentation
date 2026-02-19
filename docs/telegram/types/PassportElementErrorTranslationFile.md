---
title: PassportElementErrorTranslationFile — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorTranslationFile Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorTranslationFile, telegram bot api types, gramio PassportElementErrorTranslationFile, PassportElementErrorTranslationFile object, PassportElementErrorTranslationFile typescript
---

# PassportElementErrorTranslationFile

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrortranslationfile" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes.

## Fields

<ApiParam name="source" type="String" required description="Error source, must be _translation\_file_" />

<ApiParam name="type" type="String" required description="Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver\_license”, “identity\_card”, “internal\_passport”, “utility\_bill”, “bank\_statement”, “rental\_agreement”, “passport\_registration”, “temporary\_registration”" />

<ApiParam name="file_hash" type="String" required description="Base64-encoded file hash" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
