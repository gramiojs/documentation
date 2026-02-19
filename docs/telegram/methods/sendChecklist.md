---
title: sendChecklist — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendChecklist Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendChecklist, telegram bot api, gramio sendChecklist, sendChecklist typescript, sendChecklist example
---

# sendChecklist

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendchecklist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send a checklist on behalf of a connected business account. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target chat" />

<ApiParam name="checklist" type="InputChecklist" required description="A JSON-serialized object for the checklist to send" />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message silently. Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message" />

<ApiParam name="reply_parameters" type="ReplyParameters" required description="A JSON-serialized object for description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" required description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)" />

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
