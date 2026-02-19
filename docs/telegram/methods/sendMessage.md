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

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent." />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (e.g. `@channelusername`)." />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of the forum. For forum supergroups only." />

<ApiParam name="text" type="String" required :min="1" :max="4096" description="Text of the message to be sent, 1–4096 characters after entities parsing." />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities: `HTML`, `Markdown`, or `MarkdownV2`. See [formatting options](/formatting). Mutually exclusive with `entities`." />

<ApiParam name="entities" type="MessageEntity[]" description="Special entities in message text (bold, italic, links, code...). Mutually exclusive with `parse_mode`. GramIO's `format` helper builds these automatically." />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="Link preview generation options — disable it, customize position, or choose which URL to expand." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message silently. Users receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving." />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass `true` to allow up to 1000 messages per second, ignoring broadcasting limits for a fee." />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added. For private chats only." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to. Replaces the old `reply_to_message_id`." />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options: inline keyboard, custom reply keyboard, remove keyboard instructions, or force reply." />

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

GramIO's `format` tagged template builds **entities** (not `parse_mode`) — type-safe, no escaping needed:

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

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: not enough rights to send text messages` | Bot lacks send permission in the chat |
| 400 | `Bad Request: TEXT_TOO_LONG` | `text` exceeds 4096 characters |
| 400 | `Bad Request: can't parse entities` | Malformed `entities` array or bad `parse_mode` markup |
| 400 | `Bad Request: BUTTON_DATA_INVALID` | Callback data in `reply_markup` is too long or malformed |
| 403 | `Forbidden: bot was blocked by the user` | User has blocked the bot |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` in the response |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Text limit is 4096 characters.** Use the [Split plugin](/plugins/official/split) to split text while preserving formatting entities.
- **`parse_mode` and `entities` are mutually exclusive.** GramIO's `format` helper produces `entities`, don't add `parse_mode` alongside it.
- **`chat_id` accepts `@username` strings** for public groups/channels. Private chats require a numeric ID.
- **Forum topics:** include `message_thread_id` matching the topic ID when sending to a supergroup forum.
- **Cross-chat replies:** `reply_parameters` supports replying to messages in other chats.

## See Also

- [sendPhoto](/telegram/methods/sendPhoto) — Send a photo with optional caption
- [sendDocument](/telegram/methods/sendDocument) — Send any file
- [editMessageText](/telegram/methods/editMessageText) — Edit a previously sent message
- [Formatting guide](/formatting) — `format` helper, HTML, MarkdownV2
- [Keyboards guide](/keyboards/overview) — Inline and reply keyboards
- [Split plugin](/plugins/official/split) — Split long messages automatically
- [Auto-retry plugin](/plugins/official/auto-retry) — Handle rate limits automatically
