---
title: forwardMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Forward multiple Telegram messages at once using GramIO. Complete forwardMessages reference with message_ids array, album grouping preservation, silent mode, and bulk forwarding patterns.
  - - meta
    - name: keywords
      content: forwardMessages, telegram bot api, forward multiple messages telegram bot, gramio forwardMessages, forwardMessages typescript, forwardMessages example, message_ids, from_chat_id, bulk forward telegram, how to forward multiple messages telegram bot, telegram forward album, forwardMessages batch, MessageId
---

# forwardMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/MessageId">MessageId[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#forwardmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of [MessageId](https://core.telegram.org/bots/api#messageid) of the sent messages is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages in the chat *from\_chat\_id* to forward. The identifiers must be specified in a strictly increasing order." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the forwarded messages from forwarding and saving" />

## Returns

On success, an array of [MessageId](/telegram/types/MessageId) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward a batch of messages from one chat to another
const forwarded = await bot.api.forwardMessages({
  chat_id: -1009876543210,   // destination
  from_chat_id: "@sourcechannel",
  message_ids: [101, 102, 103, 104, 105],
});
console.log(`Forwarded ${forwarded.length} messages`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward an album — grouping is automatically preserved
await bot.api.forwardMessages({
  chat_id: -1001234567890,
  from_chat_id: -1009876543210,
  message_ids: [200, 201, 202], // album message IDs in order
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Bulk-forward silently with protected content
await bot.api.forwardMessages({
  chat_id: -1001234567890,
  from_chat_id: "@newsarchive",
  message_ids: [300, 301, 302, 303],
  disable_notification: true,
  protect_content: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Forward the last 10 messages from a channel to a forum topic
const latestIds = [990, 991, 992, 993, 994, 995, 996, 997, 998, 999];

await bot.api.forwardMessages({
  chat_id: -1001234567890,   // forum supergroup
  message_thread_id: 12,     // topic ID
  from_chat_id: "@mychannel",
  message_ids: latestIds,    // already in increasing order
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Target `chat_id` is invalid or the bot is not a member — verify the bot was added to the destination |
| 400 | `Bad Request: MESSAGE_IDS_INVALID` | `message_ids` are not in strictly increasing order — sort the array before passing it |
| 400 | `Bad Request: CHAT_FORWARD_RESTRICT` | The source chat has disabled message forwarding — none of the messages can be forwarded from it |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the target channel — add it first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`message_ids` must be in strictly increasing order.** Passing IDs out of order returns an error — always call `.sort((a, b) => a - b)` before passing a dynamically-built array.
- **Maximum 100 message IDs per call.** For larger batches, chunk the array into groups of 100 and forward sequentially to avoid errors.
- **Unfound or unforwardable messages are silently skipped.** The API doesn't throw an error if some IDs are invalid — it skips them and returns only the IDs of successfully forwarded messages. The returned array may be shorter than `message_ids`.
- **Album groupings are preserved.** If the original messages form an album (multiple photos/videos sent together), the forwarded copies maintain the same grouping in the destination.
- **Returns `MessageId[]`, not `Message[]`.** The response only contains `{ message_id: number }` objects — you don't get full message content back. Use `forwardMessage` (singular) if you need the full `Message` response.
- **Forward without attribution using `copyMessages`.** Like `forwardMessage`, this method shows "Forwarded from" headers. Use [`copyMessages`](/telegram/methods/copyMessages) to copy content without attribution.
- **Use `message_thread_id` for forum supergroups.** Without it, all messages land in the general/unthreaded area of the group.

## See Also

- [forwardMessage](/telegram/methods/forwardMessage) — forward a single message (returns full `Message` object)
- [copyMessage](/telegram/methods/copyMessage) — copy a single message without "Forwarded from" attribution
- [copyMessages](/telegram/methods/copyMessages) — copy multiple messages without attribution
- [MessageId](/telegram/types/MessageId) — the lightweight object returned in the response array
- [Message](/telegram/types/Message) — the full message object (returned by single-message variants)
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
