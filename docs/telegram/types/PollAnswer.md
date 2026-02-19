---
title: PollAnswer — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PollAnswer Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PollAnswer, telegram bot api types, gramio PollAnswer, PollAnswer object, PollAnswer typescript
---

# PollAnswer

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#pollanswer" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents an answer of a user in a non-anonymous poll.

## Fields

<ApiParam name="poll_id" type="String" required description="Unique poll identifier" />

<ApiParam name="voter_chat" type="Chat" description="_Optional_. The chat that changed the answer to the poll, if the voter is anonymous" />

<ApiParam name="user" type="User" description="_Optional_. The user that changed the answer to the poll, if the voter isn't anonymous" />

<ApiParam name="option_ids" type="Integer[]" required description="0-based identifiers of chosen answer options. May be empty if the vote was retracted." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
