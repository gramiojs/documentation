---
title: deleteMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a Telegram message using GramIO. ctx.delete() shorthand, 48-hour limit, admin rights guide, and TypeScript examples for bots, groups, and channels.
  - - meta
    - name: keywords
      content: deleteMessage, telegram bot api, delete message telegram bot, gramio deleteMessage, ctx.delete gramio, telegram bot delete message, 48 hour message limit, can_delete_messages, chat_id, message_id, how to delete telegram message bot, deleteMessage typescript example
---

# deleteMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletemessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a message, including service messages, with the following limitations:  
\- A message can only be deleted if it was sent less than 48 hours ago.  
\- Service messages about a supergroup, channel, or forum topic creation can't be deleted.  
\- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.  
\- Bots can delete outgoing messages in private chats, groups, and supergroups.  
\- Bots can delete incoming messages in private chats.  
\- Bots granted *can\_post\_messages* permissions can delete outgoing messages in channels.  
\- If the bot is an administrator of a group, it can delete any message there.  
\- If the bot has *can\_delete\_messages* administrator right in a supergroup or a channel, it can delete any message there.  
\- If the bot has *can\_manage\_direct\_messages* administrator right in a channel, it can delete any message in the corresponding direct messages chat.  
Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the message to delete" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete the incoming message using ctx shorthand
bot.on("message", async (ctx) => {
  await ctx.delete();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a specific message by ID
await bot.api.deleteMessage({
  chat_id: -1001234567890,
  message_id: 456,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete the command message that triggered the handler
bot.command("clean", async (ctx) => {
  await ctx.delete(); // removes the /clean command message
  await ctx.send("Done! Command message removed.");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a message in a channel by username
await bot.api.deleteMessage({
  chat_id: "@mychannel",
  message_id: 789,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to the chat |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist or the message was already deleted |
| 400 | `Bad Request: message can't be deleted` | Message is older than 48 hours, or is a non-deletable service message (supergroup/channel/forum creation) |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — cannot delete messages in their private chat |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_delete_messages` in a supergroup/channel, or isn't an admin in a group |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the specified channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **48-hour hard limit with no exceptions.** Messages older than 48 hours cannot be deleted by bots regardless of admin rights. If cleanup timing matters, act early.
- **Dice messages in private chats have an inverse 24-hour constraint.** A dice result can only be deleted *after* 24 hours (not before) — this prevents result gaming.
- **Service messages for supergroup/channel/forum creation are permanent.** These system messages cannot be deleted by any method.
- **`ctx.delete()` is the GramIO shorthand.** Inside a handler, `ctx.delete()` deletes the triggering message without needing explicit `chat_id` and `message_id`.
- **For bulk deletion use `deleteMessages`.** If you need to remove multiple messages, `deleteMessages` is more efficient than looping `deleteMessage` — it reduces API calls and avoids rate limits.
- **Group admins can delete any message.** If the bot is a group administrator (not just supergroup), it can delete messages from any member — no separate `can_delete_messages` right needed.

## See Also

- [deleteMessages](/telegram/methods/deleteMessages) — delete up to 100 messages at once
- [deleteBusinessMessages](/telegram/methods/deleteBusinessMessages) — delete messages on behalf of a business account
- [Message](/telegram/types/Message) — the message object type
