---
title: transferBusinessAccountStars — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Transfer Telegram Stars from a business account to your bot using GramIO. Requires can_transfer_stars business right. 1–10000 stars per call. TypeScript examples included.
  - - meta
    - name: keywords
      content: transferBusinessAccountStars, telegram bot api, telegram stars transfer, gramio transferBusinessAccountStars, business account stars, telegram business bot stars, transferBusinessAccountStars typescript, transferBusinessAccountStars example, business_connection_id, star_count, can_transfer_stars, telegram business api, how to transfer stars telegram business bot
---

# transferBusinessAccountStars

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#transferbusinessaccountstars" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Transfers Telegram Stars from the business account balance to the bot's balance. Requires the *can\_transfer\_stars* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="star_count" type="Integer" required description="Number of Telegram Stars to transfer; 1-10000" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Transfer 100 Stars from a connected business account to the bot
await bot.api.transferBusinessAccountStars({
  business_connection_id: "BIZCONN_abc123",
  star_count: 100,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Transfer the maximum allowed amount in one call (10,000 Stars)
await bot.api.transferBusinessAccountStars({
  business_connection_id: "BIZCONN_abc123",
  star_count: 10000,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check balance before transferring, then transfer
const balance = await bot.api.getBusinessAccountStarBalance({
  business_connection_id: "BIZCONN_abc123",
});

if (balance.amount >= 500) {
  await bot.api.transferBusinessAccountStars({
    business_connection_id: "BIZCONN_abc123",
    star_count: 500,
  });
  console.log("Transferred 500 Stars to bot balance");
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the business account has disconnected from the bot |
| 400 | `Bad Request: not enough rights` | The bot doesn't have the `can_transfer_stars` business right — the business account owner must grant this permission |
| 400 | `Bad Request: not enough stars` | The business account balance is lower than `star_count` — check balance with `getBusinessAccountStarBalance` first |
| 400 | `Bad Request: STAR_COUNT_INVALID` | `star_count` is 0 or exceeds 10,000 — must be between 1 and 10,000 inclusive |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Requires `can_transfer_stars` business bot right.** The business account owner must explicitly grant this permission when connecting the bot. Without it, every call returns an authorization error.
- **1–10,000 Stars per call.** For large transfers, you'll need multiple calls. There's no bulk-transfer API — plan for rate limits between calls.
- **Check balance before transferring.** Use [getBusinessAccountStarBalance](/telegram/methods/getBusinessAccountStarBalance) to verify sufficient funds before calling — attempting to transfer more Stars than available returns an error.
- **Stars move to the bot's balance, not the bot owner's wallet.** Transferred Stars become part of the bot's own balance and can be used for bot-related payments or withdrawals through the bot's settings.
- **This is a Business API feature.** `transferBusinessAccountStars` is only available for bots connected to a Telegram Business account. The `business_connection_id` is provided in business-related updates.

## See Also

- [getBusinessAccountStarBalance](/telegram/methods/getBusinessAccountStarBalance) — check the current Stars balance of the business account
- [getBusinessAccountGifts](/telegram/methods/getBusinessAccountGifts) — list gifts on the business account
- [transferGift](/telegram/methods/transferGift) — transfer a unique gift from the business account
