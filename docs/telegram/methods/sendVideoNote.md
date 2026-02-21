---
title: sendVideoNote — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send rounded square video messages (video circles) up to 1 minute with GramIO in TypeScript. Complete sendVideoNote reference with upload, length, thumbnail, and error handling.
  - - meta
    - name: keywords
      content: sendVideoNote, telegram bot api, gramio sendVideoNote, sendVideoNote typescript, sendVideoNote example, telegram video note bot, video circle telegram, rounded video message, video message telegram, MPEG4 video note, video_note file_id, InputFile MediaUpload, duration length thumbnail, video circle upload
---

# sendVideoNote

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendvideonote" target="_blank" rel="noopener">Official docs ↗</a>
</div>

As of [v.4.0](https://telegram.org/blog/video-messages-and-telescope), Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="video_note" type="InputFile | String" required description="Video note to send. Pass a file\_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Sending video notes by a URL is currently unsupported" docsLink="/files/media-upload" />

<ApiParam name="duration" type="Integer" description="Duration of sent video in seconds" />

<ApiParam name="length" type="Integer" description="Video width and height, i.e. diameter of the video message" />

<ApiParam name="thumbnail" type="InputFile | String" description="Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

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
// Send a video note by file_id (fastest — no re-upload)
bot.command("vidnote", (ctx) =>
  ctx.sendVideoNote(
    "DQACAgIAAxkBAAIBjmXzPexample_videonote_file_id_hereQ"
  )
);
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a local square MPEG4 video note with dimensions
bot.command("circle", async (ctx) => {
  const videoNote = await MediaUpload.path("./assets/greeting.mp4");
  return ctx.sendVideoNote(videoNote, {
    duration: 10,
    length: 480, // diameter in pixels — video must be square
  });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload video note with a custom JPEG thumbnail
bot.command("thumb", async (ctx) => {
  const videoNote = await MediaUpload.path("./assets/note.mp4");
  const thumbnail = await MediaUpload.path("./assets/note_thumb.jpg");
  return ctx.sendVideoNote(videoNote, {
    duration: 20,
    length: 360,
    thumbnail,
  });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply with a video note (sets reply_parameters automatically)
bot.command("reply", async (ctx) => {
  const videoNote = await MediaUpload.path("./assets/response.mp4");
  return ctx.replyWithVideoNote(videoNote, { duration: 5, length: 240 });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat exists and the bot is a member |
| 400 | `Bad Request: VIDEO_NOTE_INVALID` | The provided `file_id` does not refer to a video note |
| 400 | `Bad Request: failed to get HTTP URL content` | Video notes cannot be sent via URL — upload required |
| 400 | `Bad Request: wrong video note length` | `length` value is outside the acceptable range or the video is not square |
| 400 | `Bad Request: VIDEO_NOTE_LENGTH_INVALID` | Same as above via a different code path |
| 413 | `Request Entity Too Large` | Uploaded file exceeds the size limit |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_send_media_messages` permission in the group/channel |
| 429 | `Too Many Requests: retry after N` | Flood control triggered — use the auto-retry plugin to handle this automatically |

::: tip Auto-retry for 429 errors
Install the [@gramio/auto-retry](/plugins/official/auto-retry) plugin to transparently handle flood-wait errors without manual retry logic.
:::

## Tips & Gotchas

- **Video notes cannot be sent via URL.** Unlike regular videos, `sendVideoNote` does not accept HTTP URLs as the `video_note` parameter — you must upload the file directly using `MediaUpload.path()` or pass an existing `file_id`.
- **The video must be square.** Telegram crops video notes into a circle, so the source video must have equal width and height. Non-square videos may be rejected or displayed incorrectly.
- **Maximum 1 minute duration.** Video notes are capped at 60 seconds. Files longer than that will be rejected.
- **`length` is the diameter, not width+height.** Pass the pixel diameter of the square video (e.g. `360` for a 360×360 video). This is a single integer, not an array.
- **Cache `file_id` after the first upload.** Capture `message.videoNote.file_id` from the returned `MessageContext` and persist it to avoid re-uploading on repeat sends.
- **Thumbnails must be fresh JPEG files.** Thumbnail `file_id` values from previous messages cannot be reused — always upload a new JPEG file under 200 kB and at most 320×320 px.

## See Also

- [sendVideo](/telegram/methods/sendVideo) — Send a full-length MPEG4 video with caption
- [sendVoice](/telegram/methods/sendVoice) — Send an audio voice message
- [sendAnimation](/telegram/methods/sendAnimation) — Send a GIF or silent MP4 animation
- [VideoNote](/telegram/types/VideoNote) — The VideoNote type embedded in Message
- [Media upload guide](/files/media-upload) — Upload files using `MediaUpload` helpers
- [sendMessage](/telegram/methods/sendMessage) — Send a plain text message
