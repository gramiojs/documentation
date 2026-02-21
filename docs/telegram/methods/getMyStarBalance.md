---
title: getMyStarBalance — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve the bot's current Telegram Stars balance using GramIO. TypeScript examples for getMyStarBalance — checking star balance, monitoring earnings, and handling nano-star precision amounts.
  - - meta
    - name: keywords
      content: getMyStarBalance, telegram bot api, gramio getMyStarBalance, getMyStarBalance typescript, telegram stars balance, bot stars balance, StarAmount, telegram monetization, check bot balance, getMyStarBalance example
---

# getMyStarBalance

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/StarAmount">StarAmount</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getmystarbalance" target="_blank" rel="noopener">Official docs ↗</a>
</div>

A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a [StarAmount](https://core.telegram.org/bots/api#staramount) object.

## Returns

On success, the [StarAmount](/telegram/types/StarAmount) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch the bot's current Telegram Stars balance
const balance = await bot.api.getMyStarBalance();
console.log(`Stars balance: ${balance.amount}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Display full balance including nano-star fractional part
const balance = await bot.api.getMyStarBalance();

const nanos = balance.nanostar_amount ?? 0;
const fractional = (nanos / 1_000_000_000).toFixed(9).replace(/\.?0+$/, "");

console.log(
  `Stars balance: ${balance.amount}${fractional ? `.${fractional.split(".")[1]}` : ""}`
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Log balance at startup and alert when it drops below a threshold
const balance = await bot.api.getMyStarBalance();

const MIN_STARS = 100;
if (balance.amount < MIN_STARS) {
  console.warn(
    `Low Stars balance: ${balance.amount} (threshold: ${MIN_STARS})`
  );
} else {
  console.log(`Stars balance OK: ${balance.amount}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Periodically monitor the balance — e.g. every hour
setInterval(async () => {
  const balance = await bot.api.getMyStarBalance();
  console.log(`[${new Date().toISOString()}] Balance: ${balance.amount} Stars`);
}, 60 * 60 * 1000);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized: invalid token specified` | The bot token is wrong or revoked |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — back off for `retry_after` seconds |

## Tips & Gotchas

- **`amount` is an integer in whole Stars.** The value is never a float — sub-Star precision is captured in the separate `nanostar_amount` field (billionths of a Star).
- **`nanostar_amount` is optional.** It may be absent (equivalent to 0) or negative when `amount` is 0 or negative. Always null-check it before arithmetic.
- **Balance can be negative.** If the bot has pending debits (e.g. paid broadcast charges), `amount` can go below zero. Guard accordingly.
- **No parameters needed.** Unlike most API methods, this call requires no arguments — call it directly with `bot.api.getMyStarBalance()`.
- **Poll sparingly.** The Telegram API has rate limits; consider caching the result for at least a minute between checks rather than calling on every update.
- **Stars are earned from invoices and subscriptions.** Use `getStarTransactions` to see the full transaction history behind the balance.

## See Also

- [StarAmount](/telegram/types/StarAmount) — return type with `amount` and `nanostar_amount` fields
- [getStarTransactions](/telegram/methods/getStarTransactions) — paginate the full transaction history
- [refundStarPayment](/telegram/methods/refundStarPayment) — refund a Star payment to a user
- [sendInvoice](/telegram/methods/sendInvoice) — send a payment invoice (Stars or fiat)
