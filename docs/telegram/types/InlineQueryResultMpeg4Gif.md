---
title: InlineQueryResultMpeg4Gif — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultMpeg4Gif Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultMpeg4Gif, telegram bot api types, gramio InlineQueryResultMpeg4Gif, InlineQueryResultMpeg4Gif object, InlineQueryResultMpeg4Gif typescript
---

# InlineQueryResultMpeg4Gif

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultmpeg4gif" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the animation.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _mpeg4\_gif_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="mpeg4_url" type="String" required description="A valid URL for the MPEG4 file" />

<ApiParam name="mpeg4_width" type="Integer" description="_Optional_. Video width" />

<ApiParam name="mpeg4_height" type="Integer" description="_Optional_. Video height" />

<ApiParam name="mpeg4_duration" type="Integer" description="_Optional_. Video duration in seconds" />

<ApiParam name="thumbnail_url" type="String" required description="URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result" />

<ApiParam name="thumbnail_mime_type" type="String" description="_Optional_. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”" />

<ApiParam name="title" type="String" description="_Optional_. Title for the result" />

<ApiParam name="caption" type="String" description="_Optional_. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="show_caption_above_media" type="Boolean" description="_Optional_. Pass _True_, if the caption must be shown above the message media" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the video animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
