---
title: forwardMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Forward a Telegram message to another chat using GramIO. Complete forwardMessage reference with from_chat_id, protect_content, silent mode, forum topic support, and common forwarding patterns.
  - - meta
    - name: keywords
      content: forwardMessage, telegram bot api, forward message telegram bot, gramio forwardMessage, forwardMessage typescript, forwardMessage example, from_chat_id, message_id, disable_notification, protect_content, message_thread_id, telegram bot forward message, how to forward message telegram bot, telegram forwarded from
---

# forwardMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#forwardmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)" />

<ApiParam name="video_start_timestamp" type="Integer" description="New start timestamp for the forwarded video in the message" />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the forwarded message from forwarding and saving" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; only available when forwarding to private chats" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only" />

<ApiParam name="message_id" type="Integer" required description="Message identifier in the chat specified in *from\_chat\_id*" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward every user message to an admin/moderation chat
const ADMIN_CHAT_ID = -1001234567890;

bot.on("message", async (ctx) => {
  await bot.api.forwardMessage({
    chat_id: ADMIN_CHAT_ID,
    from_chat_id: ctx.chatId,
    message_id: ctx.id,
  });
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward a specific message from a channel to another chat
await bot.api.forwardMessage({
  chat_id: -1009876543210,   // destination chat
  from_chat_id: "@sourcechannel",
  message_id: 501,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward silently with protected content (prevents re-forwarding)
await bot.api.forwardMessage({
  chat_id: -1001234567890,
  from_chat_id: -1009876543210,
  message_id: 42,
  disable_notification: true,
  protect_content: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward into a specific forum topic thread
await bot.api.forwardMessage({
  chat_id: -1001234567890,   // forum supergroup
  message_thread_id: 5,      // topic ID
  from_chat_id: "@mychannel",
  message_id: 99,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Target `chat_id` is invalid or the bot is not a member — verify the bot was added to the destination chat |
| 400 | `Bad Request: message to forward not found` | `message_id` doesn't exist in `from_chat_id` — verify both IDs before forwarding |
| 400 | `Bad Request: CHAT_FORWARD_RESTRICT` | The source chat has disabled message forwarding — the content cannot be forwarded from it |
| 400 | `Bad Request: message can't be forwarded` | Message is a service message (join, leave, pin, etc.) — service messages cannot be forwarded |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the target channel — add it first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Forwarded messages show "Forwarded from" attribution.** To forward without showing the original source, use [`copyMessage`](/telegram/methods/copyMessage) instead — it copies the content without attribution.
- **Service messages can't be forwarded.** Join/leave events, pinned message notifications, and similar service messages always fail — use `isServiceMessage()` to filter them out.
- **Messages with `protect_content` can't be forwarded.** If the original message was sent with `protect_content: true`, it's permanently blocked from forwarding.
- **`protect_content` on the forwarded copy is independent.** Setting `protect_content: true` in your `forwardMessage` call prevents recipients from re-forwarding the copy you send.
- **`message_effect_id` only works for private chats.** Reaction effects on forwarded messages are restricted to private conversations — they're silently ignored in groups and channels.
- **`video_start_timestamp` lets you deep-link into video messages.** Specify a second offset to start playback partway through the video when forwarding.
- **Use `message_thread_id` for forum supergroups.** Without it, the message goes to the general/unthreaded area; with it, it lands in the specified topic.

## See Also

- [forwardMessages](/telegram/methods/forwardMessages) — forward multiple messages in a single call (preserves album grouping)
- [copyMessage](/telegram/methods/copyMessage) — copy a message without "Forwarded from" attribution
- [copyMessages](/telegram/methods/copyMessages) — copy multiple messages without attribution
- [Message](/telegram/types/Message) — the full object returned on success
- [MessageOrigin](/telegram/types/MessageOrigin) — origin info available in forwarded message objects
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
