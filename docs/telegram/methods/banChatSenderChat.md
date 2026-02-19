---
title: banChatSenderChat — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Ban a channel (sender chat) from posting in a Telegram supergroup or channel using GramIO and TypeScript. Block all channels owned by a user. Full reference and examples.
  - - meta
    - name: keywords
      content: banChatSenderChat, telegram bot api, gramio banChatSenderChat, banChatSenderChat typescript, banChatSenderChat example, ban channel telegram bot, ban sender chat telegram, block channel supergroup, sender_chat_id, unbanChatSenderChat
---

# banChatSenderChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#banchatsenderchat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to ban a channel chat in a supergroup or a channel. Until the chat is [unbanned](https://core.telegram.org/bots/api#unbanchatsenderchat), the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="sender_chat_id" type="Integer" required description="Unique identifier of the target sender chat" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Ban a sender chat when a channel posts in your supergroup
bot.on("message", async (ctx) => {
  const senderChat = ctx.message.sender_chat;
  if (!senderChat) return; // Message was sent by a regular user, not a channel

  // Ban the channel from posting
  await bot.api.banChatSenderChat({
    chat_id: ctx.chat.id,
    sender_chat_id: senderChat.id,
  });

  await ctx.send(`Channel @${senderChat.username ?? senderChat.id} has been banned.`);
});

// Command to ban a specific sender chat by replying to its message
bot.command("banchannel", async (ctx) => {
  const senderChatId = ctx.message.reply_to_message?.sender_chat?.id;
  if (!senderChatId) {
    return ctx.reply("Reply to a channel message to ban that channel.");
  }

  await bot.api.banChatSenderChat({
    chat_id: ctx.chat.id,
    sender_chat_id: senderChatId,
  });

  await ctx.reply("The channel has been banned from this chat.");
});

// Ban a known channel from a supergroup by ID
async function banChannelFromSupergroup(
  bot: Bot,
  supergroupId: number,
  channelId: number
): Promise<void> {
  await bot.api.banChatSenderChat({
    chat_id: supergroupId,
    sender_chat_id: channelId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the target supergroup/channel |
| 400 | `Bad Request: PEER_ID_INVALID` | `sender_chat_id` does not refer to a valid channel or chat — verify the ID is a channel, not a user |
| 400 | `Bad Request: can't remove chat owner` | Attempting to ban the chat that owns the supergroup — a chat cannot ban itself |
| 400 | `Bad Request: method is available for supergroup and channel chats only` | `chat_id` refers to a basic group — this method only works for supergroups and channels |
| 403 | `Forbidden: bot is not an administrator` | The bot is not an admin in the target supergroup/channel — promote the bot first |
| 403 | `Forbidden: not enough rights to restrict/ban chat member` | The bot is an admin but lacks `can_restrict_members` — grant it in admin settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **This bans the channel, not an individual user.** However, the ban affects the channel owner's ability to send messages as **any** of their channels in that chat. The owner can still post as themselves (their personal account) unless separately banned with `banChatMember`.
- **Only works in supergroups and channels.** Basic groups do not support sender chat bans. If your bot manages basic groups, check the chat type before calling this method.
- **`sender_chat_id` comes from `message.sender_chat`.** When a channel or anonymous group admin sends a message in a supergroup, Telegram populates `message.sender_chat` with the channel's info. Use this field to get the ID for banning.
- **The ban is permanent until lifted.** Unlike `banChatMember`, there is no `until_date` parameter. Use `unbanChatSenderChat` to lift the ban.
- **To ban the channel's human owner too, combine with `banChatMember`.** If you want to completely block both the channel and the owner's personal account, call both methods.
- **Check `message.is_automatic_forward` for linked channels.** Posts automatically forwarded from a linked channel arrive with `is_automatic_forward: true` and `sender_chat` set. Don't accidentally ban your own linked channel.

## See Also

- [`unbanChatSenderChat`](/telegram/methods/unbanChatSenderChat) — Lift a sender chat ban to allow the channel to post again
- [`banChatMember`](/telegram/methods/banChatMember) — Ban an individual user (personal account) from a group or channel
- [`restrictChatMember`](/telegram/methods/restrictChatMember) — Apply per-permission restrictions rather than a full ban
