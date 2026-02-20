---
title: InputTextMessageContent — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputTextMessageContent Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputTextMessageContent, telegram bot api types, gramio InputTextMessageContent, InputTextMessageContent object, InputTextMessageContent typescript
---

# InputTextMessageContent

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputtextmessagecontent" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a text message to be sent as the result of an inline query.

## Fields

<ApiParam name="message_text" type="String" required description="Text of the message to be sent, 1-4096 characters" :minLen="1" :maxLen="4096" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in message text, which can be specified instead of *parse\_mode*" />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="*Optional*. Link preview generation options for the message" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
