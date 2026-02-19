---
title: revokeChatInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: revokeChatInviteLink Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: revokeChatInviteLink, telegram bot api, gramio revokeChatInviteLink, revokeChatInviteLink typescript, revokeChatInviteLink example
---

# revokeChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#revokechatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier of the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="invite_link" type="String" required description="The invite link to revoke" />

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
