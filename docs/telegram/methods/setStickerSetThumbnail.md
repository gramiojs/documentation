---
title: setStickerSetThumbnail — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setStickerSetThumbnail Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setStickerSetThumbnail, telegram bot api, gramio setStickerSetThumbnail, setStickerSetThumbnail typescript, setStickerSetThumbnail example
---

# setStickerSetThumbnail

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickersetthumbnail" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns _True_ on success.

## Parameters

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="user_id" type="Integer" required description="User identifier of the sticker set owner" />

<ApiParam name="thumbnail" type="InputFile | String" required description="A **.WEBP** or **.PNG** image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a **.TGS** animation with a thumbnail up to 32 kilobytes in size (see [](/stickers#animation-requirements)[https://core.telegram.org/stickers#animation-requirements](https://core.telegram.org/stickers#animation-requirements) for animated sticker technical requirements), or a **.WEBM** video with the thumbnail up to 32 kilobytes in size; see [](/stickers#video-requirements)[https://core.telegram.org/stickers#video-requirements](https://core.telegram.org/stickers#video-requirements) for video sticker technical requirements. Pass a _file\_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail." />

<ApiParam name="format" type="String" required description="Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
