---
title: unpinAllChatMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Clear all pinned messages in a Telegram chat using GramIO. Learn bot rights required by chat type, TypeScript examples, and tips for managing pinned messages.
  - - meta
    - name: keywords
      content: unpinAllChatMessages, telegram bot api, gramio unpinAllChatMessages, unpin all messages telegram, clear pinned messages telegram, can_pin_messages, can_edit_messages, typescript unpinAllChatMessages example, how to unpin all messages telegram bot
---

# unpinAllChatMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unpinallchatmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can\_pin\_messages' right or the 'can\_edit\_messages' right to unpin all pinned messages in groups and channels respectively. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Clear all pinned messages from a command handler:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("clearpin", async (ctx) => {
  await bot.api.unpinAllChatMessages({
    chat_id: ctx.chat.id,
  });

  await ctx.send("All pinned messages have been cleared.");
});
```

Unpin all messages in a channel by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function clearChannelPins(channelUsername: string) {
  await bot.api.unpinAllChatMessages({
    chat_id: `@${channelUsername}`,
  });
}
```

Safely clear pins with error handling for missing rights:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("clearpin", async (ctx) => {
  try {
    await bot.api.unpinAllChatMessages({
      chat_id: ctx.chat.id,
    });
    await ctx.send("All pinned messages cleared.");
  } catch (error) {
    await ctx.send(
      "Could not clear pins — make sure I have the right admin permissions."
    );
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: not enough rights to unpin messages` | Bot lacks `can_pin_messages` (groups/supergroups) or `can_edit_messages` (channels) |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in the chat — promote it first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Required rights differ by chat type.** In groups and supergroups, the bot needs `can_pin_messages`. In channels it needs `can_edit_messages`. In private chats and channel direct messages chats, no rights are needed.
- **This is irreversible.** All pinned messages are removed at once with no undo. If you only want to remove one, use `unpinChatMessage` with a specific `message_id`.
- **Messages themselves are not deleted.** Unpinning removes messages from the pinned list but does not delete them from the chat history.
- **Use `unpinChatMessage` for granular control.** To remove a single pinned message without clearing the whole list, use `unpinChatMessage` and specify `message_id`.
- **Forum topics have their own unpin methods.** To unpin messages inside a specific forum topic, use `unpinAllForumTopicMessages` with the `message_thread_id`. For the General topic, use `unpinAllGeneralForumTopicMessages`.

## See Also

- [`unpinChatMessage`](/telegram/methods/unpinChatMessage) — Remove a single specific pinned message
- [`pinChatMessage`](/telegram/methods/pinChatMessage) — Pin a message in a chat
- [`unpinAllForumTopicMessages`](/telegram/methods/unpinAllForumTopicMessages) — Clear pins inside a forum topic
- [`unpinAllGeneralForumTopicMessages`](/telegram/methods/unpinAllGeneralForumTopicMessages) — Clear pins in the General forum topic
- [`getChatMember`](/telegram/methods/getChatMember) — Verify bot's admin rights before attempting
