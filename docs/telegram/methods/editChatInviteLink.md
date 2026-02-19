---
title: editChatInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editChatInviteLink Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editChatInviteLink, telegram bot api, gramio editChatInviteLink, editChatInviteLink typescript, editChatInviteLink example
---

# editChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editchatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="invite_link" type="String" required description="The invite link to edit" />

<ApiParam name="name" type="String" required description="Invite link name; 0-32 characters" />

<ApiParam name="expire_date" type="Integer" required description="Point in time (Unix timestamp) when the link will expire" />

<ApiParam name="member_limit" type="Integer" required description="The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999" :min="1" :max="1" />

<ApiParam name="creates_join_request" type="Boolean" required description="_True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member\_limit_ can't be specified" />

## Returns

On success, the [ChatInviteLink](/telegram/types/ChatInviteLink) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
