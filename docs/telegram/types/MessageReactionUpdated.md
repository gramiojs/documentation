---
title: MessageReactionUpdated — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: MessageReactionUpdated Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: MessageReactionUpdated, telegram bot api types, gramio MessageReactionUpdated, MessageReactionUpdated object, MessageReactionUpdated typescript
---

# MessageReactionUpdated

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#messagereactionupdated" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a change of a reaction on a message performed by a user.

## Fields

<ApiParam name="chat" type="Chat" required description="The chat containing the message the user reacted to" />

<ApiParam name="message_id" type="Integer" required description="Unique identifier of the message inside the chat" />

<ApiParam name="user" type="User" description="*Optional*. The user that changed the reaction, if the user isn't anonymous" />

<ApiParam name="actor_chat" type="Chat" description="*Optional*. The chat on behalf of which the reaction was changed, if the user is anonymous" />

<ApiParam name="date" type="Integer" required description="Date of the change in Unix time" />

<ApiParam name="old_reaction" type="ReactionType[]" required description="Previous list of reaction types that were set by the user" />

<ApiParam name="new_reaction" type="ReactionType[]" required description="New list of reaction types that have been set by the user" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
