---
title: uploadStickerFile — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Upload a sticker file for use in sticker sets using GramIO with TypeScript. Supports static (.WEBP/.PNG), animated (.TGS), and video (.WEBM) sticker formats with file reuse.
  - - meta
    - name: keywords
      content: uploadStickerFile, telegram bot api, upload sticker file telegram bot, gramio uploadStickerFile, uploadStickerFile typescript, uploadStickerFile example, sticker format, static animated video sticker, createNewStickerSet, addStickerToSet, InputFile, user_id, sticker_format, how to upload sticker telegram bot
---

# uploadStickerFile

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/File">File</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#uploadstickerfile" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to upload a file with a sticker for later use in the [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset), [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset), or [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset) methods (the file can be used multiple times). Returns the uploaded [File](https://core.telegram.org/bots/api#file) on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of sticker file owner" />

<ApiParam name="sticker" type="InputFile" required description="A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See [https://core.telegram.org/stickers](https://core.telegram.org/stickers) for technical requirements. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="sticker_format" type="String" required description="Format of the sticker, must be one of &quot;static&quot;, &quot;animated&quot;, &quot;video&quot;" :enumValues='["static","animated","video"]' />

## Returns

On success, the [File](/telegram/types/File) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a static sticker (.WEBP or .PNG)
const file = await bot.api.uploadStickerFile({
  user_id: 123456789,
  sticker: await MediaUpload.path("./sticker.webp"),
  sticker_format: "static",
});

console.log(file.file_id); // Reuse this file_id in createNewStickerSet / addStickerToSet
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload an animated sticker (.TGS)
const file = await bot.api.uploadStickerFile({
  user_id: 123456789,
  sticker: await MediaUpload.path("./sticker.tgs"),
  sticker_format: "animated",
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a video sticker (.WEBM), then immediately use it in a new sticker set
const file = await bot.api.uploadStickerFile({
  user_id: 123456789,
  sticker: await MediaUpload.path("./sticker.webm"),
  sticker_format: "video",
});

await bot.api.createNewStickerSet({
  user_id: 123456789,
  name: "my_pack_by_mybot",
  title: "My Sticker Pack",
  stickers: [
    {
      sticker: file.file_id,
      emoji_list: ["🎉"],
      format: "video",
    },
  ],
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload from a URL (Telegram fetches it server-side)
const file = await bot.api.uploadStickerFile({
  user_id: 123456789,
  sticker: await MediaUpload.url("https://example.com/sticker.webp"),
  sticker_format: "static",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: USER_NOT_FOUND` | `user_id` is invalid or the user has never interacted with the bot |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | The sticker file URL is inaccessible or the file_id is invalid |
| 400 | `Bad Request: STICKER_INVALID` | File format doesn't match `sticker_format` (e.g. `.tgs` file with `"static"`) |
| 400 | `Bad Request: file is too big` | Sticker file exceeds Telegram's size limits for the chosen format |
| 400 | `Bad Request: IMAGE_INVALID` | Static sticker dimensions are not 512×512 pixels |

## Tips & Gotchas

- **Match `sticker_format` to the file extension exactly.** `.WEBP`/`.PNG` → `"static"`, `.TGS` → `"animated"`, `.WEBM` → `"video"`. A mismatch returns `STICKER_INVALID`.
- **The returned `file_id` can be reused across multiple sticker sets.** Cache it instead of uploading the same file repeatedly — the file stays accessible on Telegram's servers.
- **Static stickers must be exactly 512×512 pixels.** Animated and video stickers have their own strict technical requirements detailed at [core.telegram.org/stickers](https://core.telegram.org/stickers).
- **`user_id` will be the sticker set owner.** When you pass this file_id to `createNewStickerSet`, the set is created on behalf of that user. Make sure the user has started a conversation with your bot.
- **Use `MediaUpload.path()` for local files or `MediaUpload.url()` for remote files.** Both are async — always `await` them. For in-memory buffers, use `MediaUpload.buffer(buf, "sticker.webp")` (synchronous).

## See Also

- [createNewStickerSet](/telegram/methods/createNewStickerSet)
- [addStickerToSet](/telegram/methods/addStickerToSet)
- [replaceStickerInSet](/telegram/methods/replaceStickerInSet)
- [InputSticker](/telegram/types/InputSticker)
- [File](/telegram/types/File)
- [Media Upload Guide](/files/media-upload)
