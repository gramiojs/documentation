---
title: PollOption — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: PollOption Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: PollOption, telegram bot api types, gramio PollOption, PollOption object, PollOption typescript
---

# PollOption

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#polloption" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about one answer option in a poll.

## Fields

<ApiParam name="text" type="String" required description="Option text, 1-100 characters" :minLen="1" :maxLen="100" />

<ApiParam name="text_entities" type="MessageEntity[]" description="*Optional*. Special entities that appear in the option *text*. Currently, only custom emoji entities are allowed in poll option texts" />

<ApiParam name="voter_count" type="Integer" required description="Number of users that voted for this option" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
