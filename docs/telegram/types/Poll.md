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

<ApiParam name="question" type="String" required description="Poll question, 1-300 characters" :minLen="1" :maxLen="300" />

<ApiParam name="question_entities" type="MessageEntity[]" description="*Optional*. Special entities that appear in the *question*. Currently, only custom emoji entities are allowed in poll questions" />

<ApiParam name="options" type="PollOption[]" required description="List of poll options" />

<ApiParam name="total_voter_count" type="Integer" required description="Total number of users that voted in the poll" />

<ApiParam name="is_closed" type="Boolean" required description="*True*, if the poll is closed" />

<ApiParam name="is_anonymous" type="Boolean" required description="*True*, if the poll is anonymous" />

<ApiParam name="type" type="String" required description="Poll type, currently can be &quot;regular&quot; or &quot;quiz&quot;" :enumValues='["regular","quiz"]' />

<ApiParam name="allows_multiple_answers" type="Boolean" required description="*True*, if the poll allows multiple answers" />

<ApiParam name="allows_revoting" type="Boolean" required description="*True*, if the poll allows to change the chosen answer options" />

<ApiParam name="members_only" type="Boolean" required description="*True* if voting is limited to users who have been members of the chat where the poll was originally sent for more than 24 hours" />

<ApiParam name="country_codes" type="String[]" description="*Optional*. A list of two-letter [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country codes indicating the countries from which users can vote in the poll. The country code &quot;FT&quot; is used for users with anonymous numbers. If omitted, then users from any country can participate in the poll." />

<ApiParam name="correct_option_ids" type="Integer[]" description="*Optional*. Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot." />

<ApiParam name="explanation" type="String" description="*Optional*. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters" :minLen="0" :maxLen="200" />

<ApiParam name="explanation_entities" type="MessageEntity[]" description="*Optional*. Special entities like usernames, URLs, bot commands, etc. that appear in the *explanation*" />

<ApiParam name="explanation_media" type="PollMedia" description="*Optional*. Media added to the quiz explanation" />

<ApiParam name="open_period" type="Integer" description="*Optional*. Amount of time in seconds the poll will be active after creation" />

<ApiParam name="close_date" type="Integer" description="*Optional*. Point in time (Unix timestamp) when the poll will be automatically closed" />

<ApiParam name="description" type="String" description="*Optional*. Description of the poll; for polls inside the [Message](https://core.telegram.org/bots/api#message) object only" />

<ApiParam name="description_entities" type="MessageEntity[]" description="*Optional*. Special entities like usernames, URLs, bot commands, etc. that appear in the description" />

<ApiParam name="media" type="PollMedia" description="*Optional*. Media added to the poll description; for polls inside the [Message](https://core.telegram.org/bots/api#message) object only" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
