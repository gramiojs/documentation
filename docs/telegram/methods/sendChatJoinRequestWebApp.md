---
title: sendChatJoinRequestWebApp — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendChatJoinRequestWebApp Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendChatJoinRequestWebApp, telegram bot api, gramio sendChatJoinRequestWebApp, sendChatJoinRequestWebApp typescript, sendChatJoinRequestWebApp example
---

# sendChatJoinRequestWebApp

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendchatjoinrequestwebapp" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call [answerChatJoinRequestQuery](https://core.telegram.org/bots/api#answerchatjoinrequestquery) to resolve the join request query based on the user interaction with the Mini App. Returns *True* on success.

## Parameters

<ApiParam name="chat_join_request_query_id" type="String" required description="Unique identifier of the join request query" />

<ApiParam name="web_app_url" type="String" required description="An HTTPS URL of a Web App to be opened with additional data as specified in [Initializing Web Apps](https://core.telegram.org/bots/webapps#initializing-mini-apps)" />

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
