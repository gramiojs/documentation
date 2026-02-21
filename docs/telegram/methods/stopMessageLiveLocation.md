---
title: stopMessageLiveLocation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: stopMessageLiveLocation Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: stopMessageLiveLocation, telegram bot api, gramio stopMessageLiveLocation, stopMessageLiveLocation typescript, stopMessageLiveLocation example
---

# stopMessageLiveLocation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#stopmessagelivelocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stop updating a live location message before *live\_period* expires. On success, if the message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message with live location to stop" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." docsLink="/keyboards/overview" />

## Returns

On success, Message | True is returned.

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
