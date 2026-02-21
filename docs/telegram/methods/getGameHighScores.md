---
title: getGameHighScores — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve Telegram game high score tables using GramIO. TypeScript examples for getGameHighScores with chat messages and inline game messages, leaderboard display.
  - - meta
    - name: keywords
      content: getGameHighScores, telegram bot api, gramio getGameHighScores, telegram game leaderboard, telegram bot game high scores, getGameHighScores typescript, GameHighScore, user_id, chat_id, message_id, inline_message_id, telegram game bot, setGameScore
---

# getGameHighScores

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/GameHighScore">GameHighScore[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getgamehighscores" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of [GameHighScore](https://core.telegram.org/bots/api#gamehighscore) objects.

> This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Target user id" />

<ApiParam name="chat_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the sent message" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

## Returns

On success, an array of [GameHighScore](/telegram/types/GameHighScore) objects is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get high scores for a game sent in a regular chat
const scores = await bot.api.getGameHighScores({
  user_id: 123456789,
  chat_id: -1001234567890,
  message_id: 42,
});

for (const entry of scores) {
  console.log(`#${entry.position}: ${entry.user.first_name} — ${entry.score}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get high scores for an inline game message
const scores = await bot.api.getGameHighScores({
  user_id: 123456789,
  inline_message_id: "AbCdEfGhIjKl...",
});

const top3 = scores.slice(0, 3);
const leaderboard = top3
  .map((e) => `${e.position}. ${e.user.first_name}: ${e.score}`)
  .join("\n");
console.log(leaderboard);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Respond to a callback_query from a game and show the leaderboard
bot.on("callback_query", async (ctx) => {
  if (ctx.payload.game_short_name === undefined) return;

  const chatId = ctx.payload.message?.chat.id;
  const messageId = ctx.payload.message?.message_id;
  if (!chatId || !messageId || !ctx.payload.from) return;

  const scores = await bot.api.getGameHighScores({
    user_id: ctx.payload.from.id,
    chat_id: chatId,
    message_id: messageId,
  });

  const text = scores
    .map((e) => `#${e.position} ${e.user.first_name}: ${e.score}`)
    .join("\n");

  await ctx.answer({ text });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the specified chat |
| 400 | `Bad Request: USER_ID_INVALID` | `user_id` is invalid or the user hasn't interacted with the game |
| 400 | `Bad Request: message is not a game` | The referenced message was not a game message — check `message_id` |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot must be in the chat to query game scores |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **`chat_id`+`message_id` and `inline_message_id` are mutually exclusive.** Use one pair or the other — mixing them will cause an error. Regular game messages use `chat_id`+`message_id`; inline games use `inline_message_id`.
- **Returns the target user plus neighbors.** The response includes the specified user's rank and a few players ranked above and below them — not a full global leaderboard. The position field in each entry reflects the global rank.
- **`user_id` must have played the game.** If the user has never submitted a score via `setGameScore`, the request may return an empty array or error.
- **Scores are per-game, per-chat.** Each game message tracks its own leaderboard. Two different messages with the same game have independent high score tables.
- **`setGameScore` must use `force: true` to allow score reduction.** High scores only go up by default — use `force: true` when you need to override (e.g., to correct a cheated score).

## See Also

- [GameHighScore](/telegram/types/GameHighScore) — return type element
- [Game](/telegram/types/Game) — the game object
- [sendGame](/telegram/methods/sendGame) — send a game message to start collecting scores
- [setGameScore](/telegram/methods/setGameScore) — update a user's score before reading the leaderboard
