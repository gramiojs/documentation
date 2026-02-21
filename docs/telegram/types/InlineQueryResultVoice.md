---
title: InlineQueryResultVoice — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultVoice Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultVoice, telegram bot api types, gramio InlineQueryResultVoice, InlineQueryResultVoice object, InlineQueryResultVoice typescript
---

# InlineQueryResultVoice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultvoice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use *input\_message\_content* to send a message with the specified content instead of the the voice message.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be *voice*" constValue="voice" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="voice_url" type="String" required description="A valid URL for the voice recording" />

<ApiParam name="title" type="String" required description="Recording title" />

<ApiParam name="caption" type="String" description="*Optional*. Caption, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="voice_duration" type="Integer" description="*Optional*. Recording duration in seconds" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" docsLink="/keyboards/overview" />

<ApiParam name="input_message_content" type="InputMessageContent" description="*Optional*. Content of the message to be sent instead of the voice recording" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
