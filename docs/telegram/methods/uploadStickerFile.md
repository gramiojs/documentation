---
title: uploadStickerFile — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: uploadStickerFile Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: uploadStickerFile, telegram bot api, gramio uploadStickerFile, uploadStickerFile typescript, uploadStickerFile example
---

# uploadStickerFile

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/File">File</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#uploadstickerfile" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to upload a file with a sticker for later use in the [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset), [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset), or [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset) methods (the file can be used multiple times). Returns the uploaded [File](https://core.telegram.org/bots/api#file) on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of sticker file owner" />

<ApiParam name="sticker" type="InputFile" required description="A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See [](https://core.telegram.org/stickers)[https://core.telegram.org/stickers](https://core.telegram.org/stickers) for technical requirements. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="sticker_format" type="String" required description="Format of the sticker, must be one of “static”, “animated”, “video”" :enumValues='["static","animated","video"]' />

## Returns

On success, the [File](/telegram/types/File) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
