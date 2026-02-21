---
title: sendPaidMedia — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send paid photos and videos requiring Telegram Stars using GramIO. Complete sendPaidMedia TypeScript reference with star_count, payload tracking, channel monetization, and error handling.
  - - meta
    - name: keywords
      content: sendPaidMedia, telegram bot api, telegram paid media, paid content telegram bot, gramio sendPaidMedia, sendPaidMedia typescript, sendPaidMedia example, star_count, InputPaidMedia, telegram stars, paid photo telegram, paid video telegram, how to send paid media telegram bot, monetize telegram bot
---

# sendPaidMedia

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendpaidmedia" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send paid media. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance." />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="star_count" type="Integer" required description="The number of Telegram Stars that must be paid to buy access to the media; 1-25000" />

<ApiParam name="media" type="InputPaidMedia[]" required description="A JSON-serialized array describing the media to be sent; up to 10 items" />

<ApiParam name="payload" type="String" description="Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes." />

<ApiParam name="caption" type="String" description="Media caption, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the media caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True*, if the caption must be shown above the message media" />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

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
// Send a paid photo requiring 50 Stars
bot.command("premium", (ctx) =>
  ctx.sendPaidMedia(
    [{ type: "photo", media: "photo_file_id" }],
    50,
    { caption: "Exclusive content — thanks for your Stars!" }
  )
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a paid album of 3 photos
bot.command("gallery", (ctx) =>
  ctx.sendPaidMedia(
    [
      { type: "photo", media: "photo_file_id_1" },
      { type: "photo", media: "photo_file_id_2" },
      { type: "photo", media: "photo_file_id_3" },
    ],
    100,
    { caption: "Premium photo gallery" }
  )
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Track purchases with a bot-defined payload (invisible to users)
bot.command("video", (ctx) =>
  ctx.sendPaidMedia(
    [{ type: "video", media: "video_file_id" }],
    200,
    { payload: `uid:${ctx.from?.id}:pack1` }
  )
);
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a new video and send as paid content
bot.command("exclusive", async (ctx) =>
  ctx.sendPaidMedia(
    [{ type: "video", media: await MediaUpload.path("./exclusive.mp4") }],
    500,
    { caption: "Exclusive video" }
  )
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — send to a channel (Stars go to channel balance)
await bot.api.sendPaidMedia({
  chat_id: "@mychannel",
  media: [
    { type: "photo", media: "photo_file_id" },
    { type: "video", media: "video_file_id" },
  ],
  star_count: 150,
  caption: "Premium pack",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to that chat |
| 400 | `Bad Request: STARS_AMOUNT_INVALID` | `star_count` is 0 or exceeds 25000 — must be in range 1–25000 |
| 400 | `Bad Request: MEDIA_EMPTY` | `media` array is empty — provide at least one item |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | A `file_id` is malformed or the URL is inaccessible |
| 400 | `Bad Request: PAYLOAD_TOO_LARGE` | `payload` string exceeds 128 bytes |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot not in the target channel — add as admin first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Stars routing depends on `chat_id`.** Sending to a channel credits Stars to the channel's balance; sending to a private chat or group credits the bot's balance. Design your monetization flow accordingly.
- **`InputPaidMedia` is different from `InputMedia`.** Paid media uses plain objects `{ type: "photo" | "video", media: file_id }` — these are **not** the same as `InputMediaPhoto`/`InputMediaVideo` used in `sendMediaGroup`. Do not use `MediaInput.*()` helpers here.
- **Caption is at the group level, not per-item.** Unlike `sendMediaGroup`, `sendPaidMedia` has no per-item caption. Set `caption` in the top-level params.
- **`star_count` is 1–25000.** The maximum was increased to 25,000 in Bot API 9.3. Values outside this range will error.
- **Use `payload` for purchase tracking.** Store a user ID or product ID in `payload` (0-128 bytes, never shown to users). You'll receive it back in payment-related update callbacks.
- **Paid media cannot be forwarded.** Users who unlock paid content cannot forward it — `protect_content` is effectively always on.

## See Also

- [sendMediaGroup](/telegram/methods/sendMediaGroup) — Send a free photo/video album
- [sendPhoto](/telegram/methods/sendPhoto) — Send a single free photo
- [InputPaidMedia](/telegram/types/InputPaidMedia) — The paid media input union type
- [InputPaidMediaPhoto](/telegram/types/InputPaidMediaPhoto) — Paid photo object
- [InputPaidMediaVideo](/telegram/types/InputPaidMediaVideo) — Paid video object
- [Files & MediaUpload](/files/media-upload) — How to upload files in GramIO
- [Formatting guide](/formatting) — Format captions with `format` and entities
- [auto-retry plugin](/plugins/official/auto-retry) — Handle rate limits automatically
