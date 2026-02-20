---
title: ChatMemberBanned — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatMemberBanned Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatMemberBanned, telegram bot api types, gramio ChatMemberBanned, ChatMemberBanned object, ChatMemberBanned typescript
---

# ChatMemberBanned

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatmemberbanned" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that was banned in the chat and can't return to the chat or view chat messages.

## Fields

<ApiParam name="status" type="String" description="The member's status in the chat, always “kicked”" defaultValue="kicked" />

<ApiParam name="user" type="User" required description="Information about the user" />

<ApiParam name="until_date" type="Integer" required description="Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
