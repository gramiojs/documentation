---
title: upgradeGift — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: upgradeGift Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: upgradeGift, telegram bot api, gramio upgradeGift, upgradeGift typescript, upgradeGift example
---

# upgradeGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#upgradegift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Upgrades a given regular gift to a unique gift. Requires the _can\_transfer\_and\_upgrade\_gifts_ business bot right. Additionally requires the _can\_transfer\_stars_ business bot right if the upgrade is paid. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="owned_gift_id" type="String" required description="Unique identifier of the regular gift that should be upgraded to a unique one" />

<ApiParam name="keep_original_details" type="Boolean" required description="Pass _True_ to keep the original gift text, sender and receiver in the upgraded gift" />

<ApiParam name="star_count" type="Integer" required description="The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If `gift.prepaid_upgrade_star_count > 0`, then pass 0, otherwise, the _can\_transfer\_stars_ business bot right is required and `gift.upgrade_star_count` must be passed." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
