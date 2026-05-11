---
title: PollOptionDeleted — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PollOptionDeleted Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PollOptionDeleted, telegram bot api types, gramio PollOptionDeleted, PollOptionDeleted object, PollOptionDeleted typescript
---

# PollOptionDeleted

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#polloptiondeleted" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about an option deleted from a poll.

## Fields

<ApiParam name="poll_message" type="MaybeInaccessibleMessage" description="*Optional*. Message containing the poll from which the option was deleted, if known. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the *reply\_to\_message* field even if it itself is a reply." />

<ApiParam name="option_persistent_id" type="String" required description="Unique identifier of the deleted option" />

<ApiParam name="option_text" type="String" required description="Option text" />

<ApiParam name="option_text_entities" type="MessageEntity[]" description="*Optional*. Special entities that appear in the *option\_text*" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
