---
title: sendPhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send photos using GramIO with TypeScript. Complete sendPhoto reference with file_id caching, caption formatting, spoiler blur, has_spoiler, reply_markup, and error handling.
  - - meta
    - name: keywords
      content: sendPhoto, telegram bot api, send photo telegram bot, gramio sendPhoto, sendPhoto typescript, sendPhoto example, telegram send image, photo file_id, caption entities, has_spoiler, show_caption_above_media, telegram bot send photo, how to send photo telegram bot, photo upload telegram
---

# sendPhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendphoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send photos. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="photo" type="InputFile | String" required description="Photo to send. Pass a file\_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="caption" type="String" description="Photo caption (may also be used when resending photos by *file\_id*), 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="has_spoiler" type="Boolean" description="Pass *True* if the photo needs to be covered with a spoiler animation" />

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
// Send a photo by file_id (fastest — no re-upload)
bot.command("photo", (ctx) => ctx.sendPhoto("file_id_here"));
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload from disk and reply to the current message
bot.command("snapshot", async (ctx) =>
  ctx.replyWithPhoto(await MediaUpload.path("./snapshot.jpg"), {
    caption: "Here is your snapshot!",
  })
);
```

```ts twoslash
import { Bot, MediaUpload, format, bold } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a spoiler photo with formatted caption
bot.command("spoiler", async (ctx) =>
  ctx.sendPhoto(await MediaUpload.path("./reveal.jpg"), {
    caption: format`${bold("Spoiler alert!")} Click to reveal`,
    has_spoiler: true,
  })
);
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch a photo from a URL (Telegram downloads it server-side)
bot.command("avatar", async (ctx) =>
  ctx.sendPhoto(await MediaUpload.url("https://example.com/avatar.jpg"), {
    caption: "Profile photo",
  })
);
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call with an inline keyboard
await bot.api.sendPhoto({
  chat_id: 123456789,
  photo: "file_id_here",
  caption: "Check out this photo!",
  reply_markup: new InlineKeyboard()
    .text("Like", "like")
    .text("Share", "share"),
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to that chat |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | `photo` is a malformed `file_id` or the URL is inaccessible |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not download the photo from the URL — ensure it is publicly accessible |
| 400 | `Bad Request: PHOTO_INVALID_DIMENSIONS` | Photo exceeds 10,000 total width+height or 20:1 aspect ratio — resize before sending |
| 400 | `Bad Request: can't parse entities` | Malformed `caption_entities` or bad `parse_mode` markup |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 403 | `Forbidden: not enough rights to send photos` | Bot lacks `can_send_photos` permission in a restricted group |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **10 MB file limit.** Photos larger than 10 MB cannot be sent via the Bot API. For larger images, send as a document via `sendDocument` (50 MB limit) — the image won't be displayed inline but can be downloaded.
- **Dimension constraints.** Total width+height must not exceed 10,000 and the aspect ratio must not exceed 20:1. Very wide panoramas or extreme crops trigger `PHOTO_INVALID_DIMENSIONS` — resize before sending.
- **Cache `file_id` after first upload.** The returned `Message.photo` is an array of `PhotoSize` objects (different resolutions). Save the largest one's `file_id` for instant resends with no re-upload. The [media-cache plugin](/plugins/official/media-cache) can automate this.
- **`caption` vs `parse_mode` / `caption_entities`.** They are mutually exclusive. GramIO's `format` helper produces `caption_entities` — never add `parse_mode` alongside it.
- **`has_spoiler` blurs the photo.** Users must tap/click to reveal it. Works in private chats, groups, and channels.
- **`show_caption_above_media` floats the caption above the photo.** The default is caption below. Useful for image gallery presentations where context should appear first.

## See Also

- [sendDocument](/telegram/methods/sendDocument) — Send any file (50 MB limit, no dimension constraints)
- [sendVideo](/telegram/methods/sendVideo) — Send a video
- [sendMediaGroup](/telegram/methods/sendMediaGroup) — Send multiple photos as an album
- [sendPaidMedia](/telegram/methods/sendPaidMedia) — Send a paid photo/video requiring Stars
- [Message](/telegram/types/Message) — The returned message object
- [Files & MediaUpload](/files/media-upload) — How to upload files in GramIO
- [Formatting guide](/formatting) — Format captions with `format` and entities
- [Keyboards guide](/keyboards/overview) — Add inline keyboard to photo messages
- [auto-retry plugin](/plugins/official/auto-retry) — Handle rate limits automatically
- [media-cache plugin](/plugins/official/media-cache) — Cache `file_id` values automatically
