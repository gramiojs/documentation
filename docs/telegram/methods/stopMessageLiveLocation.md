---
title: stopMessageLiveLocation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Stop a live location message before it expires using GramIO. Works for regular and inline messages. Supports reply_markup update on stop. TypeScript examples included.
  - - meta
    - name: keywords
      content: stopMessageLiveLocation, telegram bot api, stop live location, gramio stopMessageLiveLocation, telegram live location end, stop tracking location telegram, stopMessageLiveLocation typescript, stopMessageLiveLocation example, chat_id, message_id, inline_message_id, reply_markup, how to stop live location telegram bot
---

# stopMessageLiveLocation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#stopmessagelivelocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stop updating a live location message before *live\_period* expires. On success, if the message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message with live location to stop" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." docsLink="/keyboards/overview" />

## Returns

On success, Message | True is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop a live location in a regular chat message
await bot.api.stopMessageLiveLocation({
  chat_id: 123456789,
  message_id: 42,
});
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop and replace the keyboard with a "Location ended" button
await bot.api.stopMessageLiveLocation({
  chat_id: 123456789,
  message_id: 42,
  reply_markup: new InlineKeyboard().text("Location ended", "location_ended"),
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop a live location sent via inline query (no chat_id needed)
await bot.api.stopMessageLiveLocation({
  inline_message_id: "AAABB-xyz...",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Typical pattern: track the message_id when sending, stop it later
const locationMsg = await bot.api.sendLocation({
  chat_id: 123456789,
  latitude: 48.8566,
  longitude: 2.3522,
  live_period: 300, // 5 minutes
});

// ... time passes or user stops sharing ...

await bot.api.stopMessageLiveLocation({
  chat_id: locationMsg.chat.id,
  message_id: locationMsg.message_id,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | The `message_id` doesn't exist in the chat |
| 400 | `Bad Request: message can't be edited` | The message is not a live location, or the live period has already expired — the location stopped automatically |
| 400 | `Bad Request: message is not modified` | The live location is already stopped and `reply_markup` is identical to the current one |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`chat_id` + `message_id` OR `inline_message_id` — not both.** For regular messages use `chat_id` + `message_id`; for messages sent via inline query use `inline_message_id` only.
- **Returns `Message` for regular messages, `true` for inline.** The return value differs based on which identifier pair you use. Narrowing the type in TypeScript requires checking `typeof result === "boolean"`.
- **You can update `reply_markup` on stop.** This is useful for replacing location-specific buttons (like "Stop sharing") with a static button (like "Location ended") in one atomic call.
- **Calling on an already-stopped location returns an error.** If the `live_period` has expired or the location was already stopped, Telegram returns `message can't be edited`. Catch this error gracefully.
- **Store the message ID when sending.** You need the original `message_id` to stop the live location later — save it in your session or database when the location message is first sent.

## See Also

- [sendLocation](/telegram/methods/sendLocation) — send a live location (with `live_period`)
- [editMessageLiveLocation](/telegram/methods/editMessageLiveLocation) — update the location coordinates while it's still live
- [Message](/telegram/types/Message) — returned for non-inline messages
- [InlineKeyboardMarkup](/telegram/types/InlineKeyboardMarkup) — keyboard structure for `reply_markup`
- [Keyboards guide](/keyboards/overview) — building inline keyboards with GramIO
