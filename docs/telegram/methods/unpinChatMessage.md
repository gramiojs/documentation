---
title: unpinChatMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Remove a pinned message from a Telegram chat using GramIO. Learn message_id behavior, business connection support, admin rights by chat type, and TypeScript examples.
  - - meta
    - name: keywords
      content: unpinChatMessage, telegram bot api, gramio unpinChatMessage, unpin message telegram, remove pinned message, can_pin_messages, can_edit_messages, business_connection_id, message_id, typescript unpinChatMessage example, how to unpin message telegram bot
---

# unpinChatMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unpinchatmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can\_pin\_messages' right or the 'can\_edit\_messages' right to unpin messages in groups and channels respectively. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be unpinned" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Identifier of the message to unpin. Required if *business\_connection\_id* is specified. If not specified, the most recent pinned message (by sending date) will be unpinned." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Unpin the most recently pinned message (no `message_id` needed):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("unpin", async (ctx) => {
  // Unpins the most recently pinned message in this chat
  await bot.api.unpinChatMessage({
    chat_id: ctx.chat.id,
  });

  await ctx.send("Most recent pinned message has been unpinned.");
});
```

Unpin a specific message by its ID:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("unpin", async (ctx) => {
  const targetMessageId = ctx.replyToMessage?.id;
  if (!targetMessageId) {
    return ctx.reply("Reply to the pinned message you want to unpin.");
  }

  await bot.api.unpinChatMessage({
    chat_id: ctx.chat.id,
    message_id: targetMessageId,
  });

  await ctx.send("Message unpinned.");
});
```

Unpin a message in a channel by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function unpinChannelMessage(messageId: number) {
  await bot.api.unpinChatMessage({
    chat_id: "@mychannel",
    message_id: messageId,
  });
}
```

Unpin via a business connection (requires `message_id`):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("business_message", async (ctx) => {
  // When acting via a business connection, message_id is required
  await bot.api.unpinChatMessage({
    business_connection_id: ctx.businessConnectionId,
    chat_id: ctx.chat.id,
    message_id: ctx.id,
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid, the bot is not in the chat, or the chat no longer exists |
| 400 | `Bad Request: message to unpin not found` | `message_id` does not correspond to a currently pinned message or does not exist |
| 400 | `Bad Request: not enough rights to unpin messages` | Bot lacks `can_pin_messages` (groups/supergroups) or `can_edit_messages` (channels) |
| 400 | `Bad Request: MESSAGE_ID_REQUIRED` | `business_connection_id` was provided but `message_id` was omitted — business unpins require a specific message |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in the chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Omitting `message_id` unpins the most recently pinned message by sending date.** This is useful for a simple `/unpin` command, but be careful in chats with multiple pins — you may unpin the wrong one.
- **`message_id` is required when using `business_connection_id`.** Business connection unpins always need an explicit target message.
- **Required rights differ by chat type.** Groups/supergroups need `can_pin_messages`; channels need `can_edit_messages`; private chats and channel direct messages need no special rights.
- **To remove all pins at once, use `unpinAllChatMessages`.** For forum topics, use `unpinAllForumTopicMessages`.
- **`message_id` should be the pinned message's own ID.** If you pass the ID of a message that is not currently pinned, you'll receive a `message to unpin not found` error.
- **Business bots must pass the `business_connection_id`.** When operating under a business connection, all admin-level actions require identifying the connection via this parameter.

## See Also

- [`pinChatMessage`](/telegram/methods/pinChatMessage) — Pin a message in a chat
- [`unpinAllChatMessages`](/telegram/methods/unpinAllChatMessages) — Clear all pinned messages in a chat at once
- [`unpinAllForumTopicMessages`](/telegram/methods/unpinAllForumTopicMessages) — Clear all pins inside a forum topic
- [`getChatMember`](/telegram/methods/getChatMember) — Verify the bot's admin rights before unpinning
- [`getBusinessConnection`](/telegram/methods/getBusinessConnection) — Retrieve business connection details for business bots
