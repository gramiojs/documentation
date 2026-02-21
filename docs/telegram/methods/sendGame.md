---
title: sendGame — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send Telegram HTML5 games using GramIO with TypeScript. Complete sendGame reference with game_short_name, inline keyboard, setGameScore, and getGameHighScores integration examples.
  - - meta
    - name: keywords
      content: sendGame, telegram bot api, send game telegram bot, gramio sendGame, sendGame typescript, sendGame example, telegram html5 game, game_short_name, BotFather game, setGameScore, getGameHighScores, telegram bot game
---

# sendGame

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendgame" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send a game. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target chat. Games can't be sent to channel direct messages chats and channel chats." />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="game_short_name" type="String" required description="Short name of the game, serves as the unique identifier for the game. Set up your games via [@BotFather](https://t.me/botfather)." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Play game\_title' button will be shown. If not empty, the first button must launch the game." docsLink="/keyboards/overview" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a game to the current chat
bot.command("play", (ctx) =>
    bot.api.sendGame({
        chat_id: ctx.chat.id,
        game_short_name: "mygame",
    })
);
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a game with a custom inline keyboard
// The first button MUST launch the game (use callback_game)
bot.command("play", async (ctx) => {
    const keyboard = new InlineKeyboard()
        .game("🎮 Play now")
        .row()
        .url("Leaderboard", "https://example.com/leaderboard");

    return bot.api.sendGame({
        chat_id: ctx.chat.id,
        game_short_name: "mygame",
        reply_markup: keyboard,
    });
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update a user's score after they finish the game
// (called from a callback_query with game_short_name set)
bot.on("callback_query", async (ctx) => {
    if (!ctx.payload.game_short_name) return;

    await bot.api.setGameScore({
        user_id: ctx.from.id,
        score: 9999,
        inline_message_id: ctx.payload.inline_message_id,
        // or: chat_id + message_id for regular messages
    });

    return ctx.answerCallbackQuery({ url: "https://your-game.example.com" });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access |
| 400 | `Bad Request: GAME_SHORT_NAME_INVALID` | `game_short_name` doesn't match any game registered with [@BotFather](https://t.me/botfather) for this bot |
| 400 | `Bad Request: Games can't be sent to channel chats` | `chat_id` points to a channel — games only work in private chats and groups |
| 400 | `Bad Request: first button in reply_markup must be of type callback_game` | When providing `reply_markup`, the first button must be a game-launch button |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Games cannot be sent to channels.** The `chat_id` must be a private chat or a group/supergroup. Sending to a channel will result in a `400` error.
- **Register your game with [@BotFather](https://t.me/botfather) first.** The `game_short_name` must exactly match the short name you configured. Typos cause `GAME_SHORT_NAME_INVALID`.
- **The first inline keyboard button must be a game-launch button.** If you supply `reply_markup`, the very first button must use `callback_game` type (e.g. `InlineKeyboard.game(text)`). Any other button type in the first position is rejected.
- **Use `setGameScore` to record results.** After a player finishes, call [`setGameScore`](/telegram/methods/setGameScore) to update their score on the leaderboard. This is required to make the game's score visible in the Telegram interface.
- **Game URL comes from the `callback_query`.** When the player presses the Play button, Telegram sends a `callback_query` with `game_short_name` set. Respond with `answerCallbackQuery({ url: "..." })` pointing to your game URL.

## See Also

- [setGameScore](/telegram/methods/setGameScore) — record a player's score after gameplay
- [getGameHighScores](/telegram/methods/getGameHighScores) — retrieve the leaderboard
- [Game](/telegram/types/Game) — the Game type object
- [Keyboards overview](/keyboards/overview) — how to build inline keyboards with `InlineKeyboard`
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` handling
