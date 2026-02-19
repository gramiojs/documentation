---
title: transferGift — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: transferGift Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: transferGift, telegram bot api, gramio transferGift, transferGift typescript, transferGift example
---

# transferGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#transfergift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Transfers an owned unique gift to another user. Requires the _can\_transfer\_and\_upgrade\_gifts_ business bot right. Requires _can\_transfer\_stars_ business bot right if the transfer is paid. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="owned_gift_id" type="String" required description="Unique identifier of the regular gift that should be transferred" />

<ApiParam name="new_owner_chat_id" type="Integer" required description="Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours." />

<ApiParam name="star_count" type="Integer" required description="The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the _can\_transfer\_stars_ business bot right is required." />

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
