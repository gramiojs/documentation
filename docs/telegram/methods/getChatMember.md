---
title: getChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getChatMember Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getChatMember, telegram bot api, gramio getChatMember, getChatMember typescript, getChatMember example
---

# getChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatMember">ChatMember</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a [ChatMember](https://core.telegram.org/bots/api#chatmember) object on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

## Returns

On success, the [ChatMember](/telegram/types/ChatMember) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
