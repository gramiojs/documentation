---
title: leaveChat — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Make your Telegram bot leave a group, supergroup, or channel using GramIO and TypeScript. Complete leaveChat parameter reference, chat_id usage, and common error handling.
  - - meta
    - name: keywords
      content: leaveChat, telegram bot api, gramio leaveChat, leaveChat typescript, leaveChat example, telegram bot leave group, bot leave channel, bot leave supergroup, chat_id, how to leave chat telegram bot, remove bot from group
---

# leaveChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#leavechat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method for your bot to leave a group, supergroup or channel. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren't supported; leave the corresponding channel instead." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Leave a group by numeric chat ID:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.leaveChat({ chat_id: -1001234567890 });
```

Leave a public channel by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.leaveChat({ chat_id: "@mychannelname" });
```

Leave the current chat from a command handler:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("leave", async (ctx) => {
  await ctx.send("Goodbye! Leaving the chat now.");
  await bot.api.leaveChat({ chat_id: ctx.chat.id });
});
```

Self-destruct after completing a task — useful for temporary bots:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function runOneTimeTask(chatId: number) {
  // ... do work ...
  await bot.api.leaveChat({ chat_id: chatId });
  console.log("Task complete, bot left the chat.");
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid `chat_id` or the bot is not a member of the specified chat |
| 400 | `Bad Request: User_deactivated` | The bot's account has been deactivated |
| 400 | `Bad Request: method is not available for private chats` | `chat_id` points to a private user chat — bots cannot "leave" private conversations |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is already not a member of the channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Channel DM chats are not supported.** If a channel has a linked discussion group or a "direct messages" chat, use the channel's `chat_id` — not the DM chat's ID.
- **Leaving is permanent and immediate.** Once the bot leaves, it stops receiving updates from that chat. There is no "rejoin" method — the bot must be re-added manually by a user.
- **`@username` works for public chats.** The `chat_id` field accepts `@channelusername` for public channels and supergroups, so you don't need to store the numeric ID.
- **No confirmation event.** After calling `leaveChat`, the bot won't receive a `my_chat_member` update confirming the departure within the same session — the leave is applied immediately.
- **Use `banChatMember` to kick users, not bots.** `leaveChat` only makes your bot leave. To remove other users, use [banChatMember](/telegram/methods/banChatMember).

## See Also

- [banChatMember](/telegram/methods/banChatMember) — remove another member from a chat
- [getChat](/telegram/methods/getChat) — retrieve chat info before deciding to leave
- [getChatMember](/telegram/methods/getChatMember) — check the bot's current membership status in a chat
