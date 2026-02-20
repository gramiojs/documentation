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

Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use *input\_message\_content* to send a message with the specified content instead of the animation.

## Fields

<ApiParam name="type" type="String" description="Type of the result, must be *gif*" defaultValue="gif" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="gif_url" type="String" required description="A valid URL for the GIF file" />

<ApiParam name="gif_width" type="Integer" description="*Optional*. Width of the GIF" />

<ApiParam name="gif_height" type="Integer" description="*Optional*. Height of the GIF" />

<ApiParam name="gif_duration" type="Integer" description="*Optional*. Duration of the GIF in seconds" />

<ApiParam name="thumbnail_url" type="String" required description="URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result" />

<ApiParam name="thumbnail_mime_type" type="String" description="*Optional*. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”" defaultValue="image/jpeg" :enumValues='["image/jpeg","image/gif","video/mp4"]' />

<ApiParam name="title" type="String" description="*Optional*. Title for the result" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the GIF file to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="*Optional*. Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="*Optional*. Content of the message to be sent instead of the GIF animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
