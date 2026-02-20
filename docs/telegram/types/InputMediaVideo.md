---
title: InputMediaVideo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputMediaVideo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputMediaVideo, telegram bot api types, gramio InputMediaVideo, InputMediaVideo object, InputMediaVideo typescript
---

# InputMediaVideo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputmediavideo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a video to be sent.

## Fields

<ApiParam name="type" type="String" description="Type of the result, must be *video*" defaultValue="video" />

<ApiParam name="media" type="String" required description="File to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="thumbnail" type="String" description="*Optional*. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="cover" type="String" description="*Optional*. Cover for the video in the message. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="start_timestamp" type="Integer" description="*Optional*. Start timestamp for the video in the message" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the video to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="*Optional*. Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="width" type="Integer" description="*Optional*. Video width" />

<ApiParam name="height" type="Integer" description="*Optional*. Video height" />

<ApiParam name="duration" type="Integer" description="*Optional*. Video duration in seconds" />

<ApiParam name="supports_streaming" type="Boolean" description="*Optional*. Pass *True* if the uploaded video is suitable for streaming" />

<ApiParam name="has_spoiler" type="Boolean" description="*Optional*. Pass *True* if the video needs to be covered with a spoiler animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
