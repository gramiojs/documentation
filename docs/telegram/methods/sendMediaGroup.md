---
title: sendMediaGroup — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send albums of photos, videos, documents, or audio using GramIO with TypeScript. Complete sendMediaGroup reference with MediaInput examples, album composition, and error handling.
  - - meta
    - name: keywords
      content: sendMediaGroup, telegram bot api, send album telegram bot, telegram photo album, telegram media group, gramio sendMediaGroup, sendMediaGroup typescript, sendMediaGroup example, InputMedia, InputMediaPhoto, InputMediaVideo, album telegram, chat_id, how to send album telegram bot, media group telegram bot
---

# sendMediaGroup

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message[]</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendmediagroup" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of [Message](https://core.telegram.org/bots/api#message) objects that were sent is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat" />

<ApiParam name="media" type="InputMediaAudio[]" required description="A JSON-serialized array describing messages to be sent, must include 2-10 items" />

<ApiParam name="disable_notification" type="Boolean" description="Sends messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent messages from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

## Returns

On success, an array of [Message](/telegram/types/Message) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaInput } from "gramio";

const bot = new Bot("");
// ---cut---
// Send 3 photos as an album
bot.command("album", (ctx) =>
  ctx.sendMediaGroup([
    MediaInput.photo("file_id_1", { caption: "First photo" }),
    MediaInput.photo("file_id_2"),
    MediaInput.photo("file_id_3"),
  ])
);
```

```ts twoslash
import { Bot, MediaInput, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload local files and send as a mixed photo+video album
bot.command("upload", async (ctx) => {
  const messages = await ctx.sendMediaGroup([
    MediaInput.photo(await MediaUpload.path("./photo1.jpg"), { caption: "Photo 1" }),
    MediaInput.photo(await MediaUpload.path("./photo2.jpg")),
    MediaInput.video(await MediaUpload.path("./clip.mp4")),
  ]);
  console.log(`Sent ${messages.length} messages`);
});
```

```ts twoslash
import { Bot, MediaInput } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply with a media group (sets reply_parameters automatically)
bot.on("message", (ctx) =>
  ctx.replyWithMediaGroup([
    MediaInput.photo("file_id_1"),
    MediaInput.photo("file_id_2"),
  ])
);
```

```ts twoslash
import { Bot, MediaInput } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — send a document album
await bot.api.sendMediaGroup({
  chat_id: 123456789,
  media: [
    MediaInput.document("doc_file_id_1", { caption: "Report Q1" }),
    MediaInput.document("doc_file_id_2"),
  ],
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to that chat |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | A `file_id` in the `media` array is malformed or the URL is inaccessible |
| 400 | `Bad Request: MEDIA_EMPTY` | `media` array has fewer than 2 items — albums require at least 2 |
| 400 | `Bad Request: MEDIA_GROUP_INVALID` | Mixed incompatible types — documents/audio can only be grouped with the same type |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot not in the target channel — add the bot as a member first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **2–10 items required.** Albums must contain between 2 and 10 media items. Sending 1 item will error; more than 10 is not allowed.
- **Mixed types are restricted.** Photos and videos can be freely mixed. Documents can only be grouped with other documents; audio can only be grouped with other audio — cross-type mixing will error.
- **No group-level `reply_markup`.** Unlike `sendPhoto` or `sendMessage`, `sendMediaGroup` does not accept a `reply_markup` parameter. Attach a keyboard via a separate `sendMessage` call if needed.
- **Returns one `MessageContext` per item.** The method returns `Promise<MessageContext[]>` — one element per media item sent. Use the array to access each message's `file_id` for caching.
- **Use `MediaInput.*()` helpers.** Always use `MediaInput.photo()`, `MediaInput.video()`, etc. to build `InputMedia` objects — they set the `type` field automatically and accept optional `caption`, `parse_mode` / `entities` per item.
- **Cache `file_id` after first upload.** Save `file_id` values from the returned messages to avoid re-uploading on subsequent sends. The [media-cache plugin](/plugins/official/media-cache) can automate this.

## See Also

- [sendPhoto](/telegram/methods/sendPhoto) — Send a single photo
- [sendVideo](/telegram/methods/sendVideo) — Send a single video
- [sendDocument](/telegram/methods/sendDocument) — Send a single document
- [sendPaidMedia](/telegram/methods/sendPaidMedia) — Send a paid photo/video album requiring Stars
- [InputMediaPhoto](/telegram/types/InputMediaPhoto) — The InputMedia type for photos
- [InputMediaVideo](/telegram/types/InputMediaVideo) — The InputMedia type for videos
- [Files & MediaUpload](/files/media-upload) — How to upload files in GramIO
- [auto-retry plugin](/plugins/official/auto-retry) — Handle rate limits automatically
- [media-cache plugin](/plugins/official/media-cache) — Cache `file_id` values automatically
