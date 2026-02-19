---
title: unpinChatMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: unpinChatMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: unpinChatMessage, telegram bot api, gramio unpinChatMessage, unpinChatMessage typescript, unpinChatMessage example
---

# unpinChatMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unpinchatmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can\_pin\_messages' right or the 'can\_edit\_messages' right to unpin messages in groups and channels respectively. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be unpinned" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the message to unpin. Required if _business\_connection\_id_ is specified. If not specified, the most recent pinned message (by sending date) will be unpinned." />

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
