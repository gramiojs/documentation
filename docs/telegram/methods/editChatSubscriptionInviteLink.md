---
title: editChatSubscriptionInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editChatSubscriptionInviteLink Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editChatSubscriptionInviteLink, telegram bot api, gramio editChatSubscriptionInviteLink, editChatSubscriptionInviteLink typescript, editChatSubscriptionInviteLink example
---

# editChatSubscriptionInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editchatsubscriptioninvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit a subscription invite link created by the bot. The bot must have the _can\_invite\_users_ administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="invite_link" type="String" required description="The invite link to edit" />

<ApiParam name="name" type="String" required description="Invite link name; 0-32 characters" />

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
