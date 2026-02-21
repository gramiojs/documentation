---
title: sendAnimation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send GIF or H.264/MPEG-4 AVC animations with GramIO in TypeScript. Supports file_id, URL, and local file upload with captions, spoiler, and thumbnail. Up to 50 MB.
  - - meta
    - name: keywords
      content: sendAnimation, telegram bot api, gramio sendAnimation, sendAnimation typescript, sendAnimation example, send gif telegram bot, send animation telegram, animation caption, has_spoiler, thumbnail, MediaUpload, file_id, animation typescript
---

# sendAnimation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendanimation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="animation" type="InputFile | String" required description="Animation to send. Pass a file\_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="duration" type="Integer" description="Duration of sent animation in seconds" />

<ApiParam name="width" type="Integer" description="Animation width" />

<ApiParam name="height" type="Integer" description="Animation height" />

<ApiParam name="thumbnail" type="InputFile | String" description="Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="caption" type="String" description="Animation caption (may also be used when resending animation by *file\_id*), 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="has_spoiler" type="Boolean" description="Pass *True* if the animation needs to be covered with a spoiler animation" />

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

Send an animation from a public URL using the context shorthand inside a message handler:

```ts twoslash
import { Bot, MediaUpload } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendAnimation(
    "https://media.giphy.com/media/26xBwdIuRJiAIqHLa/giphy.gif",
    { caption: "Here's your animation!" }
  );
});
```

Reply to the user's message with an animation using `replyWithAnimation`:

```ts twoslash
import { Bot, MediaUpload } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.replyWithAnimation(
    "https://media.giphy.com/media/26xBwdIuRJiAIqHLa/giphy.gif",
    { caption: "Replying with animation" }
  );
});
```

Upload a local GIF file using `MediaUpload.path`:

```ts twoslash
import { Bot, MediaUpload } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendAnimation(await MediaUpload.path("./assets/hello.gif"), {
    caption: "Uploaded from disk",
    duration: 3,
    width: 480,
    height: 270,
  });
});
```

Send a spoiler-wrapped animation with a caption:

```ts twoslash
import { Bot, format, bold } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendAnimation(
    "AgACAgIAAxkBAAIB...", // file_id
    {
      caption: format`${bold("Spoiler!")} Tap to reveal.`,
      has_spoiler: true,
    }
  );
});
```

Direct API call with `bot.api.sendAnimation` (useful outside handlers):

```ts twoslash
import { Bot, MediaUpload } from "gramio";
const bot = new Bot("");
// ---cut---
const msg = await bot.api.sendAnimation({
  chat_id: 123456789,
  animation: await MediaUpload.url(
    "https://media.giphy.com/media/26xBwdIuRJiAIqHLa/giphy.gif"
  ),
  caption: "Sent via direct API call",
  width: 480,
  height: 270,
  duration: 5,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the bot has never interacted with the user, or the chat does not exist. |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | The `file_id` is malformed or the URL is unreachable / returns a non-media response. |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not download the animation from the provided HTTP URL. Check the URL is publicly accessible. |
| 400 | `Bad Request: PHOTO_INVALID_DIMENSIONS` | The uploaded file does not meet dimension expectations for animated media. Provide correct `width`/`height`. |
| 400 | `Bad Request: file is too big` | The animation exceeds the 50 MB server-side limit. Compress or trim the file before uploading. |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot. Remove them from your active user list. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Back off for the specified number of seconds. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **50 MB hard limit.** Animations larger than 50 MB are rejected. Compress the GIF or use a short MPEG-4 clip instead.
- **GIF vs MP4.** Telegram internally converts GIFs to MP4 for efficient delivery. Sending an MP4 with no audio is more bandwidth-friendly and avoids re-encoding.
- **Thumbnail is only applied for new uploads.** If you pass a `file_id`, Telegram ignores the `thumbnail` parameter entirely.
- **`has_spoiler` blurs the preview.** The animation plays normally after the user taps the spoiler overlay. This works in private chats, groups, and channels.
- **Caption limit is 1024 characters.** Unlike `sendMessage` (4096 chars), animation captions are capped. Truncate or split long text.
- **`show_caption_above_media`** places the caption text above the animation instead of below — useful for storytelling-style posts.

## See Also

- [Media Upload guide](/files/media-upload) — file_id, URL, path, buffer upload patterns
- [Formatting guide](/formatting) — bold, italic, and entity-based caption formatting
- [Keyboards overview](/keyboards/overview) — attaching inline or reply keyboards
- [sendVideo](/telegram/methods/sendVideo) — send MP4 video with audio
- [sendDocument](/telegram/methods/sendDocument) — send files without media player rendering
- [sendPhoto](/telegram/methods/sendPhoto) — send static images
- [Animation type](/telegram/types/Animation) — structure of the returned animation object
- [Message type](/telegram/types/Message) — full structure of the returned message
