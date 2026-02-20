---
title: promoteChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: promoteChatMember Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: promoteChatMember, telegram bot api, gramio promoteChatMember, promoteChatMember typescript, promoteChatMember example
---

# promoteChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#promotechatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass *False* for all boolean parameters to demote a user. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="is_anonymous" type="Boolean" description="Pass *True* if the administrator's presence in the chat is hidden" />

<ApiParam name="can_manage_chat" type="Boolean" description="Pass *True* if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege." />

<ApiParam name="can_delete_messages" type="Boolean" description="Pass *True* if the administrator can delete messages of other users" />

<ApiParam name="can_manage_video_chats" type="Boolean" description="Pass *True* if the administrator can manage video chats" />

<ApiParam name="can_restrict_members" type="Boolean" description="Pass *True* if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to *True* for promotions of channel administrators" />

<ApiParam name="can_promote_members" type="Boolean" description="Pass *True* if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)" />

<ApiParam name="can_change_info" type="Boolean" description="Pass *True* if the administrator can change chat title, photo and other settings" />

<ApiParam name="can_invite_users" type="Boolean" description="Pass *True* if the administrator can invite new users to the chat" />

<ApiParam name="can_post_stories" type="Boolean" description="Pass *True* if the administrator can post stories to the chat" />

<ApiParam name="can_edit_stories" type="Boolean" description="Pass *True* if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive" />

<ApiParam name="can_delete_stories" type="Boolean" description="Pass *True* if the administrator can delete stories posted by other users" />

<ApiParam name="can_post_messages" type="Boolean" description="Pass *True* if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only" />

<ApiParam name="can_edit_messages" type="Boolean" description="Pass *True* if the administrator can edit messages of other users and can pin messages; for channels only" />

<ApiParam name="can_pin_messages" type="Boolean" description="Pass *True* if the administrator can pin messages; for supergroups only" />

<ApiParam name="can_manage_topics" type="Boolean" description="Pass *True* if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only" />

<ApiParam name="can_manage_direct_messages" type="Boolean" description="Pass *True* if the administrator can manage direct messages within the channel and decline suggested posts; for channels only" />

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
