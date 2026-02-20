---
title: createNewStickerSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Create new Telegram sticker sets for your bot using GramIO. Complete createNewStickerSet TypeScript reference with InputSticker format, file upload, sticker types, and name convention guide.
  - - meta
    - name: keywords
      content: createNewStickerSet, telegram bot api, telegram sticker set, gramio createNewStickerSet, createNewStickerSet typescript, createNewStickerSet example, InputSticker, sticker_type, custom emoji sticker set, mask sticker set, how to create sticker set telegram bot, MediaUpload sticker, needs_repainting
---

# createNewStickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createnewstickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of created sticker set owner" />

<ApiParam name="name" type="String" required description="Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `&quot;_by_&lt;bot_username&gt;&quot;`. `&lt;bot_username&gt;` is case insensitive. 1-64 characters." />

<ApiParam name="title" type="String" required description="Sticker set title, 1-64 characters" />

<ApiParam name="stickers" type="InputSticker[]" required description="A JSON-serialized list of 1-50 initial stickers to be added to the sticker set" />

<ApiParam name="sticker_type" type="String" required description="Type of stickers in the set, pass &quot;regular&quot;, &quot;mask&quot;, or &quot;custom\_emoji&quot;. By default, a regular sticker set is created." />

<ApiParam name="needs_repainting" type="Boolean" required description="Pass _True_ if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";
import { MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a regular sticker set with one initial sticker from a local file
const stickerFile = await MediaUpload.path("./sticker.webp");

await bot.api.createNewStickerSet({
  user_id: 123456789,
  name: "my_animals_by_mybotname",
  title: "My Animals",
  stickers: [
    {
      sticker: stickerFile,
      format: "static",
      emoji_list: ["🐱"],
    },
  ],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a sticker set using an already-uploaded file_id
await bot.api.createNewStickerSet({
  user_id: 123456789,
  name: "my_pack_by_mybotname",
  title: "My Sticker Pack",
  stickers: [
    {
      sticker: "EXISTING_FILE_ID_HERE", // re-use an uploaded sticker file
      format: "static",
      emoji_list: ["😀", "🎉"],
    },
  ],
  // sticker_type defaults to "regular" when omitted
});
```

```ts twoslash
import { Bot } from "gramio";
import { MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a custom emoji sticker set with repainting (adapts to theme colors)
const stickerFile = await MediaUpload.path("./emoji.webp");

await bot.api.createNewStickerSet({
  user_id: 123456789,
  name: "my_emoji_by_mybotname",
  title: "My Custom Emoji",
  stickers: [
    {
      sticker: stickerFile,
      format: "static",
      emoji_list: ["⭐"],
      keywords: ["star", "favorite", "highlight"],
    },
  ],
  sticker_type: "custom_emoji",
  needs_repainting: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKERSET_INVALID` | The `name` is already taken or the bot already owns a set with this name |
| 400 | `Bad Request: STICKER_PNG_DIMENSIONS` | Sticker image dimensions are invalid — static stickers must be 512×512 px |
| 400 | `Bad Request: STICKER_EMOJI_INVALID` | `emoji_list` is empty or contains an invalid emoji — must be 1–20 valid emoji |
| 400 | `Bad Request: STICKERSET_NAME_INVALID` | `name` does not match the required format or does not end in `_by_<botusername>` |
| 400 | `Bad Request: USER_ID_INVALID` | `user_id` is not a valid Telegram user ID |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | Invalid `sticker` value — check the file_id or use `MediaUpload` for fresh uploads |
| 403 | `Forbidden: bot was blocked by the user` | The owner user has blocked the bot — the bot must have interacted with the owner first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`name` must end in `_by_<bot_username>` (case-insensitive).** For a bot with username `@MyBot`, a valid name is `cool_stickers_by_mybot`. Forgetting this suffix is the most common error.
- **The sticker owner (`user_id`) must have previously started the bot.** The bot cannot create a sticker set for a user it has never interacted with.
- **`emoji_list` is required and must contain 1–20 valid emoji.** This controls which emoji suggest the sticker in the emoji picker.
- **Static stickers must be 512×512 px WEBP.** Animated stickers use TGS format; video stickers use WEBM. The `format` field must match the file type.
- **`needs_repainting: true` is only valid for `sticker_type: "custom_emoji"`.** The TypeScript type for `sticker_type` only accepts `"mask"` or `"custom_emoji"` — omit the field entirely to get the default regular sticker set.
- **Use `addStickerToSet` to add more stickers after creation.** The initial `stickers` array supports 1–50 items; add more later up to the set limit.
- **First upload the file with `uploadStickerFile` if you plan to reuse it.** This gives you a stable `file_id` you can reference across multiple calls without re-uploading.

## See Also

- [`addStickerToSet`](/telegram/methods/addStickerToSet) — Add more stickers to an existing set
- [`deleteStickerFromSet`](/telegram/methods/deleteStickerFromSet) — Remove a sticker from a set
- [`getStickerSet`](/telegram/methods/getStickerSet) — Get information about a sticker set by name
- [`uploadStickerFile`](/telegram/methods/uploadStickerFile) — Upload a sticker file to get a reusable file_id
- [`InputSticker`](/telegram/types/InputSticker) — The sticker descriptor type used in the `stickers` array
- [`StickerSet`](/telegram/types/StickerSet) — Type returned by `getStickerSet`
- [File uploads guide](/files/media-upload) — How to use `MediaUpload` for sticker file uploads
