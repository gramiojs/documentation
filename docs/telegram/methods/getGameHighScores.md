---
title: getGameHighScores — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getGameHighScores Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getGameHighScores, telegram bot api, gramio getGameHighScores, getGameHighScores typescript, getGameHighScores example
---

# getGameHighScores

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/GameHighScore">GameHighScore[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getgamehighscores" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of [GameHighScore](https://core.telegram.org/bots/api#gamehighscore) objects.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Target user id" />

<ApiParam name="chat_id" type="Integer" required description="Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat" />

<ApiParam name="message_id" type="Integer" required description="Required if _inline\_message\_id_ is not specified. Identifier of the sent message" />

<ApiParam name="inline_message_id" type="String" required description="Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message" />

## Returns

On success, an array of [GameHighScore](/telegram/types/GameHighScore) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
