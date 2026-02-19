---
title: deleteBusinessMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteBusinessMessages Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteBusinessMessages, telegram bot api, gramio deleteBusinessMessages, deleteBusinessMessages typescript, deleteBusinessMessages example
---

# deleteBusinessMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletebusinessmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Delete messages on behalf of a business account. Requires the _can\_delete\_sent\_messages_ business bot right to delete messages sent by the bot itself, or the _can\_delete\_all\_messages_ business bot right to delete any message. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which to delete the messages" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted" />

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
