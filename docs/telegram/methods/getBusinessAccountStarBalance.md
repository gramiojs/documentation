---
title: getBusinessAccountStarBalance — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get the Telegram Star balance of a managed business account using GramIO. Requires can_view_gifts_and_stars business bot right. Returns StarAmount with full and nano precision.
  - - meta
    - name: keywords
      content: getBusinessAccountStarBalance, telegram bot api, business account stars, telegram star balance, gramio getBusinessAccountStarBalance, getBusinessAccountStarBalance typescript, getBusinessAccountStarBalance example, StarAmount, business_connection_id, can_view_gifts_and_stars, telegram business bot stars
---

# getBusinessAccountStarBalance

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/StarAmount">StarAmount</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getbusinessaccountstarbalance" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the amount of Telegram Stars owned by a managed business account. Requires the *can\_view\_gifts\_and\_stars* business bot right. Returns [StarAmount](https://core.telegram.org/bots/api#staramount) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

## Returns

On success, the [StarAmount](/telegram/types/StarAmount) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the Star balance of a managed business account
const balance = await bot.api.getBusinessAccountStarBalance({
  business_connection_id: "bc_123",
});

console.log(`Star balance: ${balance.amount} ⭐`);

// nanostar_amount holds fractional stars (0–999_999_999)
if (balance.nanostar_amount) {
  console.log(`+ ${balance.nanostar_amount} nanostars`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Guard: check if the account has enough Stars before a transfer
async function hasEnoughStars(connectionId: string, required: number) {
  const balance = await bot.api.getBusinessAccountStarBalance({
    business_connection_id: connectionId,
  });
  return balance.amount >= required;
}

const canAfford = await hasEnoughStars("bc_123", 50);
console.log(`Can afford 50 Stars: ${canAfford}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Log balance whenever a business connection is established
bot.on("business_connection", async (ctx) => {
  if (!ctx.isEnabled) return;

  const balance = await bot.api.getBusinessAccountStarBalance({
    business_connection_id: ctx.id,
  });

  console.log(
    `Connected account ${ctx.user.id} has ${balance.amount} Stars`
  );
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the connection was revoked — re-verify with [`getBusinessConnection`](/telegram/methods/getBusinessConnection) |
| 400 | `Bad Request: not enough rights` | The bot lacks the `can_view_gifts_and_stars` business bot right — check `connection.rights` before calling |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Requires `can_view_gifts_and_stars` right.** This is granted by the business account owner during setup — verify it from `connection.rights?.can_view_gifts_and_stars` before calling to avoid needless errors.
- **`StarAmount` has two parts.** `amount` is the integer Star balance. `nanostar_amount` (0–999,999,999) represents fractional precision — usually `0` in practice, but handle it if you display totals mathematically.
- **The balance is a point-in-time snapshot.** Re-fetch just before any Stars transfer operation rather than relying on a cached value — the balance can change between calls.
- **This endpoint is read-only.** You can't add or deduct Stars through this method. To transfer Stars, use the appropriate transfer endpoint.

## See Also

- [`getBusinessConnection`](/telegram/methods/getBusinessConnection) — verify the connection and check `can_view_gifts_and_stars` right
- [`getBusinessAccountGifts`](/telegram/methods/getBusinessAccountGifts) — get gifts owned by the same business account
- [`getMyStarBalance`](/telegram/methods/getMyStarBalance) — get the bot's own Star balance
- [`StarAmount`](/telegram/types/StarAmount) — the return type with `amount` and `nanostar_amount` fields
- [`BusinessConnection`](/telegram/types/BusinessConnection) — the business connection object with rights info
- [`BusinessBotRights`](/telegram/types/BusinessBotRights) — business bot rights including `can_view_gifts_and_stars`
