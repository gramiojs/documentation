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
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#stopmessagelivelocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stop updating a live location message before _live\_period_ expires. On success, if the message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Required if _inline\_message\_id_ is not specified. Identifier of the message with live location to stop" />

<ApiParam name="inline_message_id" type="String" required description="Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" required description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

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
