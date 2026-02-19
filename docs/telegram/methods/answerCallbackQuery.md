---
title: answerCallbackQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: answerCallbackQuery Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: answerCallbackQuery, telegram bot api, gramio answerCallbackQuery, answerCallbackQuery typescript, answerCallbackQuery example
---

# answerCallbackQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answercallbackquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send answers to callback queries sent from [inline keyboards](https://core.telegram.org/bots/features#inline-keyboards). The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.

## Parameters

<ApiParam name="callback_query_id" type="String" required description="Unique identifier for the query to be answered" />

<ApiParam name="text" type="String" required description="Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters" />

<ApiParam name="show_alert" type="Boolean" required description="If _True_, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to _false_." />

<ApiParam name="url" type="String" required description="URL that will be opened by the user's client. If you have created a [Game](https://core.telegram.org/bots/api#game) and accepted the conditions via [@BotFather](https://t.me/botfather), specify the URL that opens your game - note that this will only work if the query comes from a [_callback\_game_](https://core.telegram.org/bots/api#inlinekeyboardbutton) button.      Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter." />

<ApiParam name="cache_time" type="Integer" required description="The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0." :max="3" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
