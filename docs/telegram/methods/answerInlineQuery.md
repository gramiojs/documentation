---
title: answerInlineQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Answer Telegram inline queries using GramIO and TypeScript. Send up to 50 results with pagination, caching, and switch-to-PM buttons. Full parameter reference and examples.
  - - meta
    - name: keywords
      content: answerInlineQuery, telegram bot api, answer inline query telegram bot, gramio answerInlineQuery, answerInlineQuery typescript, answerInlineQuery example, inline_query_id, InlineQueryResult, next_offset, is_personal, cache_time, how to answer inline query telegram bot, telegram inline mode
---

# answerInlineQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answerinlinequery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send answers to an inline query. On success, *True* is returned.  
No more than **50** results per query are allowed.

## Parameters

<ApiParam name="inline_query_id" type="String" required description="Unique identifier for the answered query" />

<ApiParam name="results" type="InlineQueryResult[]" required description="A JSON-serialized array of results for the inline query" />

<ApiParam name="cache_time" type="Integer" description="The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300." :defaultValue="300" />

<ApiParam name="is_personal" type="Boolean" description="Pass *True* if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query." />

<ApiParam name="next_offset" type="String" description="Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes." />

<ApiParam name="button" type="InlineQueryResultsButton" description="A JSON-serialized object describing a button to be shown above inline query results" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Context shorthand — inside an inline_query handler
bot.inlineQuery(async (ctx) => {
  await ctx.answerInlineQuery({
    results: [
      {
        type: "article",
        id: "result-1",
        title: "Hello World",
        input_message_content: {
          message_text: "Hello from inline mode!",
        },
      },
    ],
  });
});

// With pagination — send next_offset to load more results
bot.inlineQuery(async (ctx) => {
  const page = parseInt(ctx.inlineQuery.offset || "0");
  const pageSize = 10;
  const items = await fetchItems(page, pageSize);

  await ctx.answerInlineQuery({
    results: items.map((item, i) => ({
      type: "article",
      id: `item-${page * pageSize + i}`,
      title: item.title,
      input_message_content: { message_text: item.content },
    })),
    next_offset: items.length === pageSize ? String(page + 1) : "",
    cache_time: 60,
  });
});

// User-specific results (no shared cache)
bot.inlineQuery(async (ctx) => {
  const userFavorites = await getUserFavorites(ctx.from.id);

  await ctx.answerInlineQuery({
    results: userFavorites.map((fav) => ({
      type: "article",
      id: fav.id,
      title: fav.title,
      input_message_content: { message_text: fav.text },
    })),
    is_personal: true, // Results are unique per user — don't share cache
    cache_time: 30,
  });
});

// With a "Switch to PM" button above results
bot.inlineQuery(async (ctx) => {
  await ctx.answerInlineQuery({
    results: [],
    button: {
      text: "Open settings",
      start_parameter: "settings",
    },
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: QUERY_ID_INVALID` | Inline query expired (>10 seconds) or was already answered — answer queries immediately upon receiving the update |
| 400 | `Bad Request: RESULTS_TOO_MUCH` | `results` array has more than 50 items — paginate using `next_offset` |
| 400 | `Bad Request: next_offset is too long` | `next_offset` string exceeds 64 bytes — use short pagination tokens (e.g., page numbers) |
| 400 | `Bad Request: result id is not unique` | Two items in `results` have the same `id` — all result IDs must be unique within a single response |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Answer within 10 seconds.** Inline queries expire after 10 seconds. If your backend is slow, return a partial result or a "loading" placeholder immediately. Expired queries return `QUERY_ID_INVALID`.
- **Max 50 results per response — use `next_offset` for more.** The offset value you send is passed back as `ctx.inlineQuery.offset` on the next query. Use a page number or cursor as the offset value (max 64 bytes).
- **`cache_time` defaults to 300 seconds (5 minutes).** Telegram caches results for identical queries on the server. For dynamic, user-specific results, set `is_personal: true` and lower `cache_time`.
- **`is_personal: true` disables shared caching.** Use this whenever results differ per user (e.g., personalized lists, user-owned content). Without it, one user's results may be shown to another user with the same query.
- **All result `id` values must be unique within a single call.** Duplicates cause a 400 error. Use stable IDs from your database rather than sequential integers that could collide across pages.
- **`button` creates a fixed button above results.** Use it for "Switch to private chat" (via `start_parameter`) or "Open Web App" (via `web_app`). Useful when inline mode requires authentication or more complex setup.
- **`input_message_content.message_text` supports formatting.** Use GramIO's [formatting helpers](/formatting) to produce bold, italic, code, and links via entities — pass the result as `message_text` with `entities` instead of `parse_mode`.
- **Inline results can include inline keyboards.** Add a `reply_markup` field (an `InlineKeyboardMarkup`) to any result so the sent message has buttons. See the [Keyboards guide](/keyboards/overview) for the GramIO builder API.

## See Also

- [`InlineQueryResult`](/telegram/types/InlineQueryResult) — Union type for all result kinds (article, photo, video, etc.)
- [`InlineQueryResultsButton`](/telegram/types/InlineQueryResultsButton) — Button to show above results (switch to PM or web app)
- [Formatting guide](/formatting) — GramIO helpers for bold, italic, code, and links in message text
- [Keyboards overview](/keyboards/overview) — Add inline keyboards to results via `reply_markup`
- [Inline mode guide](https://core.telegram.org/bots/inline) — Official Telegram inline mode documentation
