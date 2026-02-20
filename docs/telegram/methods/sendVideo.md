---
title: sendVideo — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send MPEG4 video files up to 50 MB with GramIO in TypeScript. Complete sendVideo reference with captions, thumbnails, spoiler, streaming flag, and error handling.
  - - meta
    - name: keywords
      content: sendVideo, telegram bot api, gramio sendVideo, sendVideo typescript, sendVideo example, telegram video bot, send video telegram, video upload, MPEG4 video, video caption, video thumbnail, has_spoiler, supports_streaming, show_caption_above_media, InputFile, MediaUpload, file_id video, video duration width height, cover video
---

# sendVideo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendvideo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="video" type="InputFile | String" required description="Video to send. Pass a file\_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="duration" type="Integer" description="Duration of sent video in seconds" />

<ApiParam name="width" type="Integer" description="Video width" />

<ApiParam name="height" type="Integer" description="Video height" />

<ApiParam name="thumbnail" type="InputFile | String" description="Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="cover" type="InputFile | String" description="Cover for the video in the message. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="start_timestamp" type="Integer" description="Start timestamp for the video in the message" />

<ApiParam name="caption" type="String" description="Video caption (may also be used when resending videos by *file\_id*), 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="has_spoiler" type="Boolean" description="Pass *True* if the video needs to be covered with a spoiler animation" />

<ApiParam name="supports_streaming" type="Boolean" description="Pass *True* if the uploaded video is suitable for streaming" />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a video by file_id (fastest — no re-upload)
bot.command("clip", (ctx) =>
  ctx.sendVideo(
    "BAACAgIAAxkBAAIBjmXzPexample_video_file_id_hereOjcQ"
  )
);
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a local MPEG4 file with metadata and streaming flag
bot.command("upload", async (ctx) => {
  const video = await MediaUpload.path("./assets/intro.mp4");
  return ctx.sendVideo(video, {
    duration: 42,
    width: 1280,
    height: 720,
    supports_streaming: true,
    caption: "Welcome to GramIO!",
  });
});
```

```ts twoslash
import { Bot, MediaUpload, format, bold } from "gramio";

const bot = new Bot("");
// ---cut---
// Video with formatted caption and a spoiler overlay
bot.command("spoiler", async (ctx) => {
  const video = await MediaUpload.path("./assets/reveal.mp4");
  return ctx.sendVideo(video, {
    caption: format`${bold("Spoiler")} — watch at your own risk!`,
    has_spoiler: true,
  });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload video from a URL with a custom JPEG thumbnail
bot.command("remote", async (ctx) => {
  const thumbnail = await MediaUpload.path("./assets/thumb.jpg");
  return ctx.sendVideo("https://example.com/demo.mp4", {
    thumbnail,
    caption: "Demo video from the web",
    supports_streaming: true,
  });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply with a video and caption shown above the media
bot.command("reply", async (ctx) => {
  const video = await MediaUpload.path("./assets/promo.mp4");
  return ctx.replyWithVideo(video, {
    caption: "This caption appears above the video",
    show_caption_above_media: true,
    duration: 15,
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat exists and the bot is a member |
| 400 | `Bad Request: VIDEO_INVALID` | The provided `file_id` does not refer to a video |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not fetch the video from the provided HTTP URL |
| 400 | `Bad Request: wrong type of the web page content` | The URL did not return an MPEG4 file — non-MPEG4 formats are sent as Document |
| 400 | `Bad Request: caption is too long` | Caption exceeds 1024 characters after entity parsing |
| 400 | `Bad Request: MEDIA_CAPTION_TOO_LONG` | Same as above via a different code path |
| 413 | `Request Entity Too Large` | Uploaded file exceeds the 50 MB limit |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_send_media_messages` permission in the group/channel |
| 429 | `Too Many Requests: retry after N` | Flood control triggered — use the auto-retry plugin to handle this automatically |

::: tip Auto-retry for 429 errors
Install the [@gramio/auto-retry](/plugins/official/auto-retry) plugin to transparently handle flood-wait errors without manual retry logic.
:::

## Tips & Gotchas

- **Only MPEG4 (.mp4) renders inline.** Other formats (AVI, MOV, MKV, etc.) will be sent as a generic Document without a video preview. Transcode to MPEG4 before sending.
- **50 MB upload limit.** Files larger than 50 MB cannot be sent by bots. For larger files, consider hosting the video externally and passing a URL, or compress first.
- **Cache `file_id` after the first upload.** Capture `message.video.file_id` from the returned `MessageContext` and store it so subsequent sends avoid re-uploading.
- **Set `supports_streaming: true` for streamable videos.** This allows Telegram clients to start playing the video before it has fully buffered. Ensure the video is encoded with a fast-start flag (moov atom at the start of the file).
- **Thumbnail constraints.** Custom thumbnails must be JPEG, under 200 kB, and at most 320×320 px. Thumbnails cannot be reused — they must be uploaded fresh each time.
- **`has_spoiler` blurs the preview.** Users must tap to reveal the video. This is useful for plot spoilers or NSFW content gating.
- **Use `sendMediaGroup` for multiple videos.** Sending up to 10 videos in a single album is more efficient and groups them visually for the recipient.

## See Also

- [sendVideoNote](/telegram/methods/sendVideoNote) — Send a rounded video message (video circle)
- [sendAnimation](/telegram/methods/sendAnimation) — Send GIF or MP4 animation without sound
- [sendAudio](/telegram/methods/sendAudio) — Send an audio file with music player display
- [sendMediaGroup](/telegram/methods/sendMediaGroup) — Send multiple videos/photos as an album
- [Video](/telegram/types/Video) — The Video type embedded in Message
- [Media upload guide](/files/media-upload) — Upload files using `MediaUpload` helpers
- [Media input guide](/files/media-input) — Work with `InputMedia` for albums
- [Formatting guide](/formatting) — Format captions using GramIO's `format` tagged template
