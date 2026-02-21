---
title: InputPaidMediaVideo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputPaidMediaVideo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputPaidMediaVideo, telegram bot api types, gramio InputPaidMediaVideo, InputPaidMediaVideo object, InputPaidMediaVideo typescript
---

# InputPaidMediaVideo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputpaidmediavideo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The paid media to send is a video.

## Fields

<ApiParam name="type" type="String" required description="Type of the media, must be *video*" constValue="video" />

<ApiParam name="media" type="InputFile | String" required description="File to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="thumbnail" type="InputFile | String" description="*Optional*. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="cover" type="InputFile | String" description="*Optional*. Cover for the video in the message. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="start_timestamp" type="Integer" description="*Optional*. Start timestamp for the video in the message" />

<ApiParam name="width" type="Integer" description="*Optional*. Video width" />

<ApiParam name="height" type="Integer" description="*Optional*. Video height" />

<ApiParam name="duration" type="Integer" description="*Optional*. Video duration in seconds" />

<ApiParam name="supports_streaming" type="Boolean" description="*Optional*. Pass *True* if the uploaded video is suitable for streaming" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
