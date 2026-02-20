---
title: sendSticker — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send WEBP, animated TGS, and video WEBM stickers with GramIO in TypeScript. Complete sendSticker reference with file upload, file_id reuse, and error handling.
  - - meta
    - name: keywords
      content: sendSticker, telegram bot api, gramio sendSticker, sendSticker typescript, sendSticker example, telegram sticker bot, send sticker telegram, sticker file_id, animated sticker, video sticker, WEBP sticker, TGS sticker, WEBM sticker, InputFile, MediaUpload, getStickerSet, StickerSet, emoji sticker, sticker pack
---

# sendSticker

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendsticker" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send static .WEBP, [animated](https://telegram.org/blog/animated-stickers) .TGS, or [video](https://telegram.org/blog/video-stickers-better-reactions) .WEBM stickers. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="sticker" type="InputFile | String" required description="Sticker to send. Pass a file\_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Video and animated stickers can't be sent via an HTTP URL." />

<ApiParam name="emoji" type="String" description="Emoji associated with the sticker; only for just uploaded stickers" />

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
// Send a sticker by file_id (recommended — fastest, no re-upload)
bot.command("sticker", (ctx) =>
  ctx.sendSticker(
    "CAACAgIAAxkBAAIBfWXzO5example_file_id_hereAAp4BAAIXxZFRqY4JaXAAE"
  )
);
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a local .WEBP sticker file from disk
bot.command("upload", async (ctx) => {
  const sticker = await MediaUpload.path("./assets/sticker.webp");
  return ctx.sendSticker(sticker, { emoji: "😎" });
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send sticker via HTTP URL (static WEBP only — animated/video require upload)
bot.command("websticker", (ctx) =>
  ctx.sendSticker("https://example.com/sticker.webp")
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply to the user's message with a sticker
bot.command("react", (ctx) =>
  ctx.replyWithSticker(
    "CAACAgIAAxkBAAIBfWXzO5example_file_id_hereAAp4BAAIXxZFRqY4JaXAAE"
  )
);
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Send sticker silently with an inline keyboard below
bot.command("quiet", (ctx) =>
  ctx.sendSticker(
    "CAACAgIAAxkBAAIBfWXzO5example_file_id_hereAAp4BAAIXxZFRqY4JaXAAE",
    {
      disable_notification: true,
      reply_markup: new InlineKeyboard().text("More stickers", "more_stickers"),
    }
  )
);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat exists and the bot is a member |
| 400 | `Bad Request: STICKER_INVALID` | The provided `file_id` does not refer to a sticker, or the file is corrupt |
| 400 | `Bad Request: wrong file type` | A non-sticker file_id was passed in the `sticker` field |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not fetch the sticker from the provided HTTP URL |
| 400 | `Bad Request: can't send sticker via HTTP URL` | Animated (.TGS) or video (.WEBM) stickers cannot be sent via URL — upload them directly |
| 400 | `Bad Request: WEBP_BAD_DIMENSIONS` | Uploaded WEBP sticker dimensions exceed 512×512 pixels |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_send_other_messages` permission in the group/channel |
| 413 | `Request Entity Too Large` | Uploaded file exceeds the size limit |
| 429 | `Too Many Requests: retry after N` | Flood control triggered — use the auto-retry plugin to handle this automatically |

::: tip Auto-retry for 429 errors
Install the [@gramio/auto-retry](/plugins/official/auto-retry) plugin to transparently handle flood-wait errors without manual retry logic.
:::

## Tips & Gotchas

- **Prefer `file_id` for repeat sends.** When you receive a sticker message, save the `sticker.file_id` from the `Message` object and reuse it. This avoids re-uploading and is significantly faster.
- **Animated and video stickers cannot be sent via URL.** Only static WEBP stickers can be fetched from an HTTP URL. TGS and WEBM formats require a direct file upload via `MediaUpload.path()`.
- **`emoji` is only used for freshly uploaded stickers.** When sending by `file_id` or URL, the `emoji` parameter is ignored — the emoji is already attached to the sticker on Telegram's servers.
- **WEBP stickers must be exactly 512×512 pixels.** Larger dimensions will be rejected with `WEBP_BAD_DIMENSIONS`. Resize before uploading.
- **Cache `file_id` after the first upload.** After uploading a sticker, capture `message.sticker.file_id` from the returned `MessageContext` and persist it (e.g. in a database) for all future sends.
- **Use `getStickerSet` to discover sticker packs.** If you need the `file_id` for a specific sticker in a set, call `bot.api.getStickerSet({ name: "setname" })` and iterate over the `stickers` array.

## See Also

- [getStickerSet](/telegram/methods/getStickerSet) — Retrieve all stickers in a sticker set by name
- [uploadStickerFile](/telegram/methods/uploadStickerFile) — Upload a sticker file to Telegram servers before adding to a set
- [createNewStickerSet](/telegram/methods/createNewStickerSet) — Create a new sticker set for the bot
- [Sticker](/telegram/types/Sticker) — The Sticker type embedded in Message
- [StickerSet](/telegram/types/StickerSet) — Collection of stickers with name and title
- [Media upload guide](/files/media-upload) — Upload files using `MediaUpload` helpers
- [sendAnimation](/telegram/methods/sendAnimation) — Send GIF animations
- [sendDocument](/telegram/methods/sendDocument) — Send arbitrary files as documents
