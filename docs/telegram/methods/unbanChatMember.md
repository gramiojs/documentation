---
title: unbanChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Lift a ban and allow a previously banned user to rejoin a Telegram supergroup or channel using GramIO. Covers only_if_banned, TypeScript examples, and error handling.
  - - meta
    - name: keywords
      content: unbanChatMember, telegram bot api, gramio unbanChatMember, unban user telegram bot, telegram unban chat member, only_if_banned, user_id, chat_id, unban supergroup, unban channel, typescript unbanChatMember example, how to unban user telegram bot
---

# unbanChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unbanchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter *only\_if\_banned*. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="only_if_banned" type="Boolean" description="Do nothing if the user is not banned" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Unban a user in response to a `/unban` command (reply to the target message):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("unban", async (ctx) => {
  const targetUserId = ctx.replyToMessage?.from?.id;
  if (!targetUserId) {
    return ctx.reply("Reply to a message from the user you want to unban.");
  }

  await bot.api.unbanChatMember({
    chat_id: ctx.chat.id,
    user_id: targetUserId,
  });

  await ctx.reply("User has been unbanned and can rejoin via invite link.");
});
```

Use `only_if_banned` to safely unban without kicking active members:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("softunban", async (ctx) => {
  const targetUserId = ctx.replyToMessage?.from?.id;
  if (!targetUserId) return;

  // only_if_banned: do nothing if the user is currently an active member
  await bot.api.unbanChatMember({
    chat_id: ctx.chat.id,
    user_id: targetUserId,
    only_if_banned: true,
  });

  await ctx.reply("Done — if the user was banned, they can now rejoin.");
});
```

Unban a user from a channel by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function unbanFromChannel(userId: number) {
  await bot.api.unbanChatMember({
    chat_id: "@mychannel",
    user_id: userId,
    only_if_banned: true,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid, the bot is not in the chat, or the chat no longer exists |
| 400 | `Bad Request: user not found` | `user_id` does not correspond to a known Telegram user |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in this chat — promote the bot first |
| 403 | `Forbidden: not enough rights to restrict/ban chat member` | The bot is an admin but lacks `can_restrict_members` — grant it in admin settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The user won't rejoin automatically.** Unbanning only allows the user to rejoin via invite link or by being added by an admin — they are not re-added to the chat immediately.
- **`only_if_banned` prevents accidental kicks.** Without this flag, calling `unbanChatMember` on an active member will remove them from the chat. Always pass `only_if_banned: true` unless you explicitly intend to kick active members.
- **Works only in supergroups and channels.** Basic groups do not support persistent bans — user management there works differently.
- **Bot must have `can_restrict_members`.** Even for unbanning, the bot needs this administrator right. Verify with `getChatMember` if needed.
- **Unbanning does not restore previous permissions.** If the user had custom restrictions before being banned, those are cleared. They rejoin with default member permissions.

## See Also

- [`banChatMember`](/telegram/methods/banChatMember) — Ban a user from a supergroup or channel
- [`unbanChatSenderChat`](/telegram/methods/unbanChatSenderChat) — Unban a channel (sender chat) from posting
- [`banChatSenderChat`](/telegram/methods/banChatSenderChat) — Ban a channel from posting in a supergroup
- [`restrictChatMember`](/telegram/methods/restrictChatMember) — Restrict specific member permissions without a full ban
- [`getChatMember`](/telegram/methods/getChatMember) — Check the current status of a member before taking action
- [`ChatMember`](/telegram/types/ChatMember) — Union type for all member states including banned
