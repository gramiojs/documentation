---
title: Giveaway — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Giveaway Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Giveaway, telegram bot api types, gramio Giveaway, Giveaway object, Giveaway typescript
---

# Giveaway

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#giveaway" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a message about a scheduled giveaway.

## Fields

<ApiParam name="chats" type="Chat[]" required description="The list of chats which the user must join to participate in the giveaway" />

<ApiParam name="winners_selection_date" type="Integer" required description="Point in time (Unix timestamp) when winners of the giveaway will be selected" />

<ApiParam name="winner_count" type="Integer" required description="The number of users which are supposed to be selected as winners of the giveaway" />

<ApiParam name="only_new_members" type="Boolean" description="_Optional_. _True_, if only users who join the chats after the giveaway started should be eligible to win" />

<ApiParam name="has_public_winners" type="Boolean" description="_Optional_. _True_, if the list of giveaway winners will be visible to everyone" />

<ApiParam name="prize_description" type="String" description="_Optional_. Description of additional giveaway prize" />

<ApiParam name="country_codes" type="String[]" description="_Optional_. A list of two-letter [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways." />

<ApiParam name="prize_star_count" type="Integer" description="_Optional_. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only" />

<ApiParam name="premium_subscription_month_count" type="Integer" description="_Optional_. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
