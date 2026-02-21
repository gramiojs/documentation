---
title: readBusinessMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Mark an incoming business message as read using GramIO and TypeScript. Learn can_read_messages right, 24-hour chat activity window, and business connection integration.
  - - meta
    - name: keywords
      content: readBusinessMessage, telegram bot api, gramio readBusinessMessage, readBusinessMessage typescript, readBusinessMessage example, business message read receipt, can_read_messages, business connection, mark message read
---

# readBusinessMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#readbusinessmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Marks incoming message as read on behalf of a business account. Requires the *can\_read\_messages* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which to read the message" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours." />

<ApiParam name="message_id" type="Integer" required description="Unique identifier of the message to mark as read" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Mark every incoming business message as read automatically:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("business_message", async (ctx) => {
  await bot.api.readBusinessMessage({
    business_connection_id: ctx.businessConnectionId,
    chat_id: ctx.chat.id,
    message_id: ctx.id,
  });
});
```

Mark a message as read only after the bot has processed and replied to it:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("business_message", async (ctx) => {
  // Process the message first
  if (ctx.text) {
    await bot.api.sendMessage({
      business_connection_id: ctx.businessConnectionId,
      chat_id: ctx.chat.id,
      text: `Echo: ${ctx.text}`,
    });
  }

  // Mark as read after handling
  await bot.api.readBusinessMessage({
    business_connection_id: ctx.businessConnectionId,
    chat_id: ctx.chat.id,
    message_id: ctx.id,
  });
});
```

Mark a specific message as read by ID (e.g., after a delayed workflow):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function markRead(
  businessConnectionId: string,
  chatId: number,
  messageId: number
) {
  return bot.api.readBusinessMessage({
    business_connection_id: businessConnectionId,
    chat_id: chatId,
    message_id: messageId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the business connection no longer exists. |
| 400 | `Bad Request: chat not found` | The `chat_id` does not correspond to an existing or accessible chat. |
| 400 | `Bad Request: message not found` | The `message_id` does not exist in the specified chat. |
| 400 | `Bad Request: chat is not active` | The chat has not been active in the last 24 hours. Messages in inactive chats cannot be marked as read via this method. |
| 403 | `Forbidden: not enough rights` | The business bot connection does not have the `can_read_messages` right. |
| 403 | `Forbidden: bot was blocked by the user` | The user has blocked the bot. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Wait `N` seconds before retrying. |

## Tips & Gotchas

- **`can_read_messages` right is required.** This is a business-specific bot right distinct from standard chat permissions. Ensure it is enabled in BotFather's business bot settings, and verify it via `getBusinessConnection` if needed.
- **24-hour activity window.** The chat must have been active in the last 24 hours. If the last message in the chat is older, this call will return a 400 error. There is no way to retroactively mark messages in inactive chats.
- **`chat_id` is always an `Integer` here.** Unlike many other methods, `readBusinessMessage` accepts only numeric chat IDs — not `@username` strings. Use `ctx.chat.id` directly from the business message context.
- **Order matters if you need delivery confirmations.** Call `readBusinessMessage` only after you are sure your bot has fully processed the message. Marking a message as read before processing it may signal to the customer that their query was handled even if your bot subsequently fails.
- **Business messages arrive via the `business_message` update type.** Make sure `allowed_updates` includes `"business_message"` in your webhook or `getUpdates` configuration, otherwise you will never receive the messages to mark as read.

## See Also

- [getBusinessConnection](/telegram/methods/getBusinessConnection) — Retrieve business connection details and check granted rights
- [deleteBusinessMessages](/telegram/methods/deleteBusinessMessages) — Delete messages in a business chat
- [sendMessage](/telegram/methods/sendMessage) — Reply to a business message (pass `business_connection_id`)
