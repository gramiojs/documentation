---
title: getStickerSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Fetch a Telegram sticker set by name using GramIO. TypeScript examples for getStickerSet — retrieving sticker metadata, iterating stickers, checking set type, and handling not-found errors.
  - - meta
    - name: keywords
      content: getStickerSet, telegram bot api, gramio getStickerSet, getStickerSet typescript, telegram sticker set, get sticker set, StickerSet, sticker metadata, sticker set name, getStickerSet example, sticker set not found
---

# getStickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/StickerSet">StickerSet</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getstickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get a sticker set. On success, a [StickerSet](https://core.telegram.org/bots/api#stickerset) object is returned.

## Parameters

<ApiParam name="name" type="String" required description="Name of the sticker set" />

## Returns

On success, the [StickerSet](/telegram/types/StickerSet) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch a sticker set by its short name
const stickerSet = await bot.api.getStickerSet({ name: "Animals" });

console.log(`Set: ${stickerSet.name}, title: ${stickerSet.title}`);
console.log(`Total stickers: ${stickerSet.stickers.length}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Inspect every sticker's file_id and emoji
const stickerSet = await bot.api.getStickerSet({ name: "Animals" });

for (const sticker of stickerSet.stickers) {
  console.log(`${sticker.emoji ?? "?"} → file_id: ${sticker.file_id}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Guard against a sticker set not existing
async function safeFetchSet(name: string) {
  try {
    return await bot.api.getStickerSet({ name });
  } catch (err) {
    if (err instanceof Error && err.message.includes("STICKERSET_INVALID")) {
      console.warn(`Sticker set "${name}" does not exist`);
      return null;
    }
    throw err;
  }
}

const set = await safeFetchSet("nonexistent_set_xyz");
if (set) {
  console.log(`Found: ${set.title}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check the sticker set type before processing
const stickerSet = await bot.api.getStickerSet({ name: "Animals" });

if (stickerSet.sticker_type === "custom_emoji") {
  console.log("This is a custom emoji pack");
} else if (stickerSet.sticker_type === "mask") {
  console.log("This is a mask sticker set");
} else {
  console.log("This is a regular sticker set");
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply with the first sticker from the set when a user sends its name
bot.on("message", async (ctx) => {
  const name = ctx.update.message?.text?.trim();
  if (!name) return;

  try {
    const set = await bot.api.getStickerSet({ name });
    const first = set.stickers[0];
    if (first) {
      await ctx.reply(`First sticker from "${set.title}":`);
      await bot.api.sendSticker({
        chat_id: ctx.update.message!.chat.id,
        sticker: first.file_id,
      });
    }
  } catch {
    await ctx.reply(`Sticker set "${name}" not found.`);
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKERSET_INVALID` | No sticker set exists with the given `name` — check spelling and case |
| 400 | `Bad Request: invalid sticker set name` | The `name` contains illegal characters (must be alphanumeric + underscore, ending in `_by_<botname>`) |
| 401 | `Unauthorized: invalid token specified` | The bot token is wrong or revoked |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — back off for `retry_after` seconds |

## Tips & Gotchas

- **Names are case-sensitive.** `"Animals"` and `"animals"` are different sticker sets. Use the exact short name from `@Stickers` bot or from the URL `t.me/addstickers/<name>`.
- **Bot-owned sets end with `_by_<botusername>`.** When you create a set via `createNewStickerSet`, the `name` must end with `_by_<botname>`. You can still fetch any public set regardless of owner.
- **`stickers` may be empty for sets under construction.** Newly created sets with no stickers yet will return an empty array — always guard `stickers[0]` access.
- **`sticker_type` tells you the format.** Check `stickerSet.sticker_type` (`"regular"`, `"mask"`, or `"custom_emoji"`) before deciding how to display or forward stickers.
- **`is_animated` and `is_video` affect rendering.** Animated stickers (TGS) and video stickers (WebM) require different handling than static WebP stickers.
- **Fetch only when needed — the result doesn't change often.** Sticker sets rarely change; consider caching the result keyed by `name` for the duration of a session to avoid redundant API calls.

## See Also

- [StickerSet](/telegram/types/StickerSet) — return type with all sticker metadata
- [Sticker](/telegram/types/Sticker) — individual sticker object within the set
- [createNewStickerSet](/telegram/methods/createNewStickerSet) — create a new sticker set owned by the bot
- [addStickerToSet](/telegram/methods/addStickerToSet) — add a sticker to an existing set
- [deleteStickerSet](/telegram/methods/deleteStickerSet) — delete a sticker set created by the bot
- [sendSticker](/telegram/methods/sendSticker) — send a sticker using a `file_id` from a set
- [getCustomEmojiStickers](/telegram/methods/getCustomEmojiStickers) — fetch custom emoji stickers by ID
