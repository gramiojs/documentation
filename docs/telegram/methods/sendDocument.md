---
title: sendDocument — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send documents and files using GramIO with TypeScript. Complete sendDocument reference with file_id caching, caption formatting, thumbnail, disable_content_type_detection, and error handling.
  - - meta
    - name: keywords
      content: sendDocument, telegram bot api, send document telegram bot, gramio sendDocument, sendDocument typescript, sendDocument example, telegram send file, telegram bot send document, document file_id, caption entities, thumbnail, disable_content_type_detection, how to send file telegram bot
---

# sendDocument

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#senddocument" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send general files. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="document" type="InputFile | String" required description="File to send. Pass a file\_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="thumbnail" type="InputFile | String" description="Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the thumbnail was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="caption" type="String" description="Document caption (may also be used when resending documents by *file\_id*), 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="disable_content_type_detection" type="Boolean" description="Disables automatic server-side content type detection for files uploaded using multipart/form-data" />

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
import { Bot, MediaUpload, format, bold, italic } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a document from disk
bot.command("report", async (ctx) => {
    const doc = await MediaUpload.path("./report.pdf");
    return ctx.sendDocument(doc, { caption: "Monthly report" });
});
```

```ts twoslash
import { Bot, MediaUpload, format, bold } from "gramio";

const bot = new Bot("");
// ---cut---
// Send with formatted caption using format helper
bot.command("contract", async (ctx) => {
    const doc = await MediaUpload.path("./contract.pdf");
    return ctx.sendDocument(doc, {
        caption: format`${bold("Contract")} — please review and sign`,
    });
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Resend a cached document by file_id (fastest, no re-upload)
const fileId = "BQACAgIAAxkBAAIB..."; // stored from a previous send
bot.command("download", (ctx) => ctx.sendDocument(fileId));
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a document via URL and disable auto content-type detection
bot.command("rawfile", async (ctx) => {
    return ctx.replyWithDocument(
        await MediaUpload.url("https://example.com/data.bin"),
        { disable_content_type_detection: true }
    );
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call with a custom thumbnail
await bot.api.sendDocument({
    chat_id: 123456789,
    document: await MediaUpload.path("./archive.zip"),
    thumbnail: await MediaUpload.path("./preview.jpg"),
    caption: "Archive with preview",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to that chat |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | `document` is a malformed `file_id` or the HTTP URL is inaccessible |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not download the file from the provided URL — check that it's publicly accessible |
| 400 | `Bad Request: DOCUMENT_INVALID` | The uploaded file could not be processed — check file integrity |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 403 | `Forbidden: not enough rights to send documents` | Bot lacks `can_send_documents` permission in the restricted group |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **50 MB upload limit.** Files larger than 50 MB cannot be sent via the standard Bot API. For larger files, host a [local Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) which allows up to 2 GB.
- **Cache `file_id` after the first upload.** Once a document is uploaded, save the `file_id` from the returned `Message.document.file_id`. Subsequent sends using `file_id` are instant — no re-upload — and bypass the size limit. See [media-cache plugin](/plugins/official/media-cache) for automatic caching.
- **`caption` + `parse_mode` vs `caption_entities`.** They are mutually exclusive. GramIO's `format` helper produces `caption_entities`, so never set `parse_mode` alongside it.
- **`disable_content_type_detection` only affects new uploads.** When resending by `file_id`, this flag has no effect since the file is already stored on Telegram servers.
- **Thumbnail constraints.** The `thumbnail` must be JPEG, under 200 kB, and at most 320×320 px. It must also be a fresh upload (no reuse of existing thumbnails by `file_id`).
- **`caption` limit is 1024 characters.** Longer captions will cause a `400` error. If the document description is very long, send it as a separate text message after the document.

## See Also

- [sendPhoto](/telegram/methods/sendPhoto) — send images
- [sendAudio](/telegram/methods/sendAudio) — send audio/music
- [sendVideo](/telegram/methods/sendVideo) — send video
- [sendMediaGroup](/telegram/methods/sendMediaGroup) — send multiple files in one message
- [Document](/telegram/types/Document) — the Document type returned in the message
- [Files & MediaUpload](/files/media-upload) — how to upload files in GramIO
- [Formatting](/formatting) — how to format captions with `format` and entities
- [media-cache plugin](/plugins/official/media-cache) — cache `file_id` values automatically
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` handling
