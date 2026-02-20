---
title: ChatMemberAdministrator — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatMemberAdministrator Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatMemberAdministrator, telegram bot api types, gramio ChatMemberAdministrator, ChatMemberAdministrator object, ChatMemberAdministrator typescript
---

# ChatMemberAdministrator

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatmemberadministrator" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that has some additional privileges.

## Fields

<ApiParam name="status" type="String" description="The member's status in the chat, always “administrator”" defaultValue="administrator" />

<ApiParam name="user" type="User" required description="Information about the user" />

<ApiParam name="can_be_edited" type="Boolean" required description="*True*, if the bot is allowed to edit administrator privileges of that user" />

<ApiParam name="is_anonymous" type="Boolean" required description="*True*, if the user's presence in the chat is hidden" />

<ApiParam name="can_manage_chat" type="Boolean" required description="*True*, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege." />

<ApiParam name="can_delete_messages" type="Boolean" required description="*True*, if the administrator can delete messages of other users" />

<ApiParam name="can_manage_video_chats" type="Boolean" required description="*True*, if the administrator can manage video chats" />

<ApiParam name="can_restrict_members" type="Boolean" required description="*True*, if the administrator can restrict, ban or unban chat members, or access supergroup statistics" />

<ApiParam name="can_promote_members" type="Boolean" required description="*True*, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)" />

<ApiParam name="can_change_info" type="Boolean" required description="*True*, if the user is allowed to change the chat title, photo and other settings" />

<ApiParam name="can_invite_users" type="Boolean" required description="*True*, if the user is allowed to invite new users to the chat" />

<ApiParam name="can_post_stories" type="Boolean" required description="*True*, if the administrator can post stories to the chat" />

<ApiParam name="can_edit_stories" type="Boolean" required description="*True*, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive" />

<ApiParam name="can_delete_stories" type="Boolean" required description="*True*, if the administrator can delete stories posted by other users" />

<ApiParam name="can_post_messages" type="Boolean" description="*Optional*. *True*, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only" />

<ApiParam name="can_edit_messages" type="Boolean" description="*Optional*. *True*, if the administrator can edit messages of other users and can pin messages; for channels only" />

<ApiParam name="can_pin_messages" type="Boolean" description="*Optional*. *True*, if the user is allowed to pin messages; for groups and supergroups only" />

<ApiParam name="can_manage_topics" type="Boolean" description="*Optional*. *True*, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only" />

<ApiParam name="can_manage_direct_messages" type="Boolean" description="*Optional*. *True*, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only" />

<ApiParam name="custom_title" type="String" description="*Optional*. Custom title for this user" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
