---
title: Poll — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Poll Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Poll, telegram bot api types, gramio Poll, Poll object, Poll typescript
---

# Poll

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#poll" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about a poll.

## Fields

<ApiParam name="id" type="String" required description="Unique poll identifier" />

<ApiParam name="question" type="String" required description="Poll question, 1-300 characters" />

<ApiParam name="question_entities" type="MessageEntity[]" description="_Optional_. Special entities that appear in the _question_. Currently, only custom emoji entities are allowed in poll questions" />

<ApiParam name="options" type="PollOption[]" required description="List of poll options" />

<ApiParam name="total_voter_count" type="Integer" required description="Total number of users that voted in the poll" />

<ApiParam name="is_closed" type="Boolean" required description="_True_, if the poll is closed" />

<ApiParam name="is_anonymous" type="Boolean" required description="_True_, if the poll is anonymous" />

<ApiParam name="type" type="String" required description="Poll type, currently can be “regular” or “quiz”" />

<ApiParam name="allows_multiple_answers" type="Boolean" required description="_True_, if the poll allows multiple answers" />

<ApiParam name="correct_option_id" type="Integer" description="_Optional_. 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot." />

<ApiParam name="explanation" type="String" description="_Optional_. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters" />

<ApiParam name="explanation_entities" type="MessageEntity[]" description="_Optional_. Special entities like usernames, URLs, bot commands, etc. that appear in the _explanation_" />

<ApiParam name="open_period" type="Integer" description="_Optional_. Amount of time in seconds the poll will be active after creation" />

<ApiParam name="close_date" type="Integer" description="_Optional_. Point in time (Unix timestamp) when the poll will be automatically closed" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
