---
title: Contact — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Contact Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Contact, telegram bot api types, gramio Contact, Contact object, Contact typescript
---

# Contact

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#contact" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a phone contact.

## Fields

<ApiParam name="phone_number" type="String" required description="Contact's phone number" />

<ApiParam name="first_name" type="String" required description="Contact's first name" />

<ApiParam name="last_name" type="String" description="*Optional*. Contact's last name" />

<ApiParam name="user_id" type="Integer" description="*Optional*. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="vcard" type="String" description="*Optional*. Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard)" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
