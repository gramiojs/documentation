---
title: PassportElementErrorDataField — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PassportElementErrorDataField Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PassportElementErrorDataField, telegram bot api types, gramio PassportElementErrorDataField, PassportElementErrorDataField object, PassportElementErrorDataField typescript
---

# PassportElementErrorDataField

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#passportelementerrordatafield" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field's value changes.

## Fields

<ApiParam name="source" type="String" description="Error source, must be *data*" defaultValue="data" />

<ApiParam name="type" type="String" required description="The section of the user's Telegram Passport which has the error, one of &quot;personal\_details&quot;, &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot;, &quot;internal\_passport&quot;, &quot;address&quot;" :enumValues='["personal_details","passport","driver_license","identity_card","internal_passport","address"]' />

<ApiParam name="field_name" type="String" required description="Name of the data field which has the error" />

<ApiParam name="data_hash" type="String" required description="Base64-encoded data hash" />

<ApiParam name="message" type="String" required description="Error message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
