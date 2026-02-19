---
title: InlineQueryResultContact — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultContact Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultContact, telegram bot api types, gramio InlineQueryResultContact, InlineQueryResultContact object, InlineQueryResultContact typescript
---

# InlineQueryResultContact

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultcontact" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the contact.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _contact_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 Bytes" />

<ApiParam name="phone_number" type="String" required description="Contact's phone number" />

<ApiParam name="first_name" type="String" required description="Contact's first name" />

<ApiParam name="last_name" type="String" description="_Optional_. Contact's last name" />

<ApiParam name="vcard" type="String" description="_Optional_. Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the contact" />

<ApiParam name="thumbnail_url" type="String" description="_Optional_. Url of the thumbnail for the result" />

<ApiParam name="thumbnail_width" type="Integer" description="_Optional_. Thumbnail width" />

<ApiParam name="thumbnail_height" type="Integer" description="_Optional_. Thumbnail height" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
