---
title: InputRichMessage — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputRichMessage Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputRichMessage, telegram bot api types, gramio InputRichMessage, InputRichMessage object, InputRichMessage typescript
---

# InputRichMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputrichmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a rich message to be sent. Exactly **one** of the fields *html*, *markdown*, or *blocks* must be used.

## Fields

<ApiParam name="blocks" type="InputRichBlock[]" description="*Optional*. Content of the rich message to send described as a list of blocks" />

<ApiParam name="html" type="String" description="*Optional*. Content of the rich message to send described using HTML formatting. See [rich message formatting options](https://core.telegram.org/bots/api#rich-message-formatting-options) for more details. Use *media* field to specify the media used in the message." />

<ApiParam name="markdown" type="String" description="*Optional*. Content of the rich message to send described using Markdown formatting. See [rich message formatting options](https://core.telegram.org/bots/api#rich-message-formatting-options) for more details. Use *media* field to specify the media used in the message." />

<ApiParam name="media" type="InputRichMessageMedia[]" description="*Optional*. List of media that are specified in the *markdown* or *html* fields using `tg://photo?id=`, `tg://video?id=`, `tg://document?id=`, and `tg://audio?id=` links" />

<ApiParam name="is_rtl" type="Boolean" description="*Optional*. Pass *True* if the rich message must be shown right-to-left" />

<ApiParam name="skip_entity_detection" type="Boolean" description="*Optional*. Pass *True* to skip automatic detection of entities (e.g., URLs, email addresses, username mentions, hashtags, cashtags, bot commands, or phone numbers) in the text" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
