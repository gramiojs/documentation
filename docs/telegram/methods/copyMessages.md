---
title: copyMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Copy multiple Telegram messages to another chat in bulk using GramIO. Supports 1–100 messages per call with album grouping preserved. TypeScript examples included.
  - - meta
    - name: keywords
      content: copyMessages, telegram bot api, copy multiple messages telegram bot, bulk copy messages, gramio copyMessages, telegram copy messages, message_ids, from_chat_id, remove_caption, copyMessages typescript, copyMessages example, how to bulk copy telegram bot
---

# copyMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#copymessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz [poll](https://core.telegram.org/bots/api#poll) can be copied only if the value of the field _correct\_option\_id_ is known to the bot. The method is analogous to the method [forwardMessages](https://core.telegram.org/bots/api#forwardmessages), but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of [MessageId](https://core.telegram.org/bots/api#messageid) of the sent messages is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages in the chat _from\_chat\_id_ to copy. The identifiers must be specified in a strictly increasing order." />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent messages from forwarding and saving" />

<ApiParam name="remove_caption" type="Boolean" required description="Pass _True_ to copy the messages without their captions" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy a batch of messages from one chat to another (no attribution)
const results = await bot.api.copyMessages({
  chat_id: -1001234567890,
  from_chat_id: "@sourcechannel",
  message_ids: [10, 11, 12, 13, 14],
});

console.log(
  "Copied message IDs:",
  results.map((r) => r.message_id)
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy messages silently without their captions
await bot.api.copyMessages({
  chat_id: -1001234567890,
  from_chat_id: -1009876543210,
  message_ids: [20, 21, 22],
  disable_notification: true,
  remove_caption: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through message IDs and copy in batches of 100
async function copyMessageRange(
  fromChatId: number,
  toChatId: number,
  startId: number,
  endId: number
) {
  const batchSize = 100;
  const allIds = Array.from(
    { length: endId - startId + 1 },
    (_, i) => startId + i
  );

  for (let i = 0; i < allIds.length; i += batchSize) {
    const batch = allIds.slice(i, i + batchSize);

    await bot.api.copyMessages({
      chat_id: toChatId,
      from_chat_id: fromChatId,
      message_ids: batch,
    });
  }
}

await copyMessageRange(-1009876543210, -1001234567890, 100, 350);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Copy messages to a forum topic thread
await bot.api.copyMessages({
  chat_id: -1001234567890,
  message_thread_id: 456, // target forum topic
  from_chat_id: "@sourcechannel",
  message_ids: [30, 31, 32],
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` or `from_chat_id` is invalid or inaccessible to the bot |
| 400 | `Bad Request: message IDs must be in strictly increasing order` | `message_ids` array is not sorted in ascending order |
| 400 | `Bad Request: too many messages` | `message_ids` contains more than 100 identifiers |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot lacks access to the target channel |
| 403 | `Forbidden: not enough rights` | Bot does not have permission to post in the target chat |
| 429 | `Too Many Requests: retry after N` | Rate limit exceeded — respect `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` rate limit errors automatically when copying large message batches.
:::

## Tips & Gotchas

- **`message_ids` must be in strictly increasing order.** If your IDs aren't sorted, sort them first with `.sort((a, b) => a - b)` — the API will reject unsorted arrays with a 400 error.
- **Maximum 100 IDs per call.** For larger ranges, split into chunks of 100 and call `copyMessages` in sequence. Sending more than 100 IDs at once results in an error.
- **Uncopyable messages are silently skipped.** Service messages, invoice messages, paid media, giveaway messages, and protected-content messages are skipped without error — the returned array will be shorter than your input.
- **Album grouping is preserved.** If consecutive message IDs belong to a media album (group of photos/videos), they are copied as a group, maintaining the album layout.
- **No forwarding attribution.** Unlike [`forwardMessages`](/telegram/methods/forwardMessages), copied messages have no "Forwarded from" header — ideal for relaying content without revealing the source.
- **`remove_caption: true` strips all captions.** There's no per-message caption override in bulk mode — to set custom captions, use individual [`copyMessage`](/telegram/methods/copyMessage) calls.
- **Rate limits apply per chat.** Telegram enforces message rate limits per target chat. When broadcasting to many chats, consider using `allow_paid_broadcast` (on `copyMessage`) or the auto-retry plugin.

## See Also

- [`copyMessage`](/telegram/methods/copyMessage) — copy a single message with caption override and keyboard support
- [`forwardMessages`](/telegram/methods/forwardMessages) — forward multiple messages with source attribution
- [`forwardMessage`](/telegram/methods/forwardMessage) — forward a single message
- [`MessageId`](/telegram/types/MessageId) — the returned type for each copied message
- [Auto-retry plugin](/plugins/official/auto-retry) — handle rate limits automatically
