---
title: getStarTransactions — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve and paginate the bot's Telegram Stars transaction history using GramIO. TypeScript examples for getStarTransactions — listing payments, paginating large histories, and auditing star earnings.
  - - meta
    - name: keywords
      content: getStarTransactions, telegram bot api, gramio getStarTransactions, getStarTransactions typescript, telegram stars transactions, bot payment history, StarTransactions, StarTransaction, telegram monetization, star earnings, getStarTransactions example
---

# getStarTransactions

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/StarTransactions">StarTransactions</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getstartransactions" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the bot's Telegram Star transactions in chronological order. On success, returns a [StarTransactions](https://core.telegram.org/bots/api#startransactions) object.

## Parameters

<ApiParam name="offset" type="Integer" description="Number of transactions to skip in the response" />

<ApiParam name="limit" type="Integer" description="The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100." :min="1" :max="100" :defaultValue="100" />

## Returns

On success, the [StarTransactions](/telegram/types/StarTransactions) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch the most recent 100 transactions (default)
const result = await bot.api.getStarTransactions();

for (const tx of result.transactions) {
  console.log(`ID: ${tx.id}, Stars: ${tx.nanostar_amount ?? 0}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch just the 10 most recent transactions
const result = await bot.api.getStarTransactions({ limit: 10 });

console.log(`Fetched ${result.transactions.length} transactions`);
result.transactions.forEach((tx, i) => {
  console.log(`[${i + 1}] ${tx.id} — nanostar_amount: ${tx.nanostar_amount ?? 0}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through all transactions using offset
async function getAllTransactions() {
  const PAGE_SIZE = 100;
  let offset = 0;
  const all = [];

  while (true) {
    const page = await bot.api.getStarTransactions({
      offset,
      limit: PAGE_SIZE,
    });

    all.push(...page.transactions);

    if (page.transactions.length < PAGE_SIZE) break; // last page
    offset += page.transactions.length;
  }

  return all;
}

const transactions = await getAllTransactions();
console.log(`Total transactions: ${transactions.length}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Summarise total stars received (source transactions only)
const result = await bot.api.getStarTransactions({ limit: 100 });

const totalNanoStars = result.transactions
  .filter((tx) => tx.source !== undefined)
  .reduce((sum, tx) => sum + (tx.nanostar_amount ?? 0), 0);

const totalStars = totalNanoStars / 1_000_000_000;
console.log(`Total received: ~${totalStars.toFixed(2)} Stars`);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: invalid limit` | `limit` is outside the 1–100 range |
| 400 | `Bad Request: invalid offset` | `offset` is negative |
| 401 | `Unauthorized: invalid token specified` | The bot token is wrong or revoked |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — back off for `retry_after` seconds |

## Tips & Gotchas

- **`offset` skips transactions, not pages.** Pass the cumulative count of already-fetched transactions as `offset` to get the next batch — not a page number.
- **An empty `transactions` array signals the end.** When the returned array is shorter than `limit`, you have fetched all available transactions.
- **`limit` caps at 100.** Requesting more than 100 will cause a `400 Bad Request`. Default is also 100, so omitting `limit` already gives the maximum per call.
- **Amounts are in nanostar units.** Each `StarTransaction.nanostar_amount` is expressed in billionths of a Star (1 Star = 1,000,000,000 nanostar). Divide by `1_000_000_000` to get whole Stars.
- **Transactions are in chronological order.** The most recent transactions appear last. If you only need recent activity, use a small `limit` with no offset.
- **Cross-reference with `getMyStarBalance`.** The transaction history drives the balance; summing all transaction amounts should approximate the value returned by `getMyStarBalance`.

## See Also

- [StarTransactions](/telegram/types/StarTransactions) — return type wrapping the transaction list
- [StarTransaction](/telegram/types/StarTransaction) — individual transaction record type
- [getMyStarBalance](/telegram/methods/getMyStarBalance) — get the current aggregate Stars balance
- [refundStarPayment](/telegram/methods/refundStarPayment) — refund a specific Star payment
- [sendInvoice](/telegram/methods/sendInvoice) — send an invoice to receive Stars
