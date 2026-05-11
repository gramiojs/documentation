---
title: InputMediaLivePhoto — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputMediaLivePhoto Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputMediaLivePhoto, telegram bot api types, gramio InputMediaLivePhoto, InputMediaLivePhoto object, InputMediaLivePhoto typescript
---

# InputMediaLivePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputmedialivephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a live photo to be sent.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be *live\_photo*" constValue="live_photo" />

<ApiParam name="media" type="InputFile | String" required description="Video of the live photo to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended) or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Sending live photos by a URL is currently unsupported." docsLink="/files/media-upload" />

<ApiParam name="photo" type="InputFile | String" required description="The static photo to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended) or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Sending live photos by a URL is currently unsupported." docsLink="/files/media-upload" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the live photo to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the live photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="*Optional*. Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="has_spoiler" type="Boolean" description="*Optional*. Pass *True* if the live photo needs to be covered with a spoiler animation" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
