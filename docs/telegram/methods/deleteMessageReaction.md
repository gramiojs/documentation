---
title: deleteMessageReaction — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteMessageReaction Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteMessageReaction, telegram bot api, gramio deleteMessageReaction, deleteMessageReaction typescript, deleteMessageReaction example
---

# deleteMessageReaction

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletemessagereaction" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can\_delete\_messages' administrator right in the chat. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@username`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the target message" />

<ApiParam name="user_id" type="Integer" description="Identifier of the user whose reaction will be removed, if the reaction was added by a user" />

<ApiParam name="actor_chat_id" type="Integer" description="Identifier of the chat whose reaction will be removed, if the reaction was added by a chat" />

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
