---
title: getBusinessAccountGifts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getBusinessAccountGifts Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getBusinessAccountGifts, telegram bot api, gramio getBusinessAccountGifts, getBusinessAccountGifts typescript, getBusinessAccountGifts example
---

# getBusinessAccountGifts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getbusinessaccountgifts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the gifts received and owned by a managed business account. Requires the _can\_view\_gifts\_and\_stars_ business bot right. Returns [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="exclude_unsaved" type="Boolean" required description="Pass _True_ to exclude gifts that aren't saved to the account's profile page" />

<ApiParam name="exclude_saved" type="Boolean" required description="Pass _True_ to exclude gifts that are saved to the account's profile page" />

<ApiParam name="exclude_unlimited" type="Boolean" required description="Pass _True_ to exclude gifts that can be purchased an unlimited number of times" />

<ApiParam name="exclude_limited_upgradable" type="Boolean" required description="Pass _True_ to exclude gifts that can be purchased a limited number of times and can be upgraded to unique" />

<ApiParam name="exclude_limited_non_upgradable" type="Boolean" required description="Pass _True_ to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique" />

<ApiParam name="exclude_unique" type="Boolean" required description="Pass _True_ to exclude unique gifts" />

<ApiParam name="exclude_from_blockchain" type="Boolean" required description="Pass _True_ to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram" />

<ApiParam name="sort_by_price" type="Boolean" required description="Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination." />

<ApiParam name="offset" type="String" required description="Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results" />

<ApiParam name="limit" type="Integer" required description="The maximum number of gifts to be returned; 1-100. Defaults to 100" :max="1" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
