---
title: editMessageChecklist — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editMessageChecklist Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editMessageChecklist, telegram bot api, gramio editMessageChecklist, editMessageChecklist typescript, editMessageChecklist example
---

# editMessageChecklist

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagechecklist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit a checklist on behalf of a connected business account. On success, the edited [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target chat" />

<ApiParam name="message_id" type="Integer" required description="Unique identifier for the target message" />

<ApiParam name="checklist" type="InputChecklist" required description="A JSON-serialized object for the new checklist" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" required description="A JSON-serialized object for the new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) for the message" />

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
