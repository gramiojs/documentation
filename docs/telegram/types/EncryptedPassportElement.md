---
title: EncryptedPassportElement — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: EncryptedPassportElement Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: EncryptedPassportElement, telegram bot api types, gramio EncryptedPassportElement, EncryptedPassportElement object, EncryptedPassportElement typescript
---

# EncryptedPassportElement

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#encryptedpassportelement" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes documents or other Telegram Passport elements shared with the bot by the user.

## Fields

<ApiParam name="type" type="String" required description="Element type. One of &quot;personal\_details&quot;, &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot;, &quot;internal\_passport&quot;, &quot;address&quot;, &quot;utility\_bill&quot;, &quot;bank\_statement&quot;, &quot;rental\_agreement&quot;, &quot;passport\_registration&quot;, &quot;temporary\_registration&quot;, &quot;phone\_number&quot;, &quot;email&quot;." :enumValues='["personal_details","passport","driver_license","identity_card","internal_passport","address","utility_bill","bank_statement","rental_agreement","passport_registration","temporary_registration","phone_number","email"]' />

<ApiParam name="data" type="String" description="*Optional*. Base64-encoded encrypted Telegram Passport element data provided by the user; available only for &quot;personal\_details&quot;, &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot;, &quot;internal\_passport&quot; and &quot;address&quot; types. Can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="phone_number" type="String" description="*Optional*. User's verified phone number; available only for &quot;phone\_number&quot; type" />

<ApiParam name="email" type="String" description="*Optional*. User's verified email address; available only for &quot;email&quot; type" />

<ApiParam name="files" type="PassportFile[]" description="*Optional*. Array of encrypted files with documents provided by the user; available only for &quot;utility\_bill&quot;, &quot;bank\_statement&quot;, &quot;rental\_agreement&quot;, &quot;passport\_registration&quot; and &quot;temporary\_registration&quot; types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="front_side" type="PassportFile" description="*Optional*. Encrypted file with the front side of the document, provided by the user; available only for &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot; and &quot;internal\_passport&quot;. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="reverse_side" type="PassportFile" description="*Optional*. Encrypted file with the reverse side of the document, provided by the user; available only for &quot;driver\_license&quot; and &quot;identity\_card&quot;. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="selfie" type="PassportFile" description="*Optional*. Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot; and &quot;internal\_passport&quot;. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="translation" type="PassportFile[]" description="*Optional*. Array of encrypted files with translated versions of documents provided by the user; available if requested for &quot;passport&quot;, &quot;driver\_license&quot;, &quot;identity\_card&quot;, &quot;internal\_passport&quot;, &quot;utility\_bill&quot;, &quot;bank\_statement&quot;, &quot;rental\_agreement&quot;, &quot;passport\_registration&quot; and &quot;temporary\_registration&quot; types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="hash" type="String" required description="Base64-encoded element hash for using in [PassportElementErrorUnspecified](https://core.telegram.org/bots/api#passportelementerrorunspecified)" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
