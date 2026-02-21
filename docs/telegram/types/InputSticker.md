---
title: InputSticker — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputSticker Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputSticker, telegram bot api types, gramio InputSticker, InputSticker object, InputSticker typescript
---

# InputSticker

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputsticker" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object describes a sticker to be added to a sticker set.

## Fields

<ApiParam name="sticker" type="InputFile | String" required description="The added sticker. Pass a *file\_id* as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new file using multipart/form-data under &lt;file\_attach\_name&gt; name. Animated and video stickers can't be uploaded via HTTP URL. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="format" type="String" required description="Format of the added sticker, must be one of &quot;static&quot; for a **.WEBP** or **.PNG** image, &quot;animated&quot; for a **.TGS** animation, &quot;video&quot; for a **.WEBM** video" :enumValues='["static","animated","video"]' />

<ApiParam name="emoji_list" type="String[]" required description="List of 1-20 emoji associated with the sticker" />

<ApiParam name="mask_position" type="MaskPosition" description="*Optional*. Position where the mask should be placed on faces. For &quot;mask&quot; stickers only." />

<ApiParam name="keywords" type="String[]" description="*Optional*. List of 0-20 search keywords for the sticker with total length of up to 64 characters. For &quot;regular&quot; and &quot;custom\_emoji&quot; stickers only." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
