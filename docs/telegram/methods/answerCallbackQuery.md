---
title: answerCallbackQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Answer inline keyboard callback queries using GramIO and TypeScript. Show notifications, alerts, or open game URLs. Complete parameter reference and error handling.
  - - meta
    - name: keywords
      content: answerCallbackQuery, telegram bot api, answer callback query telegram bot, gramio answerCallbackQuery, answerCallbackQuery typescript, answerCallbackQuery example, callback_query_id, show_alert, inline keyboard callback, how to answer callback telegram bot, telegram callback query timeout
---

# answerCallbackQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answercallbackquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send answers to callback queries sent from [inline keyboards](https://core.telegram.org/bots/features#inline-keyboards). The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, *True* is returned.

## Parameters

<ApiParam name="callback_query_id" type="String" required description="Unique identifier for the query to be answered" />

<ApiParam name="text" type="String" description="Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters" :minLen="0" :maxLen="200" />

<ApiParam name="show_alert" type="Boolean" description="If *True*, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to *false*." />

<ApiParam name="url" type="String" description="URL that will be opened by the user's client. If you have created a [Game](https://core.telegram.org/bots/api#game) and accepted the conditions via [@BotFather](https://t.me/botfather), specify the URL that opens your game - note that this will only work if the query comes from a [callback_game](https://core.telegram.org/bots/api#inlinekeyboardbutton) button.      Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter." />

<ApiParam name="cache_time" type="Integer" description="The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0." :defaultValue="0" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Context shorthand — inside a callback_query handler
bot.callbackQuery("my_button", async (ctx) => {
  // Show a brief notification at the top of the screen
  await ctx.answerCallbackQuery({ text: "Button clicked!" });
});

// Show a blocking alert dialog instead
bot.callbackQuery("confirm_action", async (ctx) => {
  await ctx.answerCallbackQuery({
    text: "Are you sure? This cannot be undone.",
    show_alert: true,
  });
});

// Silent acknowledgment (no visible notification)
bot.callbackQuery("silent_action", async (ctx) => {
  // Process action...
  await ctx.answerCallbackQuery();
});

// Open a game URL from a callback_game button
bot.callbackQuery("play_game", async (ctx) => {
  await ctx.answerCallbackQuery({
    url: "https://your-game-url.example.com",
  });
});

// Direct API call (outside of handler context)
await bot.api.answerCallbackQuery({
  callback_query_id: "unique_callback_query_id",
  text: "Action completed!",
  show_alert: false,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: query is too old and response timeout expired or query id is invalid` | The callback query was not answered within 10 seconds — always answer immediately before doing heavy work |
| 400 | `Bad Request: TEXT_TOO_LONG` | `text` exceeds 200 characters — truncate the notification message |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive in your database |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Answer within 10 seconds.** Telegram expires callback queries after 10 seconds. If you need to do async work (DB queries, API calls), call `answerCallbackQuery` immediately with a loading message, then edit the original message when done.
- **Always call this method, even silently.** If you don't answer a callback query, the user sees a loading spinner indefinitely. Calling `answerCallbackQuery()` with no arguments dismisses it cleanly.
- **`show_alert: true` is intrusive — use sparingly.** It creates a blocking dialog the user must dismiss. Use it only for confirmations or critical information.
- **`text` max is 200 characters**, not 4096. Notifications must be concise. For longer content, edit the original message instead.
- **`url` only works for game buttons.** Using a `url` for a non-game callback query has no effect in most Telegram clients.
- **`cache_time` tells clients how long to reuse the answer** for identical button presses. Set it to a positive value for buttons whose action is always the same (e.g., "Show help"), to reduce API calls.
- **Build inline keyboards with GramIO's keyboard helpers.** The [Keyboards guide](/keyboards/overview) covers `InlineKeyboard` builder with type-safe callback data — the source of `callback_query_id` your handler receives.

## See Also

- [`CallbackQuery`](/telegram/types/CallbackQuery) — The update object your handler receives
- [`InlineKeyboardMarkup`](/telegram/types/InlineKeyboardMarkup) — Create inline keyboards with callback buttons
- [`editMessageText`](/telegram/methods/editMessageText) — Update the message after answering the query
- [`editMessageReplyMarkup`](/telegram/methods/editMessageReplyMarkup) — Update keyboard buttons after a button press
- [Keyboards overview](/keyboards/overview) — GramIO guide to building inline keyboards with type-safe callback data
