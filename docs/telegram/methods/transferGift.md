---
title: transferGift — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Transfer a unique Telegram gift to another user using GramIO. Requires can_transfer_and_upgrade_gifts business right. Supports paid transfers with Stars. TypeScript examples included.
  - - meta
    - name: keywords
      content: transferGift, telegram bot api, telegram gift transfer, gramio transferGift, transfer unique gift, telegram business gifts, transferGift typescript, transferGift example, business_connection_id, owned_gift_id, new_owner_chat_id, star_count, can_transfer_and_upgrade_gifts, how to transfer gift telegram business bot
---

# transferGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#transfergift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Transfers an owned unique gift to another user. Requires the *can\_transfer\_and\_upgrade\_gifts* business bot right. Requires *can\_transfer\_stars* business bot right if the transfer is paid. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="owned_gift_id" type="String" required description="Unique identifier of the regular gift that should be transferred" />

<ApiParam name="new_owner_chat_id" type="Integer" required description="Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours." />

<ApiParam name="star_count" type="Integer" description="The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the *can\_transfer\_stars* business bot right is required." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Transfer a gift to another user for free (if the gift allows it)
await bot.api.transferGift({
  business_connection_id: "BIZCONN_abc123",
  owned_gift_id: "gift_unique_id_here",
  new_owner_chat_id: 987654321,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Transfer a gift with a Stars payment (paid transfer)
await bot.api.transferGift({
  business_connection_id: "BIZCONN_abc123",
  owned_gift_id: "gift_unique_id_here",
  new_owner_chat_id: 987654321,
  star_count: 50, // pay 50 Stars from business account for the transfer
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// List gifts, then transfer the first one to a target user
const gifts = await bot.api.getBusinessAccountGifts({
  business_connection_id: "BIZCONN_abc123",
});

const firstGift = gifts.gifts[0];
if (firstGift) {
  await bot.api.transferGift({
    business_connection_id: "BIZCONN_abc123",
    owned_gift_id: firstGift.owned_gift_id,
    new_owner_chat_id: 987654321,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the business account has been disconnected |
| 400 | `Bad Request: not enough rights` | Bot lacks `can_transfer_and_upgrade_gifts` right, or `star_count > 0` but bot also lacks `can_transfer_stars` right |
| 400 | `Bad Request: GIFT_NOT_FOUND` | The `owned_gift_id` is invalid or the gift is not owned by the connected business account |
| 400 | `Bad Request: GIFT_TRANSFER_NOT_ALLOWED` | The gift cannot be transferred — some gifts have transfer restrictions |
| 400 | `Bad Request: USER_NOT_FOUND` | The `new_owner_chat_id` doesn't correspond to an active Telegram user |
| 400 | `Bad Request: USER_NOT_ACTIVE` | The recipient user hasn't been active in the last 24 hours — Telegram requires recent activity for gift recipients |
| 400 | `Bad Request: not enough stars` | `star_count` exceeds the business account's Stars balance — check balance first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Two rights may be required.** Always `can_transfer_and_upgrade_gifts` is needed. Additionally, if `star_count > 0` (paid transfer), the bot also needs `can_transfer_stars`. Both must be granted by the business account owner.
- **Recipient must be active in the last 24 hours.** `new_owner_chat_id` must refer to a user who has used Telegram recently. Check this in your application logic before attempting the transfer — there's no pre-check API.
- **`owned_gift_id` comes from `getBusinessAccountGifts`.** This is not the same as a sticker or file ID — it's the unique identifier of an *owned* gift instance on the business account. Always retrieve it via [getBusinessAccountGifts](/telegram/methods/getBusinessAccountGifts).
- **Paid vs free transfer.** Omitting `star_count` (or passing `0`) attempts a free transfer; passing a positive value charges that many Stars from the business account balance. Some gifts may only be transferable with payment.
- **This is a Business API feature.** `transferGift` only works with bots connected to Telegram Business accounts. The `business_connection_id` comes from business-related update objects.

## See Also

- [getBusinessAccountGifts](/telegram/methods/getBusinessAccountGifts) — list owned gifts on the business account
- [upgradeGift](/telegram/methods/upgradeGift) — upgrade a gift to a unique gift
- [getBusinessAccountStarBalance](/telegram/methods/getBusinessAccountStarBalance) — check Stars balance before a paid transfer
- [transferBusinessAccountStars](/telegram/methods/transferBusinessAccountStars) — transfer Stars from business account to bot
