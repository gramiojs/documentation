---
title: setStickerSetThumbnail — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set a custom thumbnail for a Telegram sticker set using GramIO. Upload WEBP, PNG, TGS, or WEBM thumbnails for static, animated, and video sticker sets.
  - - meta
    - name: keywords
      content: setStickerSetThumbnail, telegram bot api, telegram sticker set thumbnail, gramio setStickerSetThumbnail, set sticker set cover image, sticker pack thumbnail, setStickerSetThumbnail typescript, setStickerSetThumbnail example, WEBP thumbnail, TGS animated thumbnail, WEBM video thumbnail, user_id, format, how to set telegram sticker set thumbnail
---

# setStickerSetThumbnail

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickersetthumbnail" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns *True* on success.

## Parameters

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="user_id" type="Integer" required description="User identifier of the sticker set owner" />

<ApiParam name="thumbnail" type="InputFile | String" description="A **.WEBP** or **.PNG** image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a **.TGS** animation with a thumbnail up to 32 kilobytes in size (see [https://core.telegram.org/stickers#animation-requirements](https://core.telegram.org/stickers#animation-requirements) for animated sticker technical requirements), or a **.WEBM** video with the thumbnail up to 32 kilobytes in size; see [https://core.telegram.org/stickers#video-requirements](https://core.telegram.org/stickers#video-requirements) for video sticker technical requirements. Pass a *file\_id* as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail." docsLink="/files/media-upload" />

<ApiParam name="format" type="String" required description="Format of the thumbnail, must be one of &quot;static&quot; for a **.WEBP** or **.PNG** image, &quot;animated&quot; for a **.TGS** animation, or &quot;video&quot; for a **.WEBM** video" :enumValues='["static","animated","video"]' />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a static thumbnail for a regular sticker set (WEBP, 100×100px, max 128KB)
await bot.api.setStickerSetThumbnail({
  name: "my_pack_by_mybot",
  user_id: 123456789,
  thumbnail: await MediaUpload.path("./thumbnail.webp"),
  format: "static",
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set an animated thumbnail for an animated sticker set (TGS, max 32KB)
await bot.api.setStickerSetThumbnail({
  name: "my_animated_pack_by_mybot",
  user_id: 123456789,
  thumbnail: await MediaUpload.path("./thumbnail.tgs"),
  format: "animated",
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a video thumbnail for a video sticker set (WEBM, max 32KB)
await bot.api.setStickerSetThumbnail({
  name: "my_video_pack_by_mybot",
  user_id: 123456789,
  thumbnail: await MediaUpload.path("./thumbnail.webm"),
  format: "video",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the custom thumbnail — falls back to the first sticker in the set
await bot.api.setStickerSetThumbnail({
  name: "my_pack_by_mybot",
  user_id: 123456789,
  format: "static",
  // omitting thumbnail removes it
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: not enough rights to change sticker set` | The `user_id` is not the owner of the sticker set, or the bot didn't create the set |
| 400 | `Bad Request: STICKERSET_INVALID` | The sticker set name doesn't exist or doesn't belong to this bot |
| 400 | `Bad Request: wrong file type` | The uploaded file format doesn't match the `format` parameter — ensure the file extension and content match |
| 400 | `Bad Request: STICKER_PNG_DIMENSIONS` | The static thumbnail is not exactly 100×100 pixels |
| 400 | `Bad Request: file is too big` | Thumbnail exceeds the size limit — 128KB for static, 32KB for animated/video |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | Bad file_id or inaccessible URL — animated/video thumbnails cannot be uploaded via HTTP URL |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Thumbnail format must match the sticker set format.** A static sticker set requires a static (`"static"`) thumbnail; animated sets require animated (`"animated"`); video sets require video (`"video"`). Mismatches return an error.
- **Static thumbnails: exactly 100×100px.** Even 101×101 will fail. Export your thumbnail at exactly this size.
- **Size limits differ by type.** Static thumbnails may be up to 128KB; animated (.TGS) and video (.WEBM) thumbnails must be under 32KB each.
- **Animated and video thumbnails cannot use HTTP URLs.** Only file uploads or existing `file_id`s work for TGS/WEBM thumbnails — unlike static thumbnails which can use URLs.
- **Omitting `thumbnail` removes the custom thumbnail.** The set then falls back to displaying the first sticker (position 0) as its cover. Use [setStickerPositionInSet](/telegram/methods/setStickerPositionInSet) to control which sticker that is.
- **`user_id` must be the sticker set owner.** Pass the Telegram user ID of whoever owns the set (the bot creator's user ID, typically).

## See Also

- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set
- [getStickerSet](/telegram/methods/getStickerSet) — retrieve sticker set details
- [setStickerPositionInSet](/telegram/methods/setStickerPositionInSet) — control which sticker is at position 0 (fallback thumbnail)
- [setStickerSetTitle](/telegram/methods/setStickerSetTitle) — update the sticker set's display title
- [StickerSet](/telegram/types/StickerSet) — sticker set type with thumbnail field
- [Media Upload guide](/files/media-upload) — how to upload files with GramIO
