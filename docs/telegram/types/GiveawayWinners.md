---
title: GiveawayWinners — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: GiveawayWinners Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: GiveawayWinners, telegram bot api types, gramio GiveawayWinners, GiveawayWinners object, GiveawayWinners typescript
---

# GiveawayWinners

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#giveawaywinners" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a message about the completion of a giveaway with public winners.

## Fields

<ApiParam name="chat" type="Chat" required description="The chat that created the giveaway" />

<ApiParam name="giveaway_message_id" type="Integer" required description="Identifier of the message with the giveaway in the chat" />

<ApiParam name="winners_selection_date" type="Integer" required description="Point in time (Unix timestamp) when winners of the giveaway were selected" />

<ApiParam name="winner_count" type="Integer" required description="Total number of winners in the giveaway" />

<ApiParam name="winners" type="User[]" required description="List of up to 100 winners of the giveaway" />

<ApiParam name="additional_chat_count" type="Integer" description="_Optional_. The number of other chats the user had to join in order to be eligible for the giveaway" />

<ApiParam name="prize_star_count" type="Integer" description="_Optional_. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only" />

<ApiParam name="premium_subscription_month_count" type="Integer" description="_Optional_. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only" />

<ApiParam name="unclaimed_prize_count" type="Integer" description="_Optional_. Number of undistributed prizes" />

<ApiParam name="only_new_members" type="Boolean" description="_Optional_. _True_, if only users who had joined the chats after the giveaway started were eligible to win" />

<ApiParam name="was_refunded" type="Boolean" description="_Optional_. _True_, if the giveaway was canceled because the payment for it was refunded" />

<ApiParam name="prize_description" type="String" description="_Optional_. Description of additional giveaway prize" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
