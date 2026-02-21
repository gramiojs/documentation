---
title: pinChatMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Pin a message in a Telegram chat using GramIO and TypeScript. Learn required bot rights, disable_notification flag, and business connection support.
  - - meta
    - name: keywords
      content: pinChatMessage, telegram bot api, gramio pinChatMessage, pinChatMessage typescript, pinChatMessage example, pin message, disable_notification, can_pin_messages, can_edit_messages, business_connection_id, chat pin
---

# pinChatMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#pinchatmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can\_pin\_messages' right or the 'can\_edit\_messages' right to pin messages in groups and channels respectively. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be pinned" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of a message to pin" />

<ApiParam name="disable_notification" type="Boolean" description="Pass *True* if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Pin a message from an incoming update using the context shorthand:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  // Pin the incoming message itself
  await bot.api.pinChatMessage({
    chat_id: ctx.chat.id,
    message_id: ctx.id,
    disable_notification: true,
  });

  await ctx.send("Message pinned silently!");
});
```

Pin a message in a group when a command is issued, then confirm:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("pin", async (ctx) => {
  // Pin the command message itself in the current group
  const success = await bot.api.pinChatMessage({
    chat_id: ctx.chat.id,
    message_id: ctx.id,
  });

  if (success) {
    await ctx.send("📌 Message pinned!");
  }
});
```

Pin a message in a channel by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function pinInChannel(messageId: number) {
  await bot.api.pinChatMessage({
    chat_id: "@mychannel",
    message_id: messageId,
    disable_notification: true,
  });
}
```

Pin a message via a business connection (business bots):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("business_message", async (ctx) => {
  await bot.api.pinChatMessage({
    business_connection_id: ctx.businessConnectionId,
    chat_id: ctx.chat.id,
    message_id: ctx.id,
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the chat does not exist, or the bot is not a member of the chat. |
| 400 | `Bad Request: message to pin not found` | The `message_id` does not correspond to an existing message in the chat. |
| 400 | `Bad Request: not enough rights to pin a message` | The bot lacks `can_pin_messages` (supergroups) or `can_edit_messages` (channels) administrator right. |
| 400 | `Bad Request: method is available for supergroup and channel chats only` | You attempted to pin in a chat type that does not support pinning (e.g., bot-to-user private chats without both sides agreeing). |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot; cannot interact with the chat. |
| 403 | `Forbidden: not enough rights` | The bot is not an administrator or is missing the required rights. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Wait `N` seconds before retrying. Use the `auto-retry` plugin to handle this automatically. |

## Tips & Gotchas

- **Rights differ by chat type.** In supergroups the bot needs `can_pin_messages`; in channels it needs `can_edit_messages`. Verify admin rights with `getChatMember` before attempting to pin if you want to handle this gracefully.
- **`disable_notification` is always `true` in channels and private chats.** The parameter is silently ignored for those chat types regardless of what you pass — only group and supergroup members receive pin notifications.
- **Private chats allow pinning all non-service messages.** Unlike groups and channels, no special bot right is required in a one-on-one conversation where the bot is a participant.
- **Business connection pinning.** When acting via a business connection, the `business_connection_id` identifies which managed account performs the action. The account itself must have permission to pin in the relevant chat.
- **Only one message is "prominently" pinned at a time.** The API supports multiple pinned messages in supergroups, but the notification shown to members highlights the latest one. Repeated `pinChatMessage` calls stack pinned messages without removing older ones — use `unpinChatMessage` to remove specific ones.
- **Service messages cannot be pinned.** Attempting to pin a join/leave/system message will return a 400 error.

## See Also

- [unpinChatMessage](/telegram/methods/unpinChatMessage) — Remove a specific pinned message
- [unpinAllChatMessages](/telegram/methods/unpinAllChatMessages) — Clear all pinned messages at once
- [getChatMember](/telegram/methods/getChatMember) — Check bot's current admin rights before pinning
- [getBusinessConnection](/telegram/methods/getBusinessConnection) — Retrieve business connection details
- [plugins/official/auto-retry](/plugins/official/auto-retry) — Automatically handle flood-control errors
