---
title: Chat — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Chat Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Chat, telegram bot api types, gramio Chat, Chat object, Chat typescript
---

# Chat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a chat.

## Fields

<ApiParam name="id" type="Integer" required description="Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="type" type="String" required description="Type of the chat, can be either “private”, “group”, “supergroup” or “channel”" :enumValues='["private","group","supergroup","channel"]' />

<ApiParam name="title" type="String" description="*Optional*. Title, for supergroups, channels and group chats" />

<ApiParam name="username" type="String" description="*Optional*. Username, for private chats, supergroups and channels if available" />

<ApiParam name="first_name" type="String" description="*Optional*. First name of the other party in a private chat" />

<ApiParam name="last_name" type="String" description="*Optional*. Last name of the other party in a private chat" />

<ApiParam name="is_forum" type="True" description="*Optional*. *True*, if the supergroup chat is a forum (has [topics](https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups) enabled)" />

<ApiParam name="is_direct_messages" type="True" description="*Optional*. *True*, if the chat is the direct messages chat of a channel" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
