---
title: deleteBusinessMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete messages on behalf of a business account using GramIO. Bulk deletion of 1–100 messages with business bot rights. TypeScript examples and permission guide.
  - - meta
    - name: keywords
      content: deleteBusinessMessages, telegram bot api, delete business messages telegram, gramio deleteBusinessMessages, business bot delete messages, business_connection_id, can_delete_sent_messages, can_delete_all_messages, telegram business bot typescript, bulk delete business chat
---

# deleteBusinessMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletebusinessmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Delete messages on behalf of a business account. Requires the *can\_delete\_sent\_messages* business bot right to delete messages sent by the bot itself, or the *can\_delete\_all\_messages* business bot right to delete any message. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which to delete the messages" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a single business message
await bot.api.deleteBusinessMessages({
  business_connection_id: "BUSINESS_CONNECTION_ID",
  message_ids: [101],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete multiple messages in bulk (up to 100 at once)
await bot.api.deleteBusinessMessages({
  business_connection_id: "BUSINESS_CONNECTION_ID",
  message_ids: [101, 102, 103, 104, 105],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Chunk deletions when more than 100 messages need to be removed
async function deleteBusinessMessagesBatch(
  connectionId: string,
  ids: number[],
) {
  for (let i = 0; i < ids.length; i += 100) {
    await bot.api.deleteBusinessMessages({
      business_connection_id: connectionId,
      message_ids: ids.slice(i, i + 100),
    });
  }
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | `business_connection_id` is invalid or expired — re-fetch via `getBusinessConnection` |
| 400 | `Bad Request: message not found` | One or more `message_ids` don't exist; all IDs must be from the same chat |
| 400 | `Bad Request: too many ids` | `message_ids` has more than 100 entries — chunk into batches of 100 |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_delete_sent_messages` or `can_delete_all_messages` business bot right |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Two distinct rights with different scopes.** `can_delete_sent_messages` only allows deleting messages sent by the bot itself. `can_delete_all_messages` lets the bot delete any message in the business chat. Request the minimal permission that satisfies your use case.
- **All messages must be from the same chat.** Attempting to delete messages from different chats in a single call will fail. Group `message_ids` by chat before calling.
- **Maximum 100 messages per call.** For larger datasets, chunk the IDs array and call sequentially. See the batch example above.
- **Same 48-hour limit as `deleteMessage` applies.** Messages older than 48 hours generally cannot be deleted. These IDs are not silently skipped — the call may fail.
- **`business_connection_id` is per-user per-bot.** Store it when you first receive a `business_connection` update and reuse it for all subsequent operations on that connection.

## See Also

- [deleteMessage](/telegram/methods/deleteMessage) — delete a single message in a regular chat
- [deleteMessages](/telegram/methods/deleteMessages) — bulk delete in regular chats
- [getBusinessConnection](/telegram/methods/getBusinessConnection) — retrieve business connection details
- [BusinessConnection](/telegram/types/BusinessConnection) — the connection object type
