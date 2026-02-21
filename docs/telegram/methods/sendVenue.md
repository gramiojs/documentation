---
title: sendVenue — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send venue location cards with GramIO in TypeScript. Complete sendVenue reference covering Foursquare, Google Places integration, coordinates, and error handling.
  - - meta
    - name: keywords
      content: sendVenue, telegram bot api, gramio sendVenue, sendVenue typescript, sendVenue example, telegram venue bot, send venue telegram, foursquare venue, google places venue, latitude longitude, venue title address, foursquare_id, foursquare_type, google_place_id, google_place_type, location bot, place bot
---

# sendVenue

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendvenue" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send information about a venue. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="latitude" type="Float" required description="Latitude of the venue" />

<ApiParam name="longitude" type="Float" required description="Longitude of the venue" />

<ApiParam name="title" type="String" required description="Name of the venue" />

<ApiParam name="address" type="String" required description="Address of the venue" />

<ApiParam name="foursquare_id" type="String" description="Foursquare identifier of the venue" />

<ApiParam name="foursquare_type" type="String" description="Foursquare type of the venue, if known. (For example, &quot;arts\_entertainment/default&quot;, &quot;arts\_entertainment/aquarium&quot; or &quot;food/icecream&quot;.)" />

<ApiParam name="google_place_id" type="String" description="Google Places identifier of the venue" />

<ApiParam name="google_place_type" type="String" description="Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).)" />

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
// Send a minimal venue with just coordinates, name, and address
bot.command("office", (ctx) =>
  ctx.sendVenue({
    latitude: 37.7749,
    longitude: -122.4194,
    title: "GramIO HQ",
    address: "San Francisco, CA",
  })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Venue enriched with Foursquare metadata for a richer card
bot.command("cafe", (ctx) =>
  ctx.sendVenue({
    latitude: 48.8566,
    longitude: 2.3522,
    title: "Café de Flore",
    address: "172 Bd Saint-Germain, 75006 Paris",
    foursquare_id: "4adcda04f964a5208f3521e3",
    foursquare_type: "food/coffeeshop",
  })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Venue with Google Places ID for Maps integration
bot.command("museum", (ctx) =>
  ctx.sendVenue({
    latitude: 51.5074,
    longitude: -0.1278,
    title: "The British Museum",
    address: "Great Russell St, London WC1B 3DG",
    google_place_id: "ChIJB9OTMDIbdkgRp0JWbW3M4kM",
    google_place_type: "museum",
  })
);
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply to a message with a venue and navigation button
bot.command("meetup", (ctx) =>
  ctx.replyWithVenue({
    latitude: 40.7128,
    longitude: -74.006,
    title: "Team Meetup Spot",
    address: "New York, NY 10007",
    reply_markup: new InlineKeyboard().url(
      "Open in Maps",
      "https://maps.google.com/?q=40.7128,-74.006"
    ),
  })
);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat exists and the bot is a member |
| 400 | `Bad Request: VENUE_ADDRESS_INVALID` | The `address` field is empty or invalid |
| 400 | `Bad Request: VENUE_TITLE_INVALID` | The `title` field is empty or too long |
| 400 | `Bad Request: Bad latitude/longitude` | Coordinates are outside valid ranges (latitude −90 to 90, longitude −180 to 180) |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_send_messages` permission in the group/channel |
| 429 | `Too Many Requests: retry after N` | Flood control triggered — use the auto-retry plugin to handle this automatically |

::: tip Auto-retry for 429 errors
Install the [@gramio/auto-retry](/plugins/official/auto-retry) plugin to transparently handle flood-wait errors without manual retry logic.
:::

## Tips & Gotchas

- **Venue vs. Location.** `sendVenue` shows a named card with title and address in Telegram — use it when you have a meaningful place name. Use `sendLocation` when you only have coordinates.
- **Foursquare and Google Places IDs are independent.** You can provide either, both, or neither. When both are present Telegram prefers Google Places for the enriched card.
- **Coordinates must be valid floats.** Latitude must be in the range −90 to 90 and longitude in −180 to 180. Out-of-range values result in a 400 error.
- **No live-location updates.** `sendVenue` sends a static pin. If you need a location that updates in real time, use `sendLocation` with `live_period`.
- **The address is mandatory.** Even if you supply a Foursquare or Google Place ID, the `address` field cannot be empty.
- **Venue messages cannot be edited to change coordinates.** Once sent, the latitude/longitude of a venue message is fixed. Send a new message if the location changes.

## See Also

- [sendLocation](/telegram/methods/sendLocation) — Send a live or static map pin without a place name
- [sendContact](/telegram/methods/sendContact) — Send a contact card with phone number
- [Venue](/telegram/types/Venue) — The Venue type embedded in Message
- [Location](/telegram/types/Location) — The Location type (coordinates only)
- [Keyboards overview](/keyboards/overview) — Add reply markup to venue messages
- [sendMessage](/telegram/methods/sendMessage) — Send a plain text message
