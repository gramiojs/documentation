---
title: readBusinessMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: readBusinessMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: readBusinessMessage, telegram bot api, gramio readBusinessMessage, readBusinessMessage typescript, readBusinessMessage example
---

# readBusinessMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#readbusinessmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Marks incoming message as read on behalf of a business account. Requires the _can\_read\_messages_ business bot right. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which to read the message" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours." />

<ApiParam name="message_id" type="Integer" required description="Unique identifier of the message to mark as read" />

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
