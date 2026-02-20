---
title: getBusinessAccountGifts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve gifts owned by a managed Telegram business account using GramIO. Filter by gift type, sort by price, and paginate results. Requires can_view_gifts_and_stars right.
  - - meta
    - name: keywords
      content: getBusinessAccountGifts, telegram bot api, business account gifts, gramio getBusinessAccountGifts, getBusinessAccountGifts typescript, getBusinessAccountGifts example, OwnedGifts, business_connection_id, can_view_gifts_and_stars, telegram business gifts, owned gifts pagination
---

# getBusinessAccountGifts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getbusinessaccountgifts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the gifts received and owned by a managed business account. Requires the _can\_view\_gifts\_and\_stars_ business bot right. Returns [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="exclude_unsaved" type="Boolean" required description="Pass _True_ to exclude gifts that aren't saved to the account's profile page" />

<ApiParam name="exclude_saved" type="Boolean" required description="Pass _True_ to exclude gifts that are saved to the account's profile page" />

<ApiParam name="exclude_unlimited" type="Boolean" required description="Pass _True_ to exclude gifts that can be purchased an unlimited number of times" />

<ApiParam name="exclude_limited_upgradable" type="Boolean" required description="Pass _True_ to exclude gifts that can be purchased a limited number of times and can be upgraded to unique" />

<ApiParam name="exclude_limited_non_upgradable" type="Boolean" required description="Pass _True_ to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique" />

<ApiParam name="exclude_unique" type="Boolean" required description="Pass _True_ to exclude unique gifts" />

<ApiParam name="exclude_from_blockchain" type="Boolean" required description="Pass _True_ to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram" />

<ApiParam name="sort_by_price" type="Boolean" required description="Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination." />

<ApiParam name="offset" type="String" required description="Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results" />

<ApiParam name="limit" type="Integer" required description="The maximum number of gifts to be returned; 1-100. Defaults to 100" :max="1" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch the first page of owned gifts for a business account
const result = await bot.api.getBusinessAccountGifts({
  business_connection_id: "bc_123",
});

console.log(`Total gifts: ${result.total_count}`);
console.log(`Fetched: ${result.gifts.length}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch only unique gifts, sorted by price
const result = await bot.api.getBusinessAccountGifts({
  business_connection_id: "bc_123",
  exclude_unlimited: true,
  exclude_limited_upgradable: true,
  exclude_limited_non_upgradable: true,
  sort_by_price: true,
  limit: 50,
});

console.log(`Unique gifts: ${result.gifts.length}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through all owned gifts
async function fetchAllGifts(businessConnectionId: string) {
  const all = [];
  let offset = "";

  do {
    const page = await bot.api.getBusinessAccountGifts({
      business_connection_id: businessConnectionId,
      limit: 100,
      offset,
    });

    all.push(...page.gifts);
    offset = page.next_offset ?? "";
  } while (offset);

  return all;
}

const allGifts = await fetchAllGifts("bc_123");
console.log(`Total fetched: ${allGifts.length}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check owned gifts when a business connection is established
bot.on("business_connection", async (ctx) => {
  if (!ctx.isEnabled) return;

  const result = await bot.api.getBusinessAccountGifts({
    business_connection_id: ctx.id,
    exclude_from_blockchain: true,
  });

  console.log(`Business account has ${result.total_count} gifts`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the connection was revoked — verify it's still active with [`getBusinessConnection`](/telegram/methods/getBusinessConnection) |
| 400 | `Bad Request: not enough rights` | The bot lacks the `can_view_gifts_and_stars` business bot right — check `connection.rights` before calling |
| 400 | `Bad Request: invalid offset` | The `offset` string is malformed — always use the `next_offset` value from a previous response |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Requires `can_view_gifts_and_stars` right.** Granted by the business account owner during connection setup — check `connection.rights?.can_view_gifts_and_stars` before calling to avoid unnecessary errors.
- **All `exclude_*` flags are independent and additive.** You can combine any number of them to narrow the result. There's no "include only X" flag — use `exclude_*` for everything else.
- **`sort_by_price` applies before pagination.** Always pass the same value in every paginated request, otherwise ordering shifts and you'll get duplicate or missing entries across pages.
- **Pagination uses opaque string offsets.** Never construct `offset` values manually — use `next_offset` from the previous response. Pass an empty string `""` to start from the beginning.
- **`limit` defaults to 100 (the maximum).** For quick previews, use a smaller value. Don't fetch more pages than you need — accounts with many gifts can have large result sets.
- **Blockchain gifts (`exclude_from_blockchain`)** are TON-assigned and cannot be resold or transferred within Telegram. Exclude them if your workflow only handles tradeable gifts.

## See Also

- [`getBusinessConnection`](/telegram/methods/getBusinessConnection) — verify the connection and check available rights before calling
- [`getBusinessAccountStarBalance`](/telegram/methods/getBusinessAccountStarBalance) — get the Star balance of the same business account
- [`upgradeGift`](/telegram/methods/upgradeGift) — upgrade a gift to a unique version
- [`transferGift`](/telegram/methods/transferGift) — transfer an owned gift to another user
- [`getAvailableGifts`](/telegram/methods/getAvailableGifts) — get all gifts that can be sent by the bot
- [`OwnedGifts`](/telegram/types/OwnedGifts) — the return type with `gifts` array and `next_offset`
- [`BusinessConnection`](/telegram/types/BusinessConnection) — the business connection object with rights info
