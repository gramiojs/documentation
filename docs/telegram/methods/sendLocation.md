---
title: sendLocation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send map locations and live locations using GramIO with TypeScript. Complete sendLocation reference with latitude, longitude, live_period, heading, proximity_alert_radius, and editMessageLiveLocation.
  - - meta
    - name: keywords
      content: sendLocation, telegram bot api, send location telegram bot, gramio sendLocation, sendLocation typescript, sendLocation example, telegram live location, latitude longitude, live_period, heading, proximity_alert_radius, editMessageLiveLocation, how to send location telegram bot
---

# sendLocation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendlocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send point on the map. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="latitude" type="Float" required description="Latitude of the location" />

<ApiParam name="longitude" type="Float" required description="Longitude of the location" />

<ApiParam name="horizontal_accuracy" type="Float" description="The radius of uncertainty for the location, measured in meters; 0-1500" />

<ApiParam name="live_period" type="Integer" description="Period in seconds during which the location will be updated (see [Live Locations](https://telegram.org/blog/live-locations), should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely." />

<ApiParam name="heading" type="Integer" description="For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified." />

<ApiParam name="proximity_alert_radius" type="Integer" description="For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" docsLink="/keyboards/overview" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a static location (office address)
bot.command("office", (ctx) =>
    ctx.sendLocation(48.8584, 2.2945)
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply with a location with accuracy radius
bot.command("meethere", (ctx) =>
    ctx.replyWithLocation(37.7749, -122.4194, {
        horizontal_accuracy: 50,
    })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Start a live location that updates for 1 hour
bot.command("track", async (ctx) => {
    const msg = await ctx.sendLocation(55.7558, 37.6173, {
        live_period: 3600, // 1 hour in seconds
        heading: 90,       // facing East
    });
    // Save msg.messageId to update it later via editMessageLiveLocation
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update a live location with new coordinates
await bot.api.editMessageLiveLocation({
    chat_id: 123456789,
    message_id: 42,
    latitude: 55.7600,
    longitude: 37.6200,
    heading: 180,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop a live location early
await bot.api.stopMessageLiveLocation({
    chat_id: 123456789,
    message_id: 42,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — send a static location with proximity alerts enabled
await bot.api.sendLocation({
    chat_id: 123456789,
    latitude: 51.5074,
    longitude: -0.1278,
    live_period: 86400,
    proximity_alert_radius: 500, // alert when within 500 m
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access |
| 400 | `Bad Request: LOCATION_INVALID` | `latitude` or `longitude` is out of valid range (±90 / ±180) |
| 400 | `Bad Request: wrong live_period` | `live_period` is not between 60 and 86400 (or the special `0x7FFFFFFF`) |
| 400 | `Bad Request: wrong heading` | `heading` is outside the 1–360 degree range |
| 400 | `Bad Request: wrong proximity_alert_radius` | `proximity_alert_radius` is outside the 1–100000 meter range |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`heading` and `proximity_alert_radius` only apply to live locations.** If you set them without `live_period`, they are ignored silently. Only include them when `live_period` is set.
- **`live_period` of `0x7FFFFFFF` (2147483647) creates an indefinitely-updatable live location.** It won't expire automatically — you must call `stopMessageLiveLocation` to end it.
- **Save the returned `message_id` to update live locations.** You'll need both `chat_id` and `message_id` when calling `editMessageLiveLocation` or `stopMessageLiveLocation`.
- **`ctx.sendLocation(lat, lon, params?)` — note the argument order.** Latitude comes first, longitude second. This matches GramIO's method signature and differs from how some map libraries order coordinates.
- **`horizontal_accuracy` range is 0–1500 meters.** Values outside this range cause a `400` error. Use `0` or omit the field if you don't have an accuracy value.
- **Venue vs. Location.** If you're sharing a named place (business, landmark), prefer [`sendVenue`](/telegram/methods/sendVenue) — it shows a name and address alongside the map pin.

## See Also

- [editMessageLiveLocation](/telegram/methods/editMessageLiveLocation) — update coordinates of a live location
- [stopMessageLiveLocation](/telegram/methods/stopMessageLiveLocation) — stop a live location before it expires
- [sendVenue](/telegram/methods/sendVenue) — send a named location (address + title)
- [Location](/telegram/types/Location) — the Location type object
- [Keyboards overview](/keyboards/overview) — how to add inline keyboards to location messages
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` handling
