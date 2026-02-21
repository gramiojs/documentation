---
title: InlineQueryResultAudio — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultAudio Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultAudio, telegram bot api types, gramio InlineQueryResultAudio, InlineQueryResultAudio object, InlineQueryResultAudio typescript
---

# InlineQueryResultAudio

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultaudio" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use *input\_message\_content* to send a message with the specified content instead of the audio.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be *audio*" constValue="audio" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="audio_url" type="String" required description="A valid URL for the audio file" />

<ApiParam name="title" type="String" required description="Title" />

<ApiParam name="caption" type="String" description="*Optional*. Caption, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="performer" type="String" description="*Optional*. Performer" />

<ApiParam name="audio_duration" type="Integer" description="*Optional*. Audio duration in seconds" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" docsLink="/keyboards/overview" />

<ApiParam name="input_message_content" type="InputMessageContent" description="*Optional*. Content of the message to be sent instead of the audio" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
