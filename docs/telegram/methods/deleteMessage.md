---
title: deleteMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteMessage, telegram bot api, gramio deleteMessage, deleteMessage typescript, deleteMessage example
---

# deleteMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletemessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a message, including service messages, with the following limitations:  
\- A message can only be deleted if it was sent less than 48 hours ago.  
\- Service messages about a supergroup, channel, or forum topic creation can't be deleted.  
\- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.  
\- Bots can delete outgoing messages in private chats, groups, and supergroups.  
\- Bots can delete incoming messages in private chats.  
\- Bots granted _can\_post\_messages_ permissions can delete outgoing messages in channels.  
\- If the bot is an administrator of a group, it can delete any message there.  
\- If the bot has _can\_delete\_messages_ administrator right in a supergroup or a channel, it can delete any message there.  
\- If the bot has _can\_manage\_direct\_messages_ administrator right in a channel, it can delete any message in the corresponding direct messages chat.  
Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the message to delete" />

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
