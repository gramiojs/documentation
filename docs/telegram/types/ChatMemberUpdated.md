---
title: ChatMemberUpdated — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatMemberUpdated Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatMemberUpdated, telegram bot api types, gramio ChatMemberUpdated, ChatMemberUpdated object, ChatMemberUpdated typescript
---

# ChatMemberUpdated

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatmemberupdated" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents changes in the status of a chat member.

## Fields

<ApiParam name="chat" type="Chat" required description="Chat the user belongs to" />

<ApiParam name="from" type="User" required description="Performer of the action, which resulted in the change" />

<ApiParam name="date" type="Integer" required description="Date the change was done in Unix time" />

<ApiParam name="old_chat_member" type="ChatMember" required description="Previous information about the chat member" />

<ApiParam name="new_chat_member" type="ChatMember" required description="New information about the chat member" />

<ApiParam name="invite_link" type="ChatInviteLink" description="_Optional_. Chat invite link, which was used by the user to join the chat; for joining by invite link events only." />

<ApiParam name="via_join_request" type="Boolean" description="_Optional_. _True_, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator" />

<ApiParam name="via_chat_folder_invite_link" type="Boolean" description="_Optional_. _True_, if the user joined the chat via a chat folder invite link" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
