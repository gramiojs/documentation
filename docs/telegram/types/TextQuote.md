---
title: TextQuote — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: TextQuote Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: TextQuote, telegram bot api types, gramio TextQuote, TextQuote object, TextQuote typescript
---

# TextQuote

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#textquote" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about the quoted part of a message that is replied to by the given message.

## Fields

<ApiParam name="text" type="String" required description="Text of the quoted part of a message that is replied to by the given message" />

<ApiParam name="entities" type="MessageEntity[]" description="*Optional*. Special entities that appear in the quote. Currently, only *bold*, *italic*, *underline*, *strikethrough*, *spoiler*, and *custom\_emoji* entities are kept in quotes." />

<ApiParam name="position" type="Integer" required description="Approximate quote position in the original message in UTF-16 code units as specified by the sender" />

<ApiParam name="is_manual" type="True" description="*Optional*. *True*, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
