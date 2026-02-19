---
title: deleteMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteMessages Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteMessages, telegram bot api, gramio deleteMessages, deleteMessages typescript, deleteMessages example
---

# deleteMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletemessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages to delete. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted" />

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
