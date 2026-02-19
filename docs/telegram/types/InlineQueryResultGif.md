---
title: InlineQueryResultGif — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultGif Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultGif, telegram bot api types, gramio InlineQueryResultGif, InlineQueryResultGif object, InlineQueryResultGif typescript
---

# InlineQueryResultGif

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultgif" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the animation.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _gif_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="gif_url" type="String" required description="A valid URL for the GIF file" />

<ApiParam name="gif_width" type="Integer" description="_Optional_. Width of the GIF" />

<ApiParam name="gif_height" type="Integer" description="_Optional_. Height of the GIF" />

<ApiParam name="gif_duration" type="Integer" description="_Optional_. Duration of the GIF in seconds" />

<ApiParam name="thumbnail_url" type="String" required description="URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result" />

<ApiParam name="thumbnail_mime_type" type="String" description="_Optional_. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”" />

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
