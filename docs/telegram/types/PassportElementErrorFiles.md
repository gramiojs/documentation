---
title: PassportElementErrorFiles — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorFiles Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorFiles, telegram bot api types, gramio PassportElementErrorFiles, PassportElementErrorFiles object, PassportElementErrorFiles typescript
---

# PassportElementErrorFiles

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrorfiles" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes.

## Fields

<ApiParam name="source" type="String" required description="Error source, must be *files*" constValue="files" />

<ApiParam name="type" type="String" required description="The section of the user's Telegram Passport which has the issue, one of &quot;utility\_bill&quot;, &quot;bank\_statement&quot;, &quot;rental\_agreement&quot;, &quot;passport\_registration&quot;, &quot;temporary\_registration&quot;" :enumValues='["utility_bill","bank_statement","rental_agreement","passport_registration","temporary_registration"]' />

<ApiParam name="file_hashes" type="String[]" required description="List of base64-encoded file hashes" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
