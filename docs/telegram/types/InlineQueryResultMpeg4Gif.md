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

Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use *input\_message\_content* to send a message with the specified content instead of the animation.

## Fields

<ApiParam name="type" type="String" description="Type of the result, must be *mpeg4\_gif*" defaultValue="mpeg4_gif" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="mpeg4_url" type="String" required description="A valid URL for the MPEG4 file" />

<ApiParam name="mpeg4_width" type="Integer" description="*Optional*. Video width" />

<ApiParam name="mpeg4_height" type="Integer" description="*Optional*. Video height" />

<ApiParam name="mpeg4_duration" type="Integer" description="*Optional*. Video duration in seconds" />

<ApiParam name="thumbnail_url" type="String" required description="URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result" />

<ApiParam name="thumbnail_mime_type" type="String" description="*Optional*. MIME type of the thumbnail, must be one of &quot;image/jpeg&quot;, &quot;image/gif&quot;, or &quot;video/mp4&quot;. Defaults to &quot;image/jpeg&quot;" defaultValue="image/jpeg" :enumValues='["image/jpeg","image/gif","video/mp4"]' />

<ApiParam name="title" type="String" description="*Optional*. Title for the result" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="*Optional*. Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="*Optional*. Content of the message to be sent instead of the video animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
