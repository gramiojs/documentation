---
title: getStarTransactions — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getStarTransactions Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getStarTransactions, telegram bot api, gramio getStarTransactions, getStarTransactions typescript, getStarTransactions example
---

# getStarTransactions

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/StarTransactions">StarTransactions</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getstartransactions" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Returns the bot's Telegram Star transactions in chronological order. On success, returns a [StarTransactions](https://core.telegram.org/bots/api#startransactions) object.

## Parameters

<ApiParam name="offset" type="Integer" description="Number of transactions to skip in the response" />

<ApiParam name="limit" type="Integer" description="The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100." :min="1" :max="100" :defaultValue="100" />

## Returns

On success, the [StarTransactions](/telegram/types/StarTransactions) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
