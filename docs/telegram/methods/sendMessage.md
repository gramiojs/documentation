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
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send text messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="text" type="String" required description="Text of the message to be sent, 1-4096 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" required description="Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" required description="A JSON-serialized list of special entities that appear in message text, which can be specified instead of _parse\_mode_" />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" required description="Link preview generation options for the message" />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" required description="Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" required description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" required description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" required description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, String is returned.
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
