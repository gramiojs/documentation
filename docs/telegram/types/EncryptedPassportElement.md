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

<ApiParam name="type" type="String" required description="Element type. One of “personal\_details”, “passport”, “driver\_license”, “identity\_card”, “internal\_passport”, “address”, “utility\_bill”, “bank\_statement”, “rental\_agreement”, “passport\_registration”, “temporary\_registration”, “phone\_number”, “email”." />

<ApiParam name="data" type="String" description="_Optional_. Base64-encoded encrypted Telegram Passport element data provided by the user; available only for “personal\_details”, “passport”, “driver\_license”, “identity\_card”, “internal\_passport” and “address” types. Can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="phone_number" type="String" description="_Optional_. User's verified phone number; available only for “phone\_number” type" />

<ApiParam name="email" type="String" description="_Optional_. User's verified email address; available only for “email” type" />

<ApiParam name="files" type="PassportFile[]" description="_Optional_. Array of encrypted files with documents provided by the user; available only for “utility\_bill”, “bank\_statement”, “rental\_agreement”, “passport\_registration” and “temporary\_registration” types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="front_side" type="PassportFile" description="_Optional_. Encrypted file with the front side of the document, provided by the user; available only for “passport”, “driver\_license”, “identity\_card” and “internal\_passport”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="reverse_side" type="PassportFile" description="_Optional_. Encrypted file with the reverse side of the document, provided by the user; available only for “driver\_license” and “identity\_card”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="selfie" type="PassportFile" description="_Optional_. Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for “passport”, “driver\_license”, “identity\_card” and “internal\_passport”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="translation" type="PassportFile[]" description="_Optional_. Array of encrypted files with translated versions of documents provided by the user; available if requested for “passport”, “driver\_license”, “identity\_card”, “internal\_passport”, “utility\_bill”, “bank\_statement”, “rental\_agreement”, “passport\_registration” and “temporary\_registration” types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials)." />

<ApiParam name="hash" type="String" required description="Base64-encoded element hash for using in [PassportElementErrorUnspecified](https://core.telegram.org/bots/api#passportelementerrorunspecified)" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
