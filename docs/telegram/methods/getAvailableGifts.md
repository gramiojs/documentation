---
title: getAvailableGifts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve all gifts a Telegram bot can send to users and channels using GramIO. Includes star cost, limited edition availability, and sticker previews.
  - - meta
    - name: keywords
      content: getAvailableGifts, telegram bot api, telegram gifts, gramio getAvailableGifts, getAvailableGifts typescript, getAvailableGifts example, list telegram gifts, telegram gift catalog, send gift bot, telegram star gift, Gifts type
---

# getAvailableGifts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/gifts that can be sent by the bot to users and channel chats">gifts that can be sent by the bot to users and channel chats[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getavailablegifts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a [Gifts](https://core.telegram.org/bots/api#gifts) object.

## Returns

On success, an array of [gifts that can be sent by the bot to users and channel chats](/telegram/types/gifts that can be sent by the bot to users and channel chats) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// List all available gifts with limited edition details
const { gifts } = await bot.api.getAvailableGifts();

console.log(`Total gifts available: ${gifts.length}`);

for (const gift of gifts) {
  const isLimited = gift.total_count !== undefined;
  const availability = isLimited
    ? ` (${gift.remaining_count}/${gift.total_count} left)`
    : " (unlimited)";
  console.log(`Gift ${gift.id}: ${gift.star_count} ⭐${availability}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Find the cheapest available gift
const { gifts } = await bot.api.getAvailableGifts();

const cheapest = gifts.reduce((min, g) =>
  g.star_count < min.star_count ? g : min
);

console.log(`Cheapest: ${cheapest.id} — ${cheapest.star_count} ⭐`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Show a /gifts command listing only limited edition gifts
bot.command("gifts", async (ctx) => {
  const { gifts } = await bot.api.getAvailableGifts();
  const limited = gifts.filter((g) => g.total_count !== undefined);

  if (limited.length === 0) {
    return ctx.send("No limited gifts available right now.");
  }

  const lines = limited.map(
    (g) => `• ${g.star_count} ⭐ — ${g.remaining_count}/${g.total_count} left`
  );

  await ctx.send(`Limited gifts:\n${lines.join("\n")}`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Returns the full Telegram gift catalog, not just affordable ones.** Always check `gift.star_count` against your bot's own balance before calling [`sendGift`](/telegram/methods/sendGift) — no validation error is thrown until the actual send fails.
- **Limited gifts have `total_count` and `remaining_count`.** A gift can sell out between the time you fetch the list and the time you send — handle the resulting error in `sendGift` gracefully.
- **No parameters needed, no auth required.** Any bot can call this endpoint — it's a public catalog lookup. Consider caching the result since the catalog changes infrequently.
- **The `sticker` field gives a visual preview.** Use `gift.sticker.file_id` to display the gift's sticker in your bot UI before the user confirms sending.
- **Use `remaining_count` for UI indicators only.** The count can change at any moment; don't use it to gate logic — always handle the send error as the source of truth.

## See Also

- [`sendGift`](/telegram/methods/sendGift) — send a gift from this catalog to a user or channel
- [`getUserGifts`](/telegram/methods/getUserGifts) — get gifts received by a specific user
- [`getChatGifts`](/telegram/methods/getChatGifts) — get gifts received by a channel
- [`getBusinessAccountGifts`](/telegram/methods/getBusinessAccountGifts) — get gifts owned by a managed business account
- [`Gift`](/telegram/types/Gift) — the gift object type
- [`Gifts`](/telegram/types/Gifts) — the wrapper type returned by this method
