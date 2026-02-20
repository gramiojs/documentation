---
title: getCustomEmojiStickers — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get full information about custom emoji stickers by their IDs using GramIO. TypeScript examples for resolving custom emoji entities and fetching sticker metadata. Returns Sticker[].
  - - meta
    - name: keywords
      content: getCustomEmojiStickers, telegram bot api, get custom emoji stickers, gramio getCustomEmojiStickers, telegram custom emoji, getCustomEmojiStickers typescript, getCustomEmojiStickers example, Sticker, custom_emoji_id, telegram sticker info, how to get custom emoji telegram bot, custom emoji entity, custom_emoji_ids
---

# getCustomEmojiStickers

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Sticker">Sticker[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getcustomemojistickers" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of [Sticker](https://core.telegram.org/bots/api#sticker) objects.

## Parameters

<ApiParam name="custom_emoji_ids" type="String[]" required description="A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified." />

## Returns

On success, an array of [Sticker](/telegram/types/Sticker) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch sticker info for a known custom emoji ID
const stickers = await bot.api.getCustomEmojiStickers({
    custom_emoji_ids: ["5368324170671202286"],
});
console.log(stickers[0]?.emoji); // The associated base emoji character
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Resolve custom emoji entities found in an incoming message
bot.on("message", async (ctx) => {
    const entities = ctx.payload.entities ?? [];
    const emojiIds = entities
        .filter((e) => e.type === "custom_emoji")
        .map((e) => e.custom_emoji_id!);

    if (emojiIds.length === 0) return;

    const stickers = await bot.api.getCustomEmojiStickers({
        custom_emoji_ids: emojiIds,
    });
    const setNames = [...new Set(stickers.map((s) => s.set_name).filter(Boolean))];
    await ctx.send(`Custom emoji from pack(s): ${setNames.join(", ")}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Batch-fetch more than 200 IDs in chunks
async function getCustomEmojiStickersInBatches(bot: Bot, ids: string[]) {
    const results = [];
    for (let i = 0; i < ids.length; i += 200) {
        const chunk = ids.slice(i, i + 200);
        const stickers = await bot.api.getCustomEmojiStickers({
            custom_emoji_ids: chunk,
        });
        results.push(...stickers);
    }
    return results;
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: STICKER_ID_INVALID` | One or more custom emoji IDs are invalid or have been deleted |
| 400 | `Bad Request: too many custom emoji ids` | More than 200 IDs in a single request — split into chunks of ≤ 200 |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Maximum 200 IDs per request.** Batch any larger set into chunks of 200 — see the example above. Exceeding the limit returns a `400` error.
- **Custom emoji IDs come from message entities.** When a message contains a `custom_emoji` entity, its `custom_emoji_id` field holds the ID. Use `ctx.payload.entities` to extract them.
- **The returned `Sticker` objects have `type: "custom_emoji"`.** The `custom_emoji_id` field on each returned sticker matches the ID you requested.
- **Use `set_name` to find the sticker pack.** Then call `getStickerSet` with that name to retrieve the full pack and all its stickers.
- **IDs are stable but stickers can be removed.** A custom emoji ID won't change when a pack is updated, but if the sticker is deleted from the set, the ID becomes invalid and the method returns an error.
- **Order is not guaranteed.** The returned array does not necessarily match the order of `custom_emoji_ids` you sent — match by `custom_emoji_id` field if order matters.

## See Also

- [getStickerSet](/telegram/methods/getStickerSet) — get the full sticker pack for a custom emoji
- [Sticker](/telegram/types/Sticker) — the returned type
