---
title: setBusinessAccountUsername — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setBusinessAccountUsername Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setBusinessAccountUsername, telegram bot api, gramio setBusinessAccountUsername, setBusinessAccountUsername typescript, setBusinessAccountUsername example
---

# setBusinessAccountUsername

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountusername" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the username of a managed business account. Requires the *can\_change\_username* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="username" type="String" description="The new value of the username for the business account; 0-32 characters" :minLen="0" :maxLen="32" />

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
