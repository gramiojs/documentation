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

<ApiParam name="source" type="String" required description="Error source, must be *translation\_files*" constValue="translation_files" />

<ApiParam name="type" type="String" required description="Type of element of the user's Telegram Passport which has the issue, one of &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot;, &quot;internal\_passport&quot;, &quot;utility\_bill&quot;, &quot;bank\_statement&quot;, &quot;rental\_agreement&quot;, &quot;passport\_registration&quot;, &quot;temporary\_registration&quot;" :enumValues='["passport","driver_license","identity_card","internal_passport","utility_bill","bank_statement","rental_agreement","passport_registration","temporary_registration"]' />

<ApiParam name="file_hashes" type="String[]" required description="List of base64-encoded file hashes" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
