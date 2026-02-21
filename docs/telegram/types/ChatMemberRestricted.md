---
title: ChatMemberRestricted — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatMemberRestricted Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatMemberRestricted, telegram bot api types, gramio ChatMemberRestricted, ChatMemberRestricted object, ChatMemberRestricted typescript
---

# ChatMemberRestricted

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatmemberrestricted" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that is under certain restrictions in the chat. Supergroups only.

## Fields

<ApiParam name="status" type="String" required description="The member's status in the chat, always &quot;restricted&quot;" constValue="restricted" />

<ApiParam name="user" type="User" required description="Information about the user" />

<ApiParam name="is_member" type="Boolean" required description="*True*, if the user is a member of the chat at the moment of the request" />

<ApiParam name="can_send_messages" type="Boolean" required description="*True*, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues" />

<ApiParam name="can_send_audios" type="Boolean" required description="*True*, if the user is allowed to send audios" />

<ApiParam name="can_send_documents" type="Boolean" required description="*True*, if the user is allowed to send documents" />

<ApiParam name="can_send_photos" type="Boolean" required description="*True*, if the user is allowed to send photos" />

<ApiParam name="can_send_videos" type="Boolean" required description="*True*, if the user is allowed to send videos" />

<ApiParam name="can_send_video_notes" type="Boolean" required description="*True*, if the user is allowed to send video notes" />

<ApiParam name="can_send_voice_notes" type="Boolean" required description="*True*, if the user is allowed to send voice notes" />

<ApiParam name="can_send_polls" type="Boolean" required description="*True*, if the user is allowed to send polls and checklists" />

<ApiParam name="can_send_other_messages" type="Boolean" required description="*True*, if the user is allowed to send animations, games, stickers and use inline bots" />

<ApiParam name="can_add_web_page_previews" type="Boolean" required description="*True*, if the user is allowed to add web page previews to their messages" />

<ApiParam name="can_change_info" type="Boolean" required description="*True*, if the user is allowed to change the chat title, photo and other settings" />

<ApiParam name="can_invite_users" type="Boolean" required description="*True*, if the user is allowed to invite new users to the chat" />

<ApiParam name="can_pin_messages" type="Boolean" required description="*True*, if the user is allowed to pin messages" />

<ApiParam name="can_manage_topics" type="Boolean" required description="*True*, if the user is allowed to create forum topics" />

<ApiParam name="until_date" type="Integer" required description="Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
