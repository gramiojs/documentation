---
title: BusinessMessagesDeleted — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: BusinessMessagesDeleted Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: BusinessMessagesDeleted, telegram bot api types, gramio BusinessMessagesDeleted, BusinessMessagesDeleted object, BusinessMessagesDeleted typescript
---

# BusinessMessagesDeleted

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#businessmessagesdeleted" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object is received when messages are deleted from a connected business account.

## Fields

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="chat" type="Chat" required description="Information about a chat in the business account. The bot may not have access to the chat or the corresponding user." />

<ApiParam name="message_ids" type="Integer[]" required description="The list of identifiers of deleted messages in the chat of the business account" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
