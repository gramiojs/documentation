---
title: upgradeGift — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Upgrade a regular gift to a unique gift using GramIO with TypeScript. Business bot method with star transfer, keep_original_details, and complete error handling.
  - - meta
    - name: keywords
      content: upgradeGift, telegram bot api, upgrade gift telegram bot, gramio upgradeGift, upgradeGift typescript, upgradeGift example, business_connection_id, owned_gift_id, star_count, keep_original_details, telegram unique gift, telegram stars upgrade, can_transfer_and_upgrade_gifts, how to upgrade gift telegram bot
---

# upgradeGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#upgradegift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Upgrades a given regular gift to a unique gift. Requires the *can\_transfer\_and\_upgrade\_gifts* business bot right. Additionally requires the *can\_transfer\_stars* business bot right if the upgrade is paid. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="owned_gift_id" type="String" required description="Unique identifier of the regular gift that should be upgraded to a unique one" />

<ApiParam name="keep_original_details" type="Boolean" description="Pass *True* to keep the original gift text, sender and receiver in the upgraded gift" />

<ApiParam name="star_count" type="Integer" description="The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If `gift.prepaid_upgrade_star_count &gt; 0`, then pass 0, otherwise, the *can\_transfer\_stars* business bot right is required and `gift.upgrade_star_count` must be passed." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Upgrade a prepaid gift (star_count: 0 uses the prepaid amount)
await bot.api.upgradeGift({
  business_connection_id: "biz_connection_id",
  owned_gift_id: "gift_unique_id",
  star_count: 0,
  keep_original_details: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paid upgrade — deducts stars from the business account balance
// Requires can_transfer_stars right in addition to can_transfer_and_upgrade_gifts
await bot.api.upgradeGift({
  business_connection_id: "biz_connection_id",
  owned_gift_id: "gift_unique_id",
  star_count: 25, // use gift.upgrade_star_count value
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Upgrade and preserve original sender/receiver/text in the unique gift
await bot.api.upgradeGift({
  business_connection_id: "biz_connection_id",
  owned_gift_id: "gift_unique_id",
  star_count: 0,
  keep_original_details: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | `business_connection_id` is invalid or the bot has no active business connection with that ID |
| 400 | `Bad Request: not enough rights` | Bot lacks `can_transfer_and_upgrade_gifts` right, or the upgrade is paid and `can_transfer_stars` is also missing |
| 400 | `Bad Request: gift not found` | `owned_gift_id` is invalid, already upgraded, or doesn't belong to this business connection |
| 400 | `Bad Request: not enough stars` | The business account balance is insufficient for the paid upgrade — check `gift.upgrade_star_count` |
| 400 | `Bad Request: STAR_COUNT_INVALID` | Passed a non-zero `star_count` when `gift.prepaid_upgrade_star_count > 0`, or passed 0 for a non-prepaid gift |

## Tips & Gotchas

- **Check `gift.prepaid_upgrade_star_count` first.** If this field is `> 0`, the upgrade is prepaid — always pass `star_count: 0`. Passing the wrong value will return `STAR_COUNT_INVALID`.
- **`can_transfer_stars` is only required for paid upgrades.** If the gift has a prepaid upgrade slot, only `can_transfer_and_upgrade_gifts` is needed.
- **`keep_original_details: true` preserves identity.** Without it, the upgraded unique gift will show the business account as sender with no original text or receiver info.
- **`owned_gift_id` comes from `getBusinessAccountGifts`.** Fetch the gift list first, then extract the `owned_gift_id` from the `OwnedGiftRegular` object.
- **Each gift can only be upgraded once.** Attempting to upgrade an already-unique gift returns a gift not found error.

## See Also

- [getBusinessAccountGifts](/telegram/methods/getBusinessAccountGifts)
- [transferGift](/telegram/methods/transferGift)
- [sendGift](/telegram/methods/sendGift)
- [UniqueGift](/telegram/types/UniqueGift)
- [OwnedGift](/telegram/types/OwnedGift)
- [OwnedGiftRegular](/telegram/types/OwnedGiftRegular)
- [OwnedGiftUnique](/telegram/types/OwnedGiftUnique)
