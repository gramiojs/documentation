---
title: MessageOriginChannel — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: MessageOriginChannel Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: MessageOriginChannel, telegram bot api types, gramio MessageOriginChannel, MessageOriginChannel object, MessageOriginChannel typescript
---

# MessageOriginChannel

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#messageoriginchannel" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The message was originally sent to a channel chat.

## Fields

<ApiParam name="type" type="String" required description="Type of the message origin, always &quot;channel&quot;" constValue="channel" />

<ApiParam name="date" type="Integer" required description="Date the message was sent originally in Unix time" />

<ApiParam name="chat" type="Chat" required description="Channel chat to which the message was originally sent" />

<ApiParam name="message_id" type="Integer" required description="Unique message identifier inside the chat" />

<ApiParam name="author_signature" type="String" description="*Optional*. Signature of the original post author" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
