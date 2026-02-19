---
title: InlineQueryResultVideo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultVideo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultVideo, telegram bot api types, gramio InlineQueryResultVideo, InlineQueryResultVideo object, InlineQueryResultVideo typescript
---

# InlineQueryResultVideo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultvideo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the video.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _video_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="video_url" type="String" required description="A valid URL for the embedded video player or video file" />

<ApiParam name="mime_type" type="String" required description="MIME type of the content of the video URL, “text/html” or “video/mp4”" />

<ApiParam name="thumbnail_url" type="String" required description="URL of the thumbnail (JPEG only) for the video" />

<ApiParam name="title" type="String" required description="Title for the result" />

<ApiParam name="caption" type="String" description="_Optional_. Caption of the video to be sent, 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="show_caption_above_media" type="Boolean" description="_Optional_. Pass _True_, if the caption must be shown above the message media" />

<ApiParam name="video_width" type="Integer" description="_Optional_. Video width" />

<ApiParam name="video_height" type="Integer" description="_Optional_. Video height" />

<ApiParam name="video_duration" type="Integer" description="_Optional_. Video duration in seconds" />

<ApiParam name="description" type="String" description="_Optional_. Short description of the result" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the video. This field is **required** if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video)." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
