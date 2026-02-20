---
title: sendVoice — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send OGG/OPUS voice messages up to 50 MB with GramIO in TypeScript. Complete sendVoice reference with captions, format requirements, file upload, and error handling.
  - - meta
    - name: keywords
      content: sendVoice, telegram bot api, gramio sendVoice, sendVoice typescript, sendVoice example, telegram voice bot, send voice message telegram, OGG OPUS voice, MP3 voice message, M4A voice message, voice caption, voice duration, InputFile MediaUpload, file_id voice, audio voice message, voice message upload
---

# sendVoice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendvoice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as [Audio](https://core.telegram.org/bots/api#audio) or [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="voice" type="InputFile | String" required description="Audio file to send. Pass a file\_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="caption" type="String" description="Voice message caption, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="duration" type="Integer" description="Duration of the voice message in seconds" />

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
// Send a voice message by file_id (fastest — no re-upload)
bot.command("voice", (ctx) =>
  ctx.sendVoice(
    "AwACAgIAAxkBAAIBjmXzPexample_voice_file_id_hereAAp4B"
  )
);
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a local OGG/OPUS file and send as a voice message
bot.command("greet", async (ctx) => {
  const voice = await MediaUpload.path("./assets/greeting.ogg");
  return ctx.sendVoice(voice, { duration: 5 });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Fetch an OGG voice file from a URL and send it
bot.command("remote", (ctx) =>
  ctx.sendVoice("https://example.com/message.ogg", {
    duration: 8,
    caption: "Listen to this announcement",
  })
);
```

```ts twoslash
import { Bot, MediaUpload, format, bold, italic } from "gramio";

const bot = new Bot("");
// ---cut---
// Voice message with a formatted caption using the format helper
bot.command("announce", async (ctx) => {
  const voice = await MediaUpload.path("./assets/notice.ogg");
  return ctx.sendVoice(voice, {
    caption: format`${bold("New announcement")} — ${italic("please listen carefully")}`,
    duration: 12,
  });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply to a user's message with a voice note
bot.command("respond", async (ctx) => {
  const voice = await MediaUpload.path("./assets/reply.ogg");
  return ctx.replyWithVoice(voice, { duration: 3 });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat exists and the bot is a member |
| 400 | `Bad Request: VOICE_MESSAGES_FORBIDDEN` | The target user has disabled receiving voice messages from non-contacts |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not fetch the audio from the provided HTTP URL |
| 400 | `Bad Request: wrong file type` | The file is not OGG/OPUS, MP3, or M4A — it will fall back to Audio or Document |
| 400 | `Bad Request: caption is too long` | Caption exceeds 1024 characters after entity parsing |
| 413 | `Request Entity Too Large` | Uploaded file exceeds the 50 MB limit |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_send_voice_notes` permission in the group/channel |
| 429 | `Too Many Requests: retry after N` | Flood control triggered — use the auto-retry plugin to handle this automatically |

::: tip Auto-retry for 429 errors
Install the [@gramio/auto-retry](/plugins/official/auto-retry) plugin to transparently handle flood-wait errors without manual retry logic.
:::

## Tips & Gotchas

- **OGG/OPUS is the preferred format.** While MP3 and M4A are also accepted, OGG encoded with the OPUS codec produces the smallest file sizes at good quality and is natively supported as a voice message. Other formats (WAV, AAC, FLAC) are sent as Audio or Document instead.
- **Voice messages can be disabled by users.** Privacy-conscious users can block voice messages from non-contacts, causing a `VOICE_MESSAGES_FORBIDDEN` error. Handle this gracefully and fall back to a text response.
- **50 MB upload limit.** Files larger than 50 MB cannot be sent. Most voice messages are well below this limit; compress long recordings before sending.
- **`sendVoice` vs `sendAudio`.** Use `sendVoice` when you want the audio to appear in the voice-message player (waveform UI). Use `sendAudio` when you want a music player card showing performer and title metadata.
- **Cache `file_id` after the first upload.** Capture `message.voice.file_id` from the returned `MessageContext` and persist it to avoid re-uploading on repeat sends.
- **Captions support formatting entities.** Use the `format` tagged template from `"gramio"` to embed bold, italic, links, and other entities — never add `parse_mode` alongside `format`.

## See Also

- [sendAudio](/telegram/methods/sendAudio) — Send an audio file with music player display (performer/title)
- [sendVideoNote](/telegram/methods/sendVideoNote) — Send a rounded video message
- [sendDocument](/telegram/methods/sendDocument) — Send an arbitrary file as a document
- [Voice](/telegram/types/Voice) — The Voice type embedded in Message
- [Media upload guide](/files/media-upload) — Upload files using `MediaUpload` helpers
- [Formatting guide](/formatting) — Format captions using GramIO's `format` tagged template
- [sendMessage](/telegram/methods/sendMessage) — Send a plain text message
