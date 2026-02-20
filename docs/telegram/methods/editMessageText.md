---
title: editMessageText — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit text messages in Telegram bots using GramIO with TypeScript. Complete editMessageText parameter reference, formatting examples, inline keyboard updates, and common error handling.
  - - meta
    - name: keywords
      content: editMessageText, telegram bot api, edit message text telegram, gramio editMessageText, editMessageText typescript, editMessageText example, edit text telegram bot, update message text, ctx.editText, telegram edit message, how to edit message telegram bot, text, parse_mode, entities, link_preview_options, reply_markup, business messages, inline messages
---

# editMessageText

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagetext" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit text and [game](https://core.telegram.org/bots/api#games) messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="text" type="String" required description="New text of the message, 1-4096 characters after entities parsing" :minLen="1" :maxLen="4096" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in message text, which can be specified instead of *parse\_mode*" />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="Link preview generation options for the message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

## Returns

On success, Message | True is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Edit message text when a user presses a button
bot.on("callback_query", async (ctx) => {
    await ctx.editText("Updated message content!");
    await ctx.answer();
});
```

```ts twoslash
import { Bot, format, bold, link } from "gramio";

const bot = new Bot("");
// ---cut---
// Edit with rich text formatting — entities are built automatically, no parse_mode needed
bot.on("callback_query", async (ctx) => {
    await ctx.editText(
        format`Hello, ${bold("world")}! Visit ${link("GramIO", "https://gramio.dev")}`,
    );
    await ctx.answer();
});
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Edit text and update the inline keyboard simultaneously
bot.on("callback_query", async (ctx) => {
    const keyboard = new InlineKeyboard().text("Back", "go_back");

    await ctx.editText("Step 2: choose an option.", {
        reply_markup: keyboard,
    });
    await ctx.answer();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — edit a specific message by chat_id + message_id
await bot.api.editMessageText({
    chat_id: 123456789,
    message_id: 42,
    text: "Message has been updated.",
    link_preview_options: { is_disabled: true },
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: message is not modified` | New text is identical to the current content — check before calling to avoid unnecessary requests |
| 400 | `Bad Request: message can't be edited` | Message is too old, was sent by a different bot, or is not a text or game message |
| 400 | `Bad Request: TEXT_TOO_LONG` | `text` exceeds 4096 characters — use the [Split plugin](/plugins/official/split) for long content |
| 400 | `Bad Request: can't parse entities` | Malformed HTML/Markdown markup or mismatched tags — use GramIO's `format` helper to build entities safely |
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the chat |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive |
| 403 | `Forbidden: not enough rights` | Bot lacks edit permissions in a channel |
| 429 | `Too Many Requests: retry after N` | Flood control — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Text length is 1–4096 characters.** Empty strings are rejected — unlike captions, text cannot be cleared. For content that might exceed the limit, use the [Split plugin](/plugins/official/split).
- **`parse_mode` and `entities` are mutually exclusive.** GramIO's `format` helper always produces `entities`, so never pass `parse_mode` alongside a formatted string — doing so causes an error.
- **`link_preview_options` replaces the deprecated `disable_web_page_preview`.** Use `{ is_disabled: true }` to suppress link previews, or `{ url: "..." }` to force a specific URL preview.
- **Business messages have a 48-hour edit window.** Messages sent via a business connection by another user (not the bot) that lack an inline keyboard can only be edited within 48 hours of sending.
- **Inline messages return `true`, not `Message`.** When editing via `inline_message_id`, the method returns `true` on success instead of the `Message` object. Narrow the type before accessing message properties.
- **`ctx.editText()` on `CallbackQueryContext`** automatically uses the correct identifier — `chat_id + message_id` for regular messages, `inline_message_id` for inline query results.

## See Also

- [editMessageCaption](/telegram/methods/editMessageCaption) — edit the caption on photo/video messages
- [editMessageReplyMarkup](/telegram/methods/editMessageReplyMarkup) — change only the inline keyboard without touching the text
- [editMessageMedia](/telegram/methods/editMessageMedia) — replace the media file in a message
- [Formatting guide](/formatting) — building rich text with `format`, `bold`, `italic`, and more
- [Keyboards overview](/keyboards/overview) — building inline keyboards with `InlineKeyboard`
- [Message](/telegram/types/Message) — the type returned on success for non-inline messages
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
- [Split plugin](/plugins/official/split) — handle messages exceeding the 4096-character limit
