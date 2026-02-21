---
title: sendAudio — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send MP3 or M4A audio files displayed in the music player with GramIO in TypeScript. Supports file_id, URL, upload, performer, title, and thumbnail. Up to 50 MB.
  - - meta
    - name: keywords
      content: sendAudio, telegram bot api, gramio sendAudio, sendAudio typescript, sendAudio example, send mp3 telegram bot, send music telegram, audio caption, performer, title, thumbnail, MediaUpload, file_id, audio typescript
---

# sendAudio

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendaudio" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.

For sending voice messages, use the [sendVoice](https://core.telegram.org/bots/api#sendvoice) method instead.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="audio" type="InputFile | String" required description="Audio file to send. Pass a file\_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="caption" type="String" description="Audio caption, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="duration" type="Integer" description="Duration of the audio in seconds" />

<ApiParam name="performer" type="String" description="Performer" />

<ApiParam name="title" type="String" description="Track name" />

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

Send an audio file by URL from a message handler using the context shorthand:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendAudio(
    "https://example.com/track.mp3",
    {
      performer: "Artist Name",
      title: "Song Title",
      duration: 210,
    }
  );
});
```

Reply to the user's message with the audio using `replyWithAudio`:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.replyWithAudio("https://example.com/track.mp3", {
    performer: "Artist Name",
    title: "Song Title",
  });
});
```

Upload a local MP3 file using `MediaUpload.path` and include a caption:

```ts twoslash
import { Bot, MediaUpload, format, bold } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendAudio(await MediaUpload.path("./music/track.mp3"), {
    caption: format`${bold("Now playing:")} My Favorite Track`,
    performer: "My Band",
    title: "My Favorite Track",
    duration: 195,
  });
});
```

Resend a previously uploaded audio using its `file_id` for efficiency:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  // file_id obtained from a previously received Message
  const fileId = "CQACAgIAAxkBAAIB...";
  await ctx.sendAudio(fileId, {
    caption: "Resent from cache — no re-upload needed!",
  });
});
```

Direct API call with `bot.api.sendAudio` (useful outside message handlers):

```ts twoslash
import { Bot, MediaUpload } from "gramio";
const bot = new Bot("");
// ---cut---
const msg = await bot.api.sendAudio({
  chat_id: 123456789,
  audio: await MediaUpload.url("https://example.com/track.mp3"),
  performer: "Artist",
  title: "Track",
  duration: 210,
  caption: "Enjoy the music!",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the bot has never interacted with the user, or the chat does not exist. |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | The `file_id` is malformed or the URL is unreachable / returns a non-audio response. |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not download the audio from the provided HTTP URL. Ensure the URL is publicly accessible. |
| 400 | `Bad Request: file is too big` | The audio exceeds the 50 MB server-side limit. Compress or split the file before uploading. |
| 400 | `Bad Request: AUDIO_INVALID` | The file format is not supported. Only `.mp3` and `.m4a` formats are displayed in the music player. |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot. Remove them from your active user list. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Back off for the specified number of seconds. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only MP3 and M4A show in the music player.** Other formats (OGG, WAV, FLAC) will be sent as documents. If you need voice-note playback, use `sendVoice` instead.
- **Use `file_id` to re-send.** Once uploaded, store the `file_id` from the returned `Message.audio.file_id` and pass it directly on future sends — no bandwidth cost.
- **`performer` and `title` populate the mini player.** Provide both to give users a proper music-player experience. Without them, Telegram displays the filename.
- **Thumbnail is only applied to fresh uploads.** Passing a `thumbnail` with a `file_id` audio has no effect — Telegram uses the cached thumbnail.
- **50 MB is the current cap.** Split long recordings or reduce bitrate (128 kbps is sufficient for voice/speech).
- **Caption limit is 1024 characters.** Unlike `sendMessage`, audio captions are capped at 1024 chars.

## See Also

- [Media Upload guide](/files/media-upload) — file_id, URL, path, buffer upload patterns
- [Formatting guide](/formatting) — bold, italic, and entity-based caption formatting
- [Keyboards overview](/keyboards/overview) — attaching inline or reply keyboards
- [sendVoice](/telegram/methods/sendVoice) — send OGG voice messages
- [sendDocument](/telegram/methods/sendDocument) — send files without media player rendering
- [Audio type](/telegram/types/Audio) — structure of the returned audio object
- [Message type](/telegram/types/Message) — full structure of the returned message
