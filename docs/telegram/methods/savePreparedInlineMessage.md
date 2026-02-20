---
title: savePreparedInlineMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: savePreparedInlineMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: savePreparedInlineMessage, telegram bot api, gramio savePreparedInlineMessage, savePreparedInlineMessage typescript, savePreparedInlineMessage example
---

# savePreparedInlineMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/PreparedInlineMessage">PreparedInlineMessage</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#savepreparedinlinemessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Stores a message that can be sent by a user of a Mini App. Returns a [PreparedInlineMessage](https://core.telegram.org/bots/api#preparedinlinemessage) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user that can use the prepared message" />

<ApiParam name="result" type="InlineQueryResult" required description="A JSON-serialized object describing the message to be sent" />

<ApiParam name="allow_user_chats" type="Boolean" description="Pass *True* if the message can be sent to private chats with users" />

<ApiParam name="allow_bot_chats" type="Boolean" description="Pass *True* if the message can be sent to private chats with bots" />

<ApiParam name="allow_group_chats" type="Boolean" description="Pass *True* if the message can be sent to group and supergroup chats" />

<ApiParam name="allow_channel_chats" type="Boolean" description="Pass *True* if the message can be sent to channel chats" />

## Returns

On success, the [PreparedInlineMessage](/telegram/types/PreparedInlineMessage) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
