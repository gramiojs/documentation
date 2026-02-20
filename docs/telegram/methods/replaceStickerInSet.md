---
title: replaceStickerInSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Replace an existing sticker in a set with a new one using GramIO and TypeScript. Atomic swap with preserved position, InputSticker format, emoji list, and error handling.
  - - meta
    - name: keywords
      content: replaceStickerInSet, telegram bot api, replace sticker in set telegram bot, gramio replaceStickerInSet, replaceStickerInSet typescript, replaceStickerInSet example, InputSticker, sticker set, update sticker, swap sticker, user_id, old_sticker, sticker format, how to replace sticker telegram bot
---

# replaceStickerInSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#replacestickerinset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset), then [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset), then [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset). Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of the sticker set owner" />

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="old_sticker" type="String" required description="File identifier of the replaced sticker" />

<ApiParam name="sticker" type="InputSticker" required description="A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

Replace a sticker using a new local file:

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.replaceStickerInSet({
  user_id: 123456789,
  name: "MyStickerSet_by_mybot",
  old_sticker: "CAACAgIAAxkBAAIBb2YKp_OLD_FILE_ID",
  sticker: {
    sticker: await MediaUpload.path("./updated_sticker.webp"),
    format: "static",
    emoji_list: ["✨"],
  },
});
```

Replace with an existing sticker by file_id, adding keywords:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.replaceStickerInSet({
  user_id: 123456789,
  name: "MyStickerSet_by_mybot",
  old_sticker: "CAACAgIAAxkBAAIBb2YKp_OLD",
  sticker: {
    sticker: "CAACAgIAAxkBAAIBb2YKp_NEW",
    format: "static",
    emoji_list: ["🎉", "🥳"],
    keywords: ["party", "celebrate", "happy"],
  },
});
```

Replace a video sticker uploaded from a URL:

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.replaceStickerInSet({
  user_id: 123456789,
  name: "MyVideoSet_by_mybot",
  old_sticker: "CAACAgIAAxkBAAIBb2YKp_OLD_VIDEO",
  sticker: {
    sticker: await MediaUpload.url("https://example.com/new_sticker.webm"),
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
| 400 | `Bad Request: STICKER_PNG_DIMENSIONS` | Static sticker dimensions are wrong — must be exactly 512×512 px |
| 400 | `Bad Request: STICKER_FILE_INVALID` | The replacement file is corrupt, wrong format, or exceeds size limits |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | The `old_sticker` file_id is invalid or doesn't belong to this sticker set |
| 400 | `Bad Request: USER_NOT_FOUND` | `user_id` doesn't correspond to a known Telegram user |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The operation is atomic in position.** `replaceStickerInSet` preserves the original sticker's position in the set. This is more reliable than manually calling delete + add + reposition, which can fail midway and leave the set inconsistent.
- **The sticker set must be owned by the bot.** The `user_id` is the set *owner* (the person who requested it), but the bot must have created the set via [`createNewStickerSet`](/telegram/methods/createNewStickerSet).
- **Format must match the set type.** You cannot replace a static sticker with a video sticker. The `format` in `InputSticker` must match the set's original type.
- **Duplicate replacement is a no-op.** If `sticker` is the exact same file already in the set, the method returns `True` but the set is not modified.
- **`old_sticker` is the file_id of the sticker to remove.** Get current sticker file IDs from [`getStickerSet`](/telegram/methods/getStickerSet) — each `Sticker` object in `stickers[]` has a `file_id`.
- **`emoji_list` accepts 1–20 emojis.** The new sticker's emoji associations are set fresh — the old sticker's emojis are not inherited.

## See Also

- [`addStickerToSet`](/telegram/methods/addStickerToSet) — Add a new sticker without replacing an existing one
- [`deleteStickerFromSet`](/telegram/methods/deleteStickerFromSet) — Remove a sticker permanently from a set
- [`setStickerPositionInSet`](/telegram/methods/setStickerPositionInSet) — Reorder a sticker within a set
- [`createNewStickerSet`](/telegram/methods/createNewStickerSet) — Create a new sticker set
- [`getStickerSet`](/telegram/methods/getStickerSet) — Retrieve a sticker set and its current `file_id` values
- [`InputSticker`](/telegram/types/InputSticker) — The object structure for sticker data
- [`StickerSet`](/telegram/types/StickerSet) — Sticker set type reference
- [MediaUpload guide](/files/media-upload) — How to upload files from disk, URL, or buffer in GramIO
