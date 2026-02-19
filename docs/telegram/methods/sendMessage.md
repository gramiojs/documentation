---
title: sendMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send text messages via the Telegram Bot API using GramIO. Complete parameter reference with TypeScript examples, entities formatting, reply_markup, and more.
  - - meta
    - name: keywords
      content: sendMessage, telegram bot api, send message telegram, telegram send text, gramio sendMessage, bot send message, entities, reply_markup
---

# sendMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send text messages. On success, the sent [Message](/telegram/types/Message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String">
Unique identifier of the business connection on behalf of which the message will be sent.
</ApiParam>

<ApiParam name="chat_id" type="Integer | String" required>
Unique identifier for the target chat or username of the target channel (e.g. `@channelusername`).
</ApiParam>

<ApiParam name="message_thread_id" type="Integer">
Unique identifier for the target message thread (topic) of the forum. For forum supergroups only.
</ApiParam>

<ApiParam name="text" type="String" required :min="1" :max="4096">
Text of the message to be sent, 1–4096 characters after entities parsing.
</ApiParam>

<ApiParam name="parse_mode" type="String">
Mode for parsing entities in the message text. One of `HTML`, `Markdown`, or `MarkdownV2`. See [formatting options](/formatting). Mutually exclusive with `entities`.
</ApiParam>

<ApiParam name="entities" type="MessageEntity[]">
Special entities that appear in message text (bold, italic, links, code, etc.). Mutually exclusive with `parse_mode`. GramIO's `format` helper builds these for you automatically.
</ApiParam>

<ApiParam name="link_preview_options" type="LinkPreviewOptions">
Link preview generation options for the message — disable it, customize position, or choose which URL to expand.
</ApiParam>

<ApiParam name="disable_notification" type="Boolean">
Sends the message silently. Users will receive a notification with no sound.
</ApiParam>

<ApiParam name="protect_content" type="Boolean">
Protects the contents of the sent message from forwarding and saving.
</ApiParam>

<ApiParam name="allow_paid_broadcast" type="Boolean">
Pass `true` to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee. Requires the `can_post_messages` right in a channel.
</ApiParam>

<ApiParam name="message_effect_id" type="String">
Unique identifier of the message effect to be added to the message. For private chats only.
</ApiParam>

<ApiParam name="reply_parameters" type="ReplyParameters">
Description of the message to reply to. Use this instead of the old `reply_to_message_id`.
</ApiParam>

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply">
Additional interface options. Pass an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard, or to force a reply from the user.
</ApiParam>

## Returns

On success, the sent [Message](/telegram/types/Message) is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
// The simplest way — via context shorthand
bot.command("start", (ctx) => ctx.send("Hello! 👋"));

// reply() automatically sets reply_parameters
bot.on("message", (ctx) => ctx.reply("Got your message!"));

// Direct API call
await bot.api.sendMessage({
  chat_id: 123456789,
  text: "Hello from the API!",
});
```

### Formatting with `format`

GramIO's `format` tagged template builds **entities** (not `parse_mode`) — type-safe and no escaping needed:

```typescript
import { format, bold, italic, code, link } from "gramio";

bot.command("info", (ctx) =>
  ctx.send(
    format`Hello, ${bold(ctx.from.first_name)}!
Version: ${code("1.0.0")}
Docs: ${link("gramio.dev", "https://gramio.dev")}`
  )
);
```

### With inline keyboard

```typescript
import { InlineKeyboard } from "gramio";

bot.command("menu", (ctx) =>
  ctx.send("Choose an option:", {
    reply_markup: new InlineKeyboard()
      .text("Option A", "option_a")
      .text("Option B", "option_b"),
  })
);
```

### Silent message

```typescript
await bot.api.sendMessage({
  chat_id: ctx.chat.id,
  text: "This arrives without a notification sound",
  disable_notification: true,
});
```

## Errors

Common errors returned by Telegram for this method:

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: not enough rights to send text messages` | Bot lacks send permission in the chat |
| 400 | `Bad Request: TEXT_TOO_LONG` | `text` exceeds 4096 characters |
| 400 | `Bad Request: can't parse entities` | Malformed `entities` array or bad `parse_mode` markup |
| 400 | `Bad Request: BUTTON_DATA_INVALID` | Callback data in `reply_markup` is too long or malformed |
| 403 | `Forbidden: bot was blocked by the user` | User has blocked the bot |
| 429 | `Too Many Requests: retry after N` | [Rate limit](/rate-limits) hit — check `retry_after` in the response |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Text limit is 4096 characters.** For longer messages, use the [Split plugin](/plugins/official/split) which splits text while preserving formatting entities.
- **`parse_mode` and `entities` are mutually exclusive.** GramIO's `format` helper produces `entities`, so don't pass `parse_mode` alongside it.
- **`chat_id` accepts `@username` strings** for public groups/channels. Private chats require a numeric ID.
- **Replying cross-chat:** `reply_parameters` supports replies to messages in other chats — handy for cross-posting scenarios.
- **Forum topics:** include `message_thread_id` matching the topic's ID when sending to a supergroup forum.

## See Also

- [sendPhoto](/telegram/methods/sendPhoto) — Send a photo with optional caption
- [sendDocument](/telegram/methods/sendDocument) — Send any file
- [editMessageText](/telegram/methods/editMessageText) — Edit a previously sent message
- [Formatting guide](/formatting) — `format` helper, HTML, MarkdownV2
- [Keyboards guide](/keyboards/overview) — Inline and reply keyboards
- [Split plugin](/plugins/official/split) — Split long messages automatically
- [Auto-retry plugin](/plugins/official/auto-retry) — Handle rate limits automatically
