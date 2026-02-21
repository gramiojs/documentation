---
title: getChatGifts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get gifts owned by a Telegram channel using GramIO. TypeScript examples for listing channel gifts, filtering by type, and paginating results. Returns OwnedGifts.
  - - meta
    - name: keywords
      content: getChatGifts, telegram bot api, get chat gifts, gramio getChatGifts, telegram channel gifts, getChatGifts typescript, getChatGifts example, OwnedGifts, telegram star gifts, how to get telegram channel gifts, telegram gifts bot api, channel gift list, exclude_unique, sort_by_price
---

# getChatGifts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/OwnedGifts">OwnedGifts</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchatgifts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the gifts owned by a chat. Returns [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="exclude_unsaved" type="Boolean" description="Pass *True* to exclude gifts that aren't saved to the chat's profile page. Always *True*, unless the bot has the *can\_post\_messages* administrator right in the channel." />

<ApiParam name="exclude_saved" type="Boolean" description="Pass *True* to exclude gifts that are saved to the chat's profile page. Always *False*, unless the bot has the *can\_post\_messages* administrator right in the channel." />

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
// Get all gifts for a channel (first page)
const gifts = await bot.api.getChatGifts({
    chat_id: "@mychannel",
    offset: "",
    limit: 100,
});
console.log(`Total gifts: ${gifts.total_count}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get only unique gifts, sorted by price
const uniqueGifts = await bot.api.getChatGifts({
    chat_id: -1001234567890,
    exclude_unlimited: true,
    exclude_limited_non_upgradable: true,
    sort_by_price: true,
    offset: "",
    limit: 50,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through all gifts using an async generator
async function* getAllChatGifts(chatId: number | string) {
    let offset = "";
    while (true) {
        const result = await bot.api.getChatGifts({
            chat_id: chatId,
            offset,
            limit: 100,
        });
        yield* result.gifts;
        if (!result.next_offset) break;
        offset = result.next_offset;
    }
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — ensure the bot is an admin in the channel |
| 400 | `Bad Request: method is available for channels only` | Called on a group, supergroup, or private chat — only channels are supported |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_post_messages` — without it only saved gifts are visible |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Admin rights affect visibility.** Without `can_post_messages`, you can only see gifts already saved to the profile page — unsaved gifts are hidden. Grant the right for full access.
- **All filter params default to `false` (not excluded).** Only pass an `exclude_*` flag when you actually want to filter that category out. Passing none returns all gift types.
- **Exclusion filters are additive.** You can combine multiple `exclude_*` flags. For example, passing both `exclude_unlimited` and `exclude_limited_non_upgradable` returns only limited-upgradable and unique gifts.
- **`sort_by_price` is applied server-side before pagination.** This means cross-page ordering is consistent — don't sort client-side and expect it to match across pages.
- **Pagination uses opaque string offsets.** Pass `""` for the first page, then use `result.next_offset` as the next `offset`. If `next_offset` is absent, there are no more pages.
- **Max 100 gifts per request.** For channels with many gifts, implement pagination as shown in the generator example above.

## See Also

- [getUserGifts](/telegram/methods/getUserGifts) — get gifts for an individual user
- [getChat](/telegram/methods/getChat) — get channel info including accepted gift types
- [OwnedGifts](/telegram/types/OwnedGifts) — the returned type
