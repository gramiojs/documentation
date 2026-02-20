---
title: addStickerToSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Add a sticker to an existing set using GramIO and TypeScript. Complete parameter reference, InputSticker format, emoji list constraints, and error handling.
  - - meta
    - name: keywords
      content: addStickerToSet, telegram bot api, add sticker to set telegram bot, gramio addStickerToSet, addStickerToSet typescript, addStickerToSet example, InputSticker, sticker set, user_id, sticker format, emoji sticker, how to add sticker telegram bot
---

# addStickerToSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#addstickertoset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of sticker set owner" />

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="sticker" type="InputSticker" required description="A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot, MediaUpload } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Add a static sticker from a local file
await bot.api.addStickerToSet({
  user_id: 123456789,
  name: "my_sticker_set_by_mybot",
  sticker: {
    sticker: await MediaUpload.path("./sticker.webp"),
    format: "static",
    emoji_list: ["🎉"],
  },
});

// Add an animated sticker from a file_id already on Telegram servers
await bot.api.addStickerToSet({
  user_id: 123456789,
  name: "my_animated_set_by_mybot",
  sticker: {
    sticker: "file_id_here",
    format: "animated",
    emoji_list: ["😀", "😂"],
    keywords: ["happy", "laugh"],
  },
});

// Add a video sticker from URL
await bot.api.addStickerToSet({
  user_id: 123456789,
  name: "my_video_set_by_mybot",
  sticker: {
    sticker: await MediaUpload.url("https://example.com/sticker.webm"),
    format: "video",
    emoji_list: ["🔥"],
  },
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKERSET_INVALID` | Sticker set doesn't exist or wasn't created by this bot — verify `name` ends with `_by_<botusername>` |
| 400 | `Bad Request: STICKER_EMOJI_INVALID` | `emoji_list` contains an invalid or non-emoji character — must be actual emoji codepoints |
| 400 | `Bad Request: STICKER_PNG_DIMENSIONS` | Static sticker image dimensions are wrong — must be exactly 512×512 px |
| 400 | `Bad Request: STICKERS_TOO_MUCH` | Sticker set is at capacity (120 for regular, 200 for emoji sets) — remove old stickers first |
| 400 | `Bad Request: USER_NOT_FOUND` | `user_id` doesn't correspond to a known Telegram user — must be a real user who has interacted with Telegram |
| 400 | `Bad Request: STICKER_FILE_INVALID` | The uploaded file is corrupt, wrong format, or exceeds size limits |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The sticker set must be owned by the bot.** The `user_id` is the *owner* of the set (typically the admin who requested it), but the bot must have created the set via [`createNewStickerSet`](/telegram/methods/createNewStickerSet). You cannot add stickers to sets created by other bots.
- **Format must match the set type.** You cannot mix `static`, `animated`, and `video` stickers in the same set. The `format` in `InputSticker` must match the set's type, which was fixed at creation time.
- **Duplicate stickers are silently ignored.** If the exact same sticker file is already in the set, the method returns `True` without error — the set simply isn't changed.
- **`emoji_list` accepts 1–20 emojis.** Each emoji serves as a search keyword inside Telegram. Add related emojis to improve discoverability.
- **Static stickers must be 512×512 WebP.** Animated stickers must be TGS (Lottie), and video stickers must be WebM (VP9). Using the wrong format yields a file-invalid error.
- **`keywords` improve search** for custom emoji stickers. Supply relevant text keywords (not emoji) to help users find stickers via Telegram's sticker search.
- **Use `MediaUpload` for local files and URLs.** GramIO's [MediaUpload guide](/files/media-upload) covers `MediaUpload.path()`, `MediaUpload.url()`, and `MediaUpload.buffer()` — all of which work in the `sticker` field of `InputSticker`.

## See Also

- [`createNewStickerSet`](/telegram/methods/createNewStickerSet) — Create a new sticker set before adding stickers
- [`deleteStickerFromSet`](/telegram/methods/deleteStickerFromSet) — Remove a sticker from a set
- [`getStickerSet`](/telegram/methods/getStickerSet) — Retrieve a sticker set's current contents
- [`uploadStickerFile`](/telegram/methods/uploadStickerFile) — Upload a sticker file to get a reusable `file_id`
- [`setStickerSetThumbnail`](/telegram/methods/setStickerSetThumbnail) — Set a thumbnail for the sticker set
- [`InputSticker`](/telegram/types/InputSticker) — The object structure for sticker data
- [`StickerSet`](/telegram/types/StickerSet) — Sticker set type reference
- [MediaUpload guide](/files/media-upload) — How to upload files from disk, URL, or buffer in GramIO
