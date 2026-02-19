---
title: answerInlineQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: answerInlineQuery Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: answerInlineQuery, telegram bot api, gramio answerInlineQuery, answerInlineQuery typescript, answerInlineQuery example
---

# answerInlineQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answerinlinequery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send answers to an inline query. On success, _True_ is returned.  
No more than **50** results per query are allowed.

## Parameters

<ApiParam name="inline_query_id" type="String" required description="Unique identifier for the answered query" />

<ApiParam name="results" type="InlineQueryResult[]" required description="A JSON-serialized array of results for the inline query" />

<ApiParam name="cache_time" type="Integer" required description="The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300." :max="300" />

<ApiParam name="is_personal" type="Boolean" required description="Pass _True_ if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query." />

<ApiParam name="next_offset" type="String" required description="Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes." />

<ApiParam name="button" type="InlineQueryResultsButton" required description="A JSON-serialized object describing a button to be shown above inline query results" />

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
