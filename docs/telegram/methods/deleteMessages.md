---
title: deleteMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete multiple Telegram messages simultaneously using GramIO. Batch delete up to 100 messages at once. TypeScript examples, chunking patterns, and missing-ID behavior.
  - - meta
    - name: keywords
      content: deleteMessages, telegram bot api, delete multiple messages telegram, bulk delete telegram bot, gramio deleteMessages, telegram batch delete messages, message_ids, deleteMessages typescript, how to delete multiple telegram messages, telegram bot message cleanup array
---

# deleteMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletemessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages to delete. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete multiple messages at once
await bot.api.deleteMessages({
  chat_id: -1001234567890,
  message_ids: [101, 102, 103],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a range of messages by constructing an ID array
const latestId = 500;
const messageIds = Array.from({ length: 10 }, (_, i) => latestId - i);

await bot.api.deleteMessages({
  chat_id: -1001234567890,
  message_ids: messageIds,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Batch delete more than 100 messages by chunking
async function deleteAllMessages(chatId: number, ids: number[]) {
  for (let i = 0; i < ids.length; i += 100) {
    await bot.api.deleteMessages({
      chat_id: chatId,
      message_ids: ids.slice(i, i + 100),
    });
  }
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Collect and bulk-delete messages from a handler
const collected: number[] = [];

bot.on("message", async (ctx) => {
  collected.push(ctx.id);

  if (collected.length >= 10) {
    await bot.api.deleteMessages({
      chat_id: ctx.chatId,
      message_ids: [...collected],
    });
    collected.length = 0;
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or inaccessible |
| 400 | `Bad Request: too many ids` | `message_ids` has more than 100 entries — chunk into batches of 100 |
| 403 | `Forbidden: not enough rights` | Bot lacks the required admin rights to delete messages in this chat |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the specified channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically when making many rapid deletion calls.
:::

## Tips & Gotchas

- **Missing or already-deleted messages are silently skipped.** Unlike `deleteMessage`, invalid IDs don't cause an error — the method returns `True` and simply skips those IDs. This makes bulk cleanup safe.
- **Maximum 100 messages per call.** Chunk larger arrays into batches of 100 and call sequentially. See the `deleteAllMessages` example above.
- **All `deleteMessage` limitations apply — silently.** Messages older than 48 hours, non-deletable service messages, etc. are skipped without error, not rejected. The call still returns `True`.
- **Always prefer `deleteMessages` over looping `deleteMessage`.** A single `deleteMessages` call for multiple IDs is far more efficient than a loop — fewer API calls and significantly lower risk of hitting rate limits.
- **IDs must all be from the same chat.** You cannot mix message IDs from different chats in one call. Group by `chat_id` before calling.

## See Also

- [deleteMessage](/telegram/methods/deleteMessage) — delete a single message with full error detail
- [deleteBusinessMessages](/telegram/methods/deleteBusinessMessages) — bulk delete for business accounts
- [Message](/telegram/types/Message) — the message object type
