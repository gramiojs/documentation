---
title: setGameScore — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set a user's score in a Telegram game message using GramIO. TypeScript examples with force flag, inline message support, scoreboard editing, and error handling.
  - - meta
    - name: keywords
      content: setGameScore, telegram bot api, telegram bot game score, gramio setGameScore, setGameScore typescript, setGameScore example, telegram game high score, force decrease score, disable_edit_message, inline_message_id, user_id, how to set game score telegram bot, getGameHighScores
---

# setGameScore

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a> | True</span>
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

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a score in a regular game message (returns the updated Message)
const updatedMessage = await bot.api.setGameScore({
  user_id: 123456789,
  score: 1500,
  chat_id: -1001234567890,
  message_id: 42,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Allow the score to decrease (e.g. fixing a bug or banning a cheater)
await bot.api.setGameScore({
  user_id: 123456789,
  score: 100,
  chat_id: -1001234567890,
  message_id: 42,
  force: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set score for an inline game message (returns True)
await bot.api.setGameScore({
  user_id: 123456789,
  score: 2000,
  inline_message_id: "AAAAAA...",
  disable_edit_message: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update score without auto-editing the game message UI
await bot.api.setGameScore({
  user_id: 123456789,
  score: 750,
  chat_id: -1001234567890,
  message_id: 42,
  disable_edit_message: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: BOT_SCORE_NOT_MODIFIED` | New score is not greater than current score and `force` is `false` — pass `force: true` to allow decreasing |
| 400 | `Bad Request: message not found` | `message_id` or `inline_message_id` does not exist or was deleted |
| 400 | `Bad Request: chat not found` | Invalid `chat_id` or bot was removed from the chat |
| 400 | `Bad Request: score must be non-negative` | Negative value passed as `score` — scores must be ≥ 0 |
| 400 | `Bad Request: message is not a game message` | Target message does not contain a game — use a message sent via [`sendGame`](/telegram/methods/sendGame) |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and skip score updates for this user |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Returns different types depending on message context.** For regular (non-inline) game messages, the updated `Message` is returned so you can inspect it. For inline game messages, `True` is returned.
- **`force: true` allows score decreases.** By default Telegram rejects a score update that would lower the user's current score — this protects leaderboard integrity. Set `force: true` when correcting errors or removing cheaters.
- **`disable_edit_message: true` separates score tracking from UI updates.** Use this when you want to record a score server-side without immediately updating the scoreboard displayed in the chat. You can always call [`getGameHighScores`](/telegram/methods/getGameHighScores) to retrieve scores later.
- **Either `{chat_id, message_id}` or `inline_message_id` is required**, not both. Mixing the two will cause an error.
- **Scores must be non-negative integers.** Telegram does not support floating-point or negative scores.
- **Game messages are created by [`sendGame`](/telegram/methods/sendGame).** You cannot call `setGameScore` on arbitrary messages — the target must be a game message.

## See Also

- [`getGameHighScores`](/telegram/methods/getGameHighScores) — retrieve the leaderboard for a game
- [`sendGame`](/telegram/methods/sendGame) — send a game message that `setGameScore` can update
- [`Game`](/telegram/types/Game) — game object type
- [`GameHighScore`](/telegram/types/GameHighScore) — high score entry returned by `getGameHighScores`
- [`Message`](/telegram/types/Message) — return type for non-inline game messages
