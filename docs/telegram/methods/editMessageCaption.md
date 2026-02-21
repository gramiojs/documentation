---
title: editMessageCaption — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit media message captions in Telegram bots using GramIO with TypeScript. Complete editMessageCaption reference with formatting, show_caption_above_media, and error handling.
  - - meta
    - name: keywords
      content: editMessageCaption, telegram bot api, edit caption telegram, gramio editMessageCaption, editMessageCaption typescript, editMessageCaption example, edit photo caption, update caption telegram bot, ctx.editCaption, caption, parse_mode, caption_entities, show_caption_above_media, reply_markup, how to edit caption telegram bot
---

# editMessageCaption

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagecaption" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="caption" type="String" description="New caption of the message, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True*, if the caption must be shown above the message media. Supported only for animation, photo and video messages." />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." docsLink="/keyboards/overview" />

## Returns

On success, Message | True is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update a photo/video caption when a user presses a button
bot.on("callback_query", async (ctx) => {
    await ctx.editCaption("Caption updated!");
    await ctx.answer();
});
```

```ts twoslash
import { Bot, format, bold } from "gramio";

const bot = new Bot("");
// ---cut---
// Edit caption with rich formatting — entities are built automatically
bot.on("callback_query", async (ctx) => {
    await ctx.editCaption(
        format`${bold("Updated:")} new caption text`,
    );
    await ctx.answer();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove a caption by passing an empty string
bot.on("callback_query", async (ctx) => {
    await ctx.editCaption("");
    await ctx.answer();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — edit caption and show it above the media
await bot.api.editMessageCaption({
    chat_id: "@mychannel",
    message_id: 123,
    caption: "Updated caption for this photo",
    show_caption_above_media: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: message is not modified` | New caption is identical to current — check before calling to avoid unnecessary requests |
| 400 | `Bad Request: message can't be edited` | Message too old, sent by another bot, or is not a media message with a caption |
| 400 | `Bad Request: CAPTION_TOO_LONG` | `caption` exceeds 1024 characters |
| 400 | `Bad Request: can't parse entities` | Malformed HTML/Markdown markup — use GramIO's `format` helper to build `caption_entities` safely |
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the chat |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive |
| 403 | `Forbidden: not enough rights` | Bot lacks edit permissions in a channel |
| 429 | `Too Many Requests: retry after N` | Flood control — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Caption limit is 1024 characters** — half the 4096-character limit for text messages. Plan your content layout accordingly.
- **Caption can be cleared by passing `""`** — unlike `editMessageText`, the caption is optional and can be set to zero characters to remove it entirely.
- **`parse_mode` and `caption_entities` are mutually exclusive.** GramIO's `format` helper always produces `caption_entities`, so never pass `parse_mode` alongside a formatted string.
- **`show_caption_above_media` only works for animation, photo, and video** — it has no effect on documents or audio messages.
- **Business messages have a 48-hour edit window.** Messages sent via a business connection by another user without an inline keyboard can only be edited within 48 hours of sending.
- **Inline messages return `true`, not `Message`.** When editing via `inline_message_id`, the method returns `true` on success instead of the updated `Message` object.

## See Also

- [editMessageText](/telegram/methods/editMessageText) — edit the text of a text message
- [editMessageMedia](/telegram/methods/editMessageMedia) — replace the media file itself
- [editMessageReplyMarkup](/telegram/methods/editMessageReplyMarkup) — update only the inline keyboard
- [Formatting guide](/formatting) — using `format`, `bold`, `italic`, and more
- [Keyboards overview](/keyboards/overview) — building inline keyboards with `InlineKeyboard`
- [Message](/telegram/types/Message) — the type returned on success for non-inline messages
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
