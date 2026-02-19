---
title: InlineQueryResultCachedGif — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultCachedGif Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultCachedGif, telegram bot api types, gramio InlineQueryResultCachedGif, InlineQueryResultCachedGif object, InlineQueryResultCachedGif typescript
---

# InlineQueryResultCachedGif

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultcachedgif" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with specified content instead of the animation.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _gif_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="gif_file_id" type="String" required description="A valid file identifier for the GIF file" />

<ApiParam name="title" type="String" description="_Optional_. Title for the result" />

<ApiParam name="caption" type="String" description="_Optional_. Caption of the GIF file to be sent, 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="show_caption_above_media" type="Boolean" description="_Optional_. Pass _True_, if the caption must be shown above the message media" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the GIF animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
