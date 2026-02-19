---
title: banChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: banChatMember Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: banChatMember, telegram bot api, gramio banChatMember, banChatMember typescript, banChatMember example
---

# banChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#banchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless [unbanned](https://core.telegram.org/bots/api#unbanchatmember) first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="until_date" type="Integer" required description="Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only." />

<ApiParam name="revoke_messages" type="Boolean" required description="Pass _True_ to delete all messages from the chat for the user that is being removed. If _False_, the user will be able to see messages in the group that were sent before the user was removed. Always _True_ for supergroups and channels." />

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
