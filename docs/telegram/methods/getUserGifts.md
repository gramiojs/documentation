---
title: getUserGifts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve gifts owned by a Telegram user using GramIO and TypeScript. Filter by gift type, paginate results, and sort by price with complete parameter reference.
  - - meta
    - name: keywords
      content: getUserGifts, telegram bot api, gramio getUserGifts, getUserGifts typescript, getUserGifts example, telegram gifts api, OwnedGifts, unique gifts telegram, limited gifts telegram, telegram bot gifts, how to get user gifts telegram, exclude_unique, exclude_unlimited, sort_by_price
---

# getUserGifts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/OwnedGifts">OwnedGifts</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getusergifts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the gifts owned and hosted by a user. Returns [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the user" />

<ApiParam name="exclude_unlimited" type="Boolean" description="Pass *True* to exclude gifts that can be purchased an unlimited number of times" />

<ApiParam name="exclude_limited_upgradable" type="Boolean" description="Pass *True* to exclude gifts that can be purchased a limited number of times and can be upgraded to unique" />

<ApiParam name="exclude_limited_non_upgradable" type="Boolean" description="Pass *True* to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique" />

<ApiParam name="exclude_from_blockchain" type="Boolean" description="Pass *True* to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram" />

<ApiParam name="exclude_unique" type="Boolean" description="Pass *True* to exclude unique gifts" />

<ApiParam name="sort_by_price" type="Boolean" description="Pass *True* to sort results by gift price instead of send date. Sorting is applied before pagination." />

<ApiParam name="offset" type="String" description="Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results" />

<ApiParam name="limit" type="Integer" description="The maximum number of gifts to be returned; 1-100. Defaults to 100" :defaultValue="100" />

## Returns

On success, the [OwnedGifts](/telegram/types/OwnedGifts) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get all gifts owned by a user:
const result = await bot.api.getUserGifts({
  user_id: 12345678,
});

console.log(`User owns ${result.total_count} gift(s)`);
for (const gift of result.gifts) {
  console.log(gift.type); // "regular" or "unique"
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch only unique gifts, sorted by price:
const uniqueGifts = await bot.api.getUserGifts({
  user_id: 12345678,
  exclude_unlimited: true,
  exclude_limited_upgradable: true,
  exclude_limited_non_upgradable: true,
  exclude_from_blockchain: false,
  sort_by_price: true,
});

console.log(`User has ${uniqueGifts.total_count} unique gift(s)`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through all gifts using cursor-based offset:
let offset = "";
const allGifts: Awaited<ReturnType<typeof bot.api.getUserGifts>>["gifts"] = [];

do {
  const page = await bot.api.getUserGifts({
    user_id: 12345678,
    limit: 50,
    offset,
  });

  allGifts.push(...page.gifts);
  offset = page.next_offset ?? "";
} while (offset !== "");

console.log(`Fetched ${allGifts.length} total gifts`);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | The `user_id` doesn't correspond to a known Telegram user |
| 400 | `Bad Request: chat not found` | User is inaccessible to the bot (never interacted and no shared chat) |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and back off |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`offset` is a string, not an integer.** Unlike most pagination in the Telegram API, `getUserGifts` uses cursor-based pagination — the `offset` from the previous response must be passed verbatim. Start with an empty string `""` for the first page.
- **`sort_by_price` is applied before pagination.** Enabling this flag changes the order of all results globally — the first page will contain the most expensive gifts, regardless of when they were sent.
- **Multiple `exclude_*` flags can be combined.** Stacking filters narrows the result set; e.g., `exclude_unlimited: true` + `exclude_unique: true` returns only limited non-upgradable gifts.
- **`exclude_from_blockchain` filters TON NFT gifts.** These gifts cannot be resold or transferred within Telegram, so you may want to separate them from standard unique gifts in your UI.
- **`total_count` reflects all matching gifts, not just the current page.** Use it to show the total to users even when paginating.
- **Added in Bot API 9.3** (December 31, 2025). Use `getChatGifts` instead for gifts received by a chat (channel/group).

## See Also

- [OwnedGifts](/telegram/types/OwnedGifts) — return type containing the gifts array and pagination info
- [OwnedGift](/telegram/types/OwnedGift) — individual gift entry (union of regular and unique gift types)
- [getChatGifts](/telegram/methods/getChatGifts) — analogous method for gifts received by a chat
- [sendGift](/telegram/methods/sendGift) — send a gift to a user
- [giftPremiumSubscription](/telegram/methods/giftPremiumSubscription) — gift a Telegram Premium subscription
