---
title: copyMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Copy any Telegram message to another chat using GramIO without a forwarding link. Override caption, add reply markup, and control notifications. TypeScript examples included.
  - - meta
    - name: keywords
      content: copyMessage, telegram bot api, copy message telegram bot, gramio copyMessage, telegram copy message, forward without attribution, from_chat_id, message_id, caption override, copyMessage typescript, copyMessage example, telegram bot copy forward, how to copy message telegram bot
---

# copyMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/MessageId">MessageId</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#copymessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz [poll](https://core.telegram.org/bots/api#poll) can be copied only if the value of the field *correct\_option\_id* is known to the bot. The method is analogous to the method [forwardMessage](https://core.telegram.org/bots/api#forwardmessage), but the copied message doesn't have a link to the original message. Returns the [MessageId](https://core.telegram.org/bots/api#messageid) of the sent message on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Message identifier in the chat specified in *from\_chat\_id*" />

<ApiParam name="video_start_timestamp" type="Integer" description="New start timestamp for the copied video in the message" />

<ApiParam name="caption" type="String" description="New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept" :minLen="0" :maxLen="1024" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the new caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True*, if the caption must be shown above the message media. Ignored if a new caption isn't specified." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; only available when copying to private chats" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, the [MessageId](/telegram/types/MessageId) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy a message from one chat to another (no forwarding attribution)
const result = await bot.api.copyMessage({
  chat_id: -1001234567890,
  from_chat_id: "@sourcechannel",
  message_id: 42,
});

console.log("Copied message ID:", result.message_id);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy a message from context (e.g., relay a user message to an admin group)
bot.on("message", async (ctx) => {
  await bot.api.copyMessage({
    chat_id: -1009876543210, // admin group
    from_chat_id: ctx.chatId,
    message_id: ctx.id,
  });
});
```

```ts twoslash
import { Bot, format, bold, italic } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy a media message and replace its caption using GramIO format helpers
await bot.api.copyMessage({
  chat_id: -1001234567890,
  from_chat_id: "@sourcechannel",
  message_id: 100,
  caption: format`${bold("New Title")} — ${italic("Updated caption")}`,
});
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy a message and attach an inline keyboard
await bot.api.copyMessage({
  chat_id: -1001234567890,
  from_chat_id: "@sourcechannel",
  message_id: 55,
  reply_markup: new InlineKeyboard().text("Open original", "open_55"),
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Silent copy (no notification sound) with content protection
await bot.api.copyMessage({
  chat_id: -1001234567890,
  from_chat_id: -1009876543210,
  message_id: 77,
  disable_notification: true,
  protect_content: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` or `from_chat_id` is invalid or the bot has no access |
| 400 | `Bad Request: message not found` | `message_id` does not exist in `from_chat_id` |
| 400 | `Bad Request: can't copy this type of message` | Attempted to copy a service message, invoice, paid media, giveaway, or giveaway winners message |
| 400 | `Bad Request: message is protected` | The source message has `protect_content` enabled and cannot be copied |
| 400 | `Bad Request: wrong quiz correct_option_id` | Quiz poll copied without correct `correct_option_id` being known to the bot |
| 400 | `Bad Request: caption too long` | `caption` exceeds 1024 characters |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the target channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically when broadcasting messages to many users.
:::

## Tips & Gotchas

- **No forwarding attribution.** Unlike [`forwardMessage`](/telegram/methods/forwardMessage), the copied message shows no "Forwarded from" header. Use this when you want to relay content without revealing the source.
- **Caption override is optional.** If you omit `caption`, the original caption is preserved. Pass an empty string `""` to remove the caption entirely.
- **`parse_mode` and `caption_entities` are mutually exclusive.** GramIO's `format` helper always produces `caption_entities`, so never pass `parse_mode` alongside it.
- **Service messages cannot be copied.** This includes join/leave notifications, pinned message notices, invoice messages, and others. Copy only regular text/media messages.
- **Quiz polls need `correct_option_id`.** A bot can only copy a quiz poll if it knows the correct option. If the bot never saw the answer, it cannot copy a quiz.
- **`protect_content` on source blocks copying.** If the original message has content protection, `copyMessage` will fail with a 400 error.
- **For bulk copying, use [`copyMessages`](/telegram/methods/copyMessages).** It supports 1–100 message IDs in a single call and preserves media album grouping.

## See Also

- [`copyMessages`](/telegram/methods/copyMessages) — copy multiple messages in one call, preserving album groups
- [`forwardMessage`](/telegram/methods/forwardMessage) — forward a message with source attribution
- [`forwardMessages`](/telegram/methods/forwardMessages) — forward multiple messages at once
- [`MessageId`](/telegram/types/MessageId) — the returned type
- [Formatting guide](/formatting) — using `format`, `bold`, `italic` for captions
- [Keyboards guide](/keyboards/overview) — adding `reply_markup` to copied messages
- [Auto-retry plugin](/plugins/official/auto-retry) — handle rate limits automatically
