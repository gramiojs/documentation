---
title: getUserGifts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getUserGifts Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getUserGifts, telegram bot api, gramio getUserGifts, getUserGifts typescript, getUserGifts example
---

# getUserGifts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/OwnedGifts">OwnedGifts</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getusergifts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the gifts owned and hosted by a user. Returns [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the user" />

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

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
