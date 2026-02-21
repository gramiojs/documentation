---
title: PassportElementErrorSelfie — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorSelfie Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorSelfie, telegram bot api types, gramio PassportElementErrorSelfie, PassportElementErrorSelfie object, PassportElementErrorSelfie typescript
---

# PassportElementErrorSelfie

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrorselfie" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes.

## Fields

<ApiParam name="source" type="String" required description="Error source, must be *selfie*" constValue="selfie" />

<ApiParam name="type" type="String" required description="The section of the user's Telegram Passport which has the issue, one of &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot;, &quot;internal\_passport&quot;" :enumValues='["passport","driver_license","identity_card","internal_passport"]' />

<ApiParam name="file_hash" type="String" required description="Base64-encoded hash of the file with the selfie" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
