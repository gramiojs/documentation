---
title: deleteEphemeralMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteEphemeralMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteEphemeralMessage, telegram bot api, gramio deleteEphemeralMessage, deleteEphemeralMessage typescript, deleteEphemeralMessage example
---

# deleteEphemeralMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deleteephemeralmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup in the format `@username`" />

<ApiParam name="receiver_user_id" type="Integer" required description="Identifier of the user who received the message" />

<ApiParam name="ephemeral_message_id" type="Integer" required description="Identifier of the ephemeral message to delete" />

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
