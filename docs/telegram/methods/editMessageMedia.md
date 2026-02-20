---
title: editMessageMedia — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Replace or add media in Telegram messages using GramIO with TypeScript. Complete editMessageMedia reference with InputMedia types, file uploads, album restrictions, and error handling.
  - - meta
    - name: keywords
      content: editMessageMedia, telegram bot api, edit media telegram, gramio editMessageMedia, editMessageMedia typescript, editMessageMedia example, replace photo telegram bot, update video message, ctx.editMedia, InputMedia, MediaInput, MediaUpload, InputMediaPhoto, InputMediaVideo, how to change media telegram bot, album restrictions
---

# editMessageMedia

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a> | True</span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagemedia" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file\_id or specify a URL. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="media" type="InputMedia" required description="A JSON-serialized object for a new media content of the message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

## Returns

On success, Message | True is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
// @noErrors
import { Bot, MediaUpload } from "gramio";
import { MediaInput } from "@gramio/files";

const bot = new Bot("");
// ---cut---
// Replace a message's photo from a callback_query handler
bot.on("callback_query", async (ctx) => {
    await ctx.editMedia(
        MediaInput.photo(await MediaUpload.url("https://example.com/new-photo.jpg")),
    );
    await ctx.answer();
});
```

```ts twoslash
// @noErrors
import { Bot, MediaUpload } from "gramio";
import { MediaInput } from "@gramio/files";

const bot = new Bot("");
// ---cut---
// Replace media and update caption at the same time
bot.on("callback_query", async (ctx) => {
    await ctx.editMedia(
        MediaInput.video(await MediaUpload.path("./promo.mp4"), {
            caption: "Watch this!",
            supports_streaming: true,
        }),
    );
    await ctx.answer();
});
```

```ts twoslash
// @noErrors
import { Bot, MediaUpload } from "gramio";
import { MediaInput } from "@gramio/files";

const bot = new Bot("");
// ---cut---
// Direct API call — replace media using a previously uploaded file_id
await bot.api.editMessageMedia({
    chat_id: 123456789,
    message_id: 42,
    media: MediaInput.photo("AgACAgIAAxkBAAI..."),  // file_id of an already uploaded photo
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: message is not modified` | New media content is identical to the current one |
| 400 | `Bad Request: message can't be edited` | Message too old, sent by another bot, or the media type swap is disallowed by album restrictions |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | `file_id` is invalid or the URL is inaccessible — verify the source |
| 400 | `Bad Request: PHOTO_INVALID_DIMENSIONS` | Uploaded image dimensions exceed Telegram's limits |
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the chat |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive |
| 403 | `Forbidden: not enough rights` | Bot lacks edit permissions in a channel |
| 429 | `Too Many Requests: retry after N` | Flood control — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Cannot upload new files for inline messages.** When editing via `inline_message_id`, you must provide a `file_id` of a previously uploaded file or a public URL — local file uploads are rejected.
- **Album (media group) type restrictions are strict.** If the message is part of an album, you can only swap: audio in an audio album, document in a document album, and photo or video in any other album. Attempting to change the type causes a `message can't be edited` error.
- **Can convert a plain text message to a media message.** If the original message contained only text, you can add media to it using this method.
- **Caption and media are edited atomically.** Set the `caption` field inside the `InputMedia*` object (not a top-level param) to update the caption at the same time as the media.
- **Business messages have a 48-hour edit window.** Messages sent via a business connection by another user without an inline keyboard can only be edited within 48 hours of sending.
- **Inline messages return `true`, not `Message`.** When editing via `inline_message_id`, the method returns `true` on success instead of the updated `Message` object.

## See Also

- [editMessageCaption](/telegram/methods/editMessageCaption) — edit only the caption without replacing the media
- [editMessageText](/telegram/methods/editMessageText) — edit a text message
- [editMessageReplyMarkup](/telegram/methods/editMessageReplyMarkup) — update only the inline keyboard
- [Media input guide](/files/media-input) — `MediaInput` helpers for building InputMedia objects
- [Media upload guide](/files/media-upload) — `MediaUpload.path()`, `.url()`, `.buffer()` for file handling
- [InputMedia](/telegram/types/InputMedia) — the union type accepted by the `media` parameter
- [Keyboards overview](/keyboards/overview) — building inline keyboards with `InlineKeyboard`
- [Message](/telegram/types/Message) — the type returned on success for non-inline messages
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
