---
title: ChosenInlineResult — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChosenInlineResult Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChosenInlineResult, telegram bot api types, gramio ChosenInlineResult, ChosenInlineResult object, ChosenInlineResult typescript
---

# ChosenInlineResult

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#choseninlineresult" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a [result](https://core.telegram.org/bots/api#inlinequeryresult) of an inline query that was chosen by the user and sent to their chat partner.

## Fields

<ApiParam name="result_id" type="String" required description="The unique identifier for the result that was chosen" />

<ApiParam name="from" type="User" required description="The user that chose the result" />

<ApiParam name="location" type="Location" description="*Optional*. Sender location, only for bots that require user location" />

<ApiParam name="inline_message_id" type="String" description="*Optional*. Identifier of the sent inline message. Available only if there is an [inline keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup) attached to the message. Will be also received in [callback queries](https://core.telegram.org/bots/api#callbackquery) and can be used to [edit](https://core.telegram.org/bots/api#updating-messages) the message." />

<ApiParam name="query" type="String" required description="The query that was used to obtain the result" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
