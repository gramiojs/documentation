---
title: ChatJoinRequest — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatJoinRequest Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatJoinRequest, telegram bot api types, gramio ChatJoinRequest, ChatJoinRequest object, ChatJoinRequest typescript
---

# ChatJoinRequest

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatjoinrequest" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a join request sent to a chat.

## Fields

<ApiParam name="chat" type="Chat" required description="Chat to which the request was sent" />

<ApiParam name="from" type="User" required description="User that sent the join request" />

<ApiParam name="user_chat_id" type="Integer" required description="Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user." />

<ApiParam name="date" type="Integer" required description="Date the request was sent in Unix time" />

<ApiParam name="bio" type="String" description="_Optional_. Bio of the user." />

<ApiParam name="invite_link" type="ChatInviteLink" description="_Optional_. Chat invite link that was used by the user to send the join request" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
