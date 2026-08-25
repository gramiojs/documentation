---
title: answerChatJoinRequestQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: answerChatJoinRequestQuery Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: answerChatJoinRequestQuery, telegram bot api, gramio answerChatJoinRequestQuery, answerChatJoinRequestQuery typescript, answerChatJoinRequestQuery example
---

# answerChatJoinRequestQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answerchatjoinrequestquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to process a received chat join request query. Returns *True* on success.

## Parameters

<ApiParam name="chat_join_request_query_id" type="String" required description="Unique identifier of the join request query" />

<ApiParam name="result" type="String" required description="Result of the query. Must be either &quot;approve&quot; to allow the user to join the chat, &quot;decline&quot; to disallow the user to join the chat, or &quot;queue&quot; to leave the decision to other administrators." :enumValues='["approve","decline","queue"]' />

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
