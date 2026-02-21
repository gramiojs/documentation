---
title: ChatBoostSourceGiveaway — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatBoostSourceGiveaway Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatBoostSourceGiveaway, telegram bot api types, gramio ChatBoostSourceGiveaway, ChatBoostSourceGiveaway object, ChatBoostSourceGiveaway typescript
---

# ChatBoostSourceGiveaway

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatboostsourcegiveaway" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The boost was obtained by the creation of a Telegram Premium or a Telegram Star giveaway. This boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription for Telegram Premium giveaways and *prize\_star\_count* / 500 times for one year for Telegram Star giveaways.

## Fields

<ApiParam name="source" type="String" required description="Source of the boost, always &quot;giveaway&quot;" constValue="giveaway" />

<ApiParam name="giveaway_message_id" type="Integer" required description="Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn't sent yet." />

<ApiParam name="user" type="User" description="*Optional*. User that won the prize in the giveaway if any; for Telegram Premium giveaways only" />

<ApiParam name="prize_star_count" type="Integer" description="*Optional*. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only" />

<ApiParam name="is_unclaimed" type="True" description="*Optional*. *True*, if the giveaway was completed, but there was no user to win the prize" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
