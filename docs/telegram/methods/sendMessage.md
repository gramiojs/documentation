---
title: sendMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send text messages via the Telegram Bot API using GramIO. Complete parameter reference with TypeScript examples, parse_mode, entities, reply_markup, and formatting options.
  - - meta
    - name: keywords
      content: sendMessage, telegram bot api, send message telegram, telegram send text, gramio sendMessage, bot send message, parse_mode, reply_markup
---

# sendMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send text messages. On success, the sent [Message](/telegram/types/Message) is returned.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `business_connection_id` | `String` | — | — | Unique identifier of the business connection on behalf of which the message will be sent |
| `chat_id` | `Integer \| String` | **Yes** | — | Unique identifier for the target chat or username of the target channel (e.g. `@channelusername`) |
| `message_thread_id` | `Integer` | — | — | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| `text` | `String` | **Yes** | — | Text of the message to be sent, 1-4096 characters after entities parsing |
| `parse_mode` | `String` | — | — | Mode for parsing entities in the message text. See [formatting options](/formatting) |
| `entities` | [`MessageEntity[]`](/telegram/types/MessageEntity) | — | — | Special entities that appear in message text. Alternatively, use `parse_mode` |
| `link_preview_options` | [`LinkPreviewOptions`](/telegram/types/LinkPreviewOptions) | — | — | Link preview generation options for the message |
| `disable_notification` | `Boolean` | — | — | Sends the message silently. Users will receive a notification with no sound |
| `protect_content` | `Boolean` | — | — | Protects the contents of the sent message from forwarding and saving |
| `allow_paid_broadcast` | `Boolean` | — | — | Pass `true` to allow up to 1000 messages per second, ignoring broadcasting limits |
| `message_effect_id` | `String` | — | — | Unique identifier of the message effect to be added to the message |
| `reply_parameters` | [`ReplyParameters`](/telegram/types/ReplyParameters) | — | — | Description of the message to reply to |
| `reply_markup` | [`InlineKeyboardMarkup`](/telegram/types/InlineKeyboardMarkup) \| [`ReplyKeyboardMarkup`](/telegram/types/ReplyKeyboardMarkup) \| [`ReplyKeyboardRemove`](/telegram/types/ReplyKeyboardRemove) \| [`ForceReply`](/telegram/types/ForceReply) | — | — | Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user |

## Returns

On success, the sent [Message](/telegram/types/Message) is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
// The simplest way — via context
bot.command("start", (ctx) => ctx.send("Hello! 👋"));

// With formatting
import { format, bold, italic } from "gramio";

bot.command("about", (ctx) =>
  ctx.send(format`Welcome, ${bold(ctx.from.first_name)}!`, {
    parse_mode: "HTML",
  })
);

// Direct API call
await bot.api.sendMessage({
  chat_id: 123456789,
  text: "Hello from the API!",
});

// Reply to a specific message
bot.on("message", (ctx) =>
  ctx.reply("Got your message!")  // shorthand for reply_parameters
);

// Silent message (no notification sound)
await bot.api.sendMessage({
  chat_id: ctx.chat.id,
  text: "This message is silent",
  disable_notification: true,
});

// With inline keyboard
import { InlineKeyboard } from "gramio";

bot.command("menu", (ctx) =>
  ctx.send("Choose an option:", {
    reply_markup: new InlineKeyboard()
      .text("Option A", "option_a")
      .text("Option B", "option_b"),
  })
);
```

## Tips & Gotchas

- **Text limit is 4096 characters.** For longer messages, use the [Split plugin](/plugins/official/split) which automatically splits text while preserving formatting.
- **`parse_mode` and `entities` are mutually exclusive.** Don't use both — prefer `entities` when you have pre-computed entity positions, or `parse_mode` with the GramIO `format` helper otherwise.
- **`chat_id` accepts both integers and `@username` strings** for public groups and channels. For private chats it must be the numeric ID.
- **Replying with `reply_parameters`** allows you to reply in a different chat from the original message — useful for cross-posting.
- When sending to a **forum topic**, include `message_thread_id` matching the topic.

## See Also

- [sendPhoto](/telegram/methods/sendPhoto) — Send a photo with optional caption
- [sendDocument](/telegram/methods/sendDocument) — Send any file
- [sendMediaGroup](/telegram/methods/sendMediaGroup) — Send multiple media as an album
- [editMessageText](/telegram/methods/editMessageText) — Edit a previously sent message
- [Formatting guide](/formatting) — HTML, MarkdownV2, and the GramIO `format` helper
- [Keyboards guide](/keyboards/overview) — Inline and reply keyboards
- [Split plugin](/plugins/official/split) — Split long messages automatically
