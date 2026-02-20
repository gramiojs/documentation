---
title: MessageOriginChat — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: MessageOriginChat Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: MessageOriginChat, telegram bot api types, gramio MessageOriginChat, MessageOriginChat object, MessageOriginChat typescript
---

# MessageOriginChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#messageoriginchat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The message was originally sent on behalf of a chat to a group chat.

## Fields

<ApiParam name="type" type="String" description="Type of the message origin, always “chat”" defaultValue="chat" />

<ApiParam name="date" type="Integer" required description="Date the message was sent originally in Unix time" />

<ApiParam name="sender_chat" type="Chat" required description="Chat that sent the message originally" />

<ApiParam name="author_signature" type="String" description="*Optional*. For messages originally sent by an anonymous chat administrator, original message author signature" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
