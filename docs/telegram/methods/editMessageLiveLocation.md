---
title: editMessageLiveLocation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Update live location coordinates in Telegram messages using GramIO with TypeScript. Complete editMessageLiveLocation reference with heading, accuracy, proximity alerts, and live_period management.
  - - meta
    - name: keywords
      content: editMessageLiveLocation, telegram bot api, update live location telegram, gramio editMessageLiveLocation, editMessageLiveLocation typescript, editMessageLiveLocation example, edit location telegram bot, latitude longitude update, heading, horizontal_accuracy, live_period, proximity_alert_radius, ctx.editLiveLocation, stopMessageLiveLocation, real-time location tracking
---

# editMessageLiveLocation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagelivelocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit live location messages. A location can be edited until its *live\_period* expires or editing is explicitly disabled by a call to [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation). On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="latitude" type="Float" required description="Latitude of new location" />

<ApiParam name="longitude" type="Float" required description="Longitude of new location" />

<ApiParam name="live_period" type="Integer" description="New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current *live\_period* by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then *live\_period* remains unchanged" />

<ApiParam name="horizontal_accuracy" type="Float" description="The radius of uncertainty for the location, measured in meters; 0-1500" />

<ApiParam name="heading" type="Integer" description="Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified." />

<ApiParam name="proximity_alert_radius" type="Integer" description="The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified." />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

## Returns

On success, Message | True is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update live location coordinates via direct API call
await bot.api.editMessageLiveLocation({
    chat_id: 123456789,
    message_id: 42,
    latitude: 51.509865,
    longitude: -0.118092,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update with full precision metadata — heading and accuracy
await bot.api.editMessageLiveLocation({
    chat_id: 123456789,
    message_id: 42,
    latitude: 40.712776,
    longitude: -74.005974,
    heading: 90,                  // Moving east
    horizontal_accuracy: 25,      // ±25 meters
    proximity_alert_radius: 500,  // Alert when within 500m
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop live location sharing early
await bot.api.stopMessageLiveLocation({
    chat_id: 123456789,
    message_id: 42,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Use ctx shorthand — context fills in chat_id and message_id automatically
bot.on("callback_query", async (ctx) => {
    await ctx.editLiveLocation({
        latitude: 48.858844,
        longitude: 2.294351,
    });
    await ctx.answer("Location updated!");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: message is not modified` | Coordinates and metadata are identical to the current location |
| 400 | `Bad Request: message can't be edited` | Live location `live_period` has expired — start a new `sendLocation` with a fresh `live_period` |
| 400 | `Bad Request: LOCATION_INVALID` | Coordinates out of valid range (`latitude` must be –90 to 90, `longitude` –180 to 180) |
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the chat |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — stop sending location updates |
| 429 | `Too Many Requests: retry after N` | Flood control — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **No 48-hour business message restriction** — unlike other `editMessage*` methods, live location has no special business-message time limit. Instead, it is governed solely by the message's own `live_period`.
- **`live_period` can be extended but not by more than 86400 seconds (one day) per call.** The resulting expiration date must also remain within the next 90 days. To create a permanent live location, pass `0x7FFFFFFF` (2147483647) as `live_period`.
- **`heading` must be 1–360, not 0.** A value of 0 is invalid and will be rejected. Omit the field entirely if direction is unknown.
- **`horizontal_accuracy` is 0–1500 metres.** This is the GPS uncertainty radius — pass `0` to omit it rather than omitting the field.
- **Stop the location sharing early with `stopMessageLiveLocation`** — if the user's journey ends before `live_period` expires, call `stopMessageLiveLocation` to remove the live indicator from the message immediately.
- **Inline messages return `true`, not `Message`.** When editing via `inline_message_id`, the method returns `true` on success instead of the updated `Message` object.

## See Also

- [stopMessageLiveLocation](/telegram/methods/stopMessageLiveLocation) — explicitly end live location sharing
- [sendLocation](/telegram/methods/sendLocation) — send a new location (static or live) to start sharing
- [editMessageReplyMarkup](/telegram/methods/editMessageReplyMarkup) — update only the keyboard without changing coordinates
- [Keyboards overview](/keyboards/overview) — building inline keyboards with `InlineKeyboard`
- [Message](/telegram/types/Message) — the type returned on success for non-inline messages
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
