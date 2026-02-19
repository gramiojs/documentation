---
title: setBusinessAccountGiftSettings — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setBusinessAccountGiftSettings Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setBusinessAccountGiftSettings, telegram bot api, gramio setBusinessAccountGiftSettings, setBusinessAccountGiftSettings typescript, setBusinessAccountGiftSettings example
---

# setBusinessAccountGiftSettings

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountgiftsettings" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can\_change\_gift\_settings_ business bot right. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="show_gift_button" type="Boolean" required description="Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field" />

<ApiParam name="accepted_gift_types" type="AcceptedGiftTypes" required description="Types of gifts accepted by the business account" />

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
