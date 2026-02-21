---
title: setGameScore — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setGameScore Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setGameScore, telegram bot api, gramio setGameScore, setGameScore typescript, setGameScore example
---

# setGameScore

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setgamescore" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned. Returns an error, if the new score is not greater than the user's current score in the chat and *force* is *False*.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier" />

<ApiParam name="score" type="Integer" required description="New score, must be non-negative" />

<ApiParam name="force" type="Boolean" description="Pass *True* if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters" />

<ApiParam name="disable_edit_message" type="Boolean" description="Pass *True* if the game message should not be automatically edited to include the current scoreboard" />

<ApiParam name="chat_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the sent message" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

## Returns

On success, Message | True is returned.

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
