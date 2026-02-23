---
title: unbanChatSenderChat — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Unban a previously banned channel from posting in a Telegram supergroup or channel using GramIO. TypeScript examples, required admin rights, and error handling.
  - - meta
    - name: keywords
      content: unbanChatSenderChat, telegram bot api, gramio unbanChatSenderChat, unban sender chat telegram, unban channel telegram, sender_chat_id, telegram bot unban channel, typescript unbanChatSenderChat example, how to unban channel telegram bot
---

# unbanChatSenderChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unbanchatsenderchat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="sender_chat_id" type="Integer" required description="Unique identifier of the target sender chat" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Unban a channel that was previously banned from posting in a supergroup:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Unban a channel (by numeric ID) from posting in a supergroup
await bot.api.unbanChatSenderChat({
  chat_id: -1001234567890, // target supergroup
  sender_chat_id: -1009876543210, // the banned channel to unban
});
```

Handle a command to restore a banned channel's posting rights:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("unbanchannel", async (ctx) => {
  // In practice you'd look up the sender_chat_id from your database
  const bannedChannelId = -1009876543210;

  await bot.api.unbanChatSenderChat({
    chat_id: ctx.chat.id,
    sender_chat_id: bannedChannelId,
  });

  await ctx.reply("Channel has been unbanned and can post again.");
});
```

Unban a channel in a target channel by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function restoreChannelAccess(senderChatId: number) {
  await bot.api.unbanChatSenderChat({
    chat_id: "@mysupergroup",
    sender_chat_id: senderChatId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid, the bot is not in the chat, or the chat no longer exists |
| 400 | `Bad Request: sender chat not found` | `sender_chat_id` does not correspond to a known Telegram chat |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in the target chat |
| 403 | `Forbidden: not enough rights to restrict/ban chat member` | The bot is an admin but lacks `can_restrict_members` — grant it in admin settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **This unbans channels, not users.** `unbanChatSenderChat` is the counterpart of `banChatSenderChat` — it restores a channel's ability to send messages as itself in a supergroup. For individual users, use `unbanChatMember`.
- **Bot must have `can_restrict_members`.** The bot needs this administrator right to unban sender chats, just as with banning.
- **Only applicable where channels can post.** Supergroups can allow channels to post as sender chats; this method manages that access. It has no effect in basic groups.
- **Unban does not automatically resume posting.** The channel gains permission to post, but no messages are sent on its behalf — a channel admin must initiate that.

## See Also

- [`banChatSenderChat`](/telegram/methods/banChatSenderChat) — Ban a channel from posting in a supergroup or channel
- [`unbanChatMember`](/telegram/methods/unbanChatMember) — Unban an individual user from a supergroup or channel
- [`banChatMember`](/telegram/methods/banChatMember) — Ban an individual user from a supergroup or channel
- [`restrictChatMember`](/telegram/methods/restrictChatMember) — Restrict specific permissions for a member
- [`getChatMember`](/telegram/methods/getChatMember) — Check member or sender chat status
