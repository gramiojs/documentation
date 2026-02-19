---
title: EncryptedCredentials — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: EncryptedCredentials Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: EncryptedCredentials, telegram bot api types, gramio EncryptedCredentials, EncryptedCredentials object, EncryptedCredentials typescript
---

# EncryptedCredentials

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#encryptedcredentials" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes data required for decrypting and authenticating [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement). See the [Telegram Passport Documentation](https://core.telegram.org/passport#receiving-information) for a complete description of the data decryption and authentication processes.

## Fields

<ApiParam name="data" type="String" required description="Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement) decryption and authentication" />

<ApiParam name="hash" type="String" required description="Base64-encoded data hash for data authentication" />

<ApiParam name="secret" type="String" required description="Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
