---
title: InputPollOption — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputPollOption Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputPollOption, telegram bot api types, gramio InputPollOption, InputPollOption object, InputPollOption typescript
---

# InputPollOption

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputpolloption" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about one answer option in a poll to be sent.

## Fields

<ApiParam name="text" type="String" required description="Option text, 1-100 characters" :minLen="1" :maxLen="100" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="text_parse_mode" type="String" description="*Optional*. Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Currently, only custom emoji entities are allowed" />

<ApiParam name="text_entities" type="MessageEntity[]" description="*Optional*. A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of *text\_parse\_mode*" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
