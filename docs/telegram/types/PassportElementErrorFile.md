---
title: PassportElementErrorFile — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorFile Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorFile, telegram bot api types, gramio PassportElementErrorFile, PassportElementErrorFile object, PassportElementErrorFile typescript
---

# PassportElementErrorFile

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrorfile" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes.

## Fields

<ApiParam name="source" type="String" description="Error source, must be *file*" defaultValue="file" />

<ApiParam name="type" type="String" required description="The section of the user's Telegram Passport which has the issue, one of “utility\_bill”, “bank\_statement”, “rental\_agreement”, “passport\_registration”, “temporary\_registration”" :enumValues='["utility_bill","bank_statement","rental_agreement","passport_registration","temporary_registration"]' />

<ApiParam name="file_hash" type="String" required description="Base64-encoded file hash" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
