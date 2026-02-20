---
title: InputMediaAnimation — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputMediaAnimation Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputMediaAnimation, telegram bot api types, gramio InputMediaAnimation, InputMediaAnimation object, InputMediaAnimation typescript
---

# InputMediaAnimation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputmediaanimation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.

## Fields

<ApiParam name="type" type="String" description="Type of the result, must be *animation*" defaultValue="animation" />

<ApiParam name="media" type="String" required description="File to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="thumbnail" type="String" description="*Optional*. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the animation to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="*Optional*. Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="width" type="Integer" description="*Optional*. Animation width" />

<ApiParam name="height" type="Integer" description="*Optional*. Animation height" />

<ApiParam name="duration" type="Integer" description="*Optional*. Animation duration in seconds" />

<ApiParam name="has_spoiler" type="Boolean" description="*Optional*. Pass *True* if the animation needs to be covered with a spoiler animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
