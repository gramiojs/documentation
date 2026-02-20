---
title: banChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Ban a user from a Telegram group, supergroup, or channel using GramIO and TypeScript. Supports temporary bans, message deletion, and permanent bans. Full reference.
  - - meta
    - name: keywords
      content: banChatMember, telegram bot api, gramio banChatMember, banChatMember typescript, banChatMember example, ban user telegram bot, ban user group telegram, until_date unix time, revoke_messages, temporary ban telegram, permanent ban telegram
---

# banChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#banchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless [unbanned](https://core.telegram.org/bots/api#unbanchatmember) first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="until_date" type="Integer" description="Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only." />

<ApiParam name="revoke_messages" type="Boolean" description="Pass *True* to delete all messages from the chat for the user that is being removed. If *False*, the user will be able to see messages in the group that were sent before the user was removed. Always *True* for supergroups and channels." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Permanently ban a user from a group (no until_date = permanent)
bot.command("ban", async (ctx) => {
  const targetUserId = ctx.message.reply_to_message?.from?.id;
  if (!targetUserId) {
    return ctx.reply("Reply to a message to ban that user.");
  }

  await bot.api.banChatMember({
    chat_id: ctx.chat.id,
    user_id: targetUserId,
  });

  await ctx.reply("User has been permanently banned.");
});

// Temporary ban — ban for 24 hours
bot.command("tempban", async (ctx) => {
  const targetUserId = ctx.message.reply_to_message?.from?.id;
  if (!targetUserId) return;

  const oneDayFromNow = Math.floor(Date.now() / 1000) + 24 * 3600;

  await bot.api.banChatMember({
    chat_id: ctx.chat.id,
    user_id: targetUserId,
    until_date: oneDayFromNow,
  });

  await ctx.reply("User has been banned for 24 hours.");
});

// Ban and delete all their messages
bot.command("ban", async (ctx) => {
  const targetUserId = ctx.message.reply_to_message?.from?.id;
  if (!targetUserId) return;

  await bot.api.banChatMember({
    chat_id: ctx.chat.id,
    user_id: targetUserId,
    revoke_messages: true, // Delete all messages from this user in the group
  });

  await ctx.reply("User banned and all their messages deleted.");
});

// Ban in a channel by username
async function banFromChannel(
  bot: Bot,
  userId: number,
  channelUsername: string
): Promise<void> {
  await bot.api.banChatMember({
    chat_id: `@${channelUsername}`,
    user_id: userId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid, the bot is not in the chat, or the chat no longer exists |
| 400 | `Bad Request: user not found` | `user_id` does not correspond to a known Telegram user |
| 400 | `Bad Request: USER_NOT_PARTICIPANT` | The user is not a member of the group — for supergroups, the user can still be banned to block re-entry |
| 400 | `Bad Request: can't remove chat owner` | Attempting to ban the chat owner — owners cannot be banned or restricted |
| 400 | `Bad Request: method is available only for supergroups` | `until_date` was used on a basic group — temporary bans only apply to supergroups and channels |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in this chat — promote the bot first |
| 403 | `Forbidden: not enough rights to restrict/ban chat member` | The bot is an admin but lacks the `can_restrict_members` right — grant it in admin settings |
| 403 | `Forbidden: bot can't initiate conversation with a user` | Unrelated to banning — only relevant if you also try to message the banned user |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Permanent vs temporary ban: `until_date` edge cases.** If `until_date` is more than 366 days in the future, or less than 30 seconds from now, Telegram treats it as a permanent ban. Always compute the timestamp server-side: `Math.floor(Date.now() / 1000) + seconds`.
- **`until_date` only applies to supergroups and channels.** Basic groups do not support timed bans — passing `until_date` in a basic group has no effect or causes an error.
- **`revoke_messages` always true in supergroups/channels.** In supergroups and channels the parameter is effectively forced to `true` by Telegram — messages from the banned user are always deleted. In basic groups, setting it to `false` lets prior messages remain visible.
- **The user cannot return on their own.** After banning in a supergroup or channel, the user cannot rejoin via existing invite links. Use `unbanChatMember` first if you want to allow them back.
- **Banning does not kick from basic groups automatically.** In a basic group, the user is removed but can theoretically be re-added by other admins. For strong enforcement, use supergroups.
- **You cannot ban the chat creator.** Attempting to ban the owner returns a 400 error. Check `ChatMember.status === "creator"` before banning if your logic could target any user.
- **Use `restrictChatMember` for lighter penalties.** If you only want to mute or limit a user without full removal, use `restrictChatMember` to revoke specific permissions.

## See Also

- [`unbanChatMember`](/telegram/methods/unbanChatMember) — Lift a ban so the user can rejoin via invite link
- [`banChatSenderChat`](/telegram/methods/banChatSenderChat) — Ban a channel (sender chat) from posting in a supergroup or channel
- [`restrictChatMember`](/telegram/methods/restrictChatMember) — Mute or limit individual permissions without a full ban
- [`ChatMember`](/telegram/types/ChatMember) — Inspect member status before taking action
