---
title: pinChatMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: pinChatMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: pinChatMessage, telegram bot api, gramio pinChatMessage, pinChatMessage typescript, pinChatMessage example
---

# pinChatMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#pinchatmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can\_pin\_messages' right or the 'can\_edit\_messages' right to pin messages in groups and channels respectively. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be pinned" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of a message to pin" />

<ApiParam name="disable_notification" type="Boolean" required description="Pass _True_ if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats." />

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
