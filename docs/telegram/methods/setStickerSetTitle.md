---
title: setStickerSetTitle — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the display title of a Telegram sticker set using GramIO. Update the human-readable name (1–64 characters) of a bot-created sticker set. TypeScript examples included.
  - - meta
    - name: keywords
      content: setStickerSetTitle, telegram bot api, telegram sticker set title, gramio setStickerSetTitle, change sticker set name, rename sticker pack, setStickerSetTitle typescript, setStickerSetTitle example, sticker set name, title, how to rename telegram sticker set, telegram bot sticker pack title
---

# setStickerSetTitle

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setstickersettitle" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set the title of a created sticker set. Returns *True* on success.

## Parameters

<ApiParam name="name" type="String" required description="Sticker set name" />

<ApiParam name="title" type="String" required description="Sticker set title, 1-64 characters" :minLen="1" :maxLen="64" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update the display title of a sticker set
await bot.api.setStickerSetTitle({
  name: "my_pack_by_mybot",
  title: "My Awesome Sticker Pack",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename the sticker set with a localized title
await bot.api.setStickerSetTitle({
  name: "my_pack_by_mybot",
  title: "Мой набор стикеров",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Confirm the new title by fetching the set afterward
await bot.api.setStickerSetTitle({
  name: "my_pack_by_mybot",
  title: "Updated Pack Name",
});

const set = await bot.api.getStickerSet({ name: "my_pack_by_mybot" });
console.log(set.title); // "Updated Pack Name"
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKERSET_INVALID` | The sticker set `name` doesn't exist or doesn't belong to this bot |
| 400 | `Bad Request: title is empty` | `title` is an empty string — must be 1–64 characters |
| 400 | `Bad Request: title is too long` | `title` exceeds 64 characters — shorten it |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`name` vs `title` — these are different things.** The `name` is the permanent, immutable identifier (e.g., `my_pack_by_mybot`) used in URLs and API calls. The `title` is the human-readable display name shown to users — only `title` can be changed with this method.
- **The sticker set `name` cannot be changed.** Once a set is created with a given `name`, it's permanent. Only the display `title` is mutable via this method.
- **1–64 characters, no minimum restriction on content.** Any non-empty string up to 64 chars is valid. Emoji and Unicode are allowed.
- **Title change is reflected immediately.** Users see the updated title in the sticker picker and on the sticker set page without any cache delay.
- **Only works on bot-created sets.** You cannot rename sticker sets created by other bots or via BotFather.

## See Also

- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set (sets both name and initial title)
- [getStickerSet](/telegram/methods/getStickerSet) — retrieve current sticker set details including title
- [setStickerSetThumbnail](/telegram/methods/setStickerSetThumbnail) — update the sticker set's thumbnail image
- [deleteStickerFromSet](/telegram/methods/deleteStickerFromSet) — remove a sticker from the set
- [StickerSet](/telegram/types/StickerSet) — sticker set object with name and title fields
