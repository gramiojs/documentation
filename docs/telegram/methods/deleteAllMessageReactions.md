---
title: deleteAllMessageReactions — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteAllMessageReactions Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteAllMessageReactions, telegram bot api, gramio deleteAllMessageReactions, deleteAllMessageReactions typescript, deleteAllMessageReactions example
---

# deleteAllMessageReactions

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deleteallmessagereactions" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can\_delete\_messages' administrator right in the chat. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@username`)" />

<ApiParam name="user_id" type="Integer" description="Identifier of the user whose reactions will be removed, if the reactions were added by a user" />

<ApiParam name="actor_chat_id" type="Integer" description="Identifier of the chat whose reactions will be removed, if the reactions were added by a chat" />

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
