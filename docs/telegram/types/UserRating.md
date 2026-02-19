---
title: UserRating — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: UserRating Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: UserRating, telegram bot api types, gramio UserRating, UserRating object, UserRating typescript
---

# UserRating

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#userrating" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object describes the rating of a user based on their Telegram Star spendings.

## Fields

<ApiParam name="level" type="Integer" required description="Current level of the user, indicating their reliability when purchasing digital goods and services. A higher level suggests a more trustworthy customer; a negative level is likely reason for concern." />

<ApiParam name="rating" type="Integer" required description="Numerical value of the user's rating; the higher the rating, the better" />

<ApiParam name="current_level_rating" type="Integer" required description="The rating value required to get the current level" />

<ApiParam name="next_level_rating" type="Integer" description="_Optional_. The rating value required to get to the next level; omitted if the maximum level was reached" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
