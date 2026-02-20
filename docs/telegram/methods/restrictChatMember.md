---
title: restrictChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Restrict a supergroup member's permissions using GramIO and TypeScript. Mute users, set time limits, lift restrictions, and manage ChatPermissions with TypeScript examples.
  - - meta
    - name: keywords
      content: restrictChatMember, telegram bot api, restrict chat member telegram bot, gramio restrictChatMember, restrictChatMember typescript, restrictChatMember example, mute user telegram, ban user from sending messages, ChatPermissions, until_date, use_independent_chat_permissions, can_restrict_members, supergroup restriction, how to mute telegram bot
---

# restrictChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#restrictchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass *True* for all permissions to lift restrictions from a user. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="permissions" type="ChatPermissions" required description="A JSON-serialized object for new user permissions" />

<ApiParam name="use_independent_chat_permissions" type="Boolean" description="Pass *True* if chat permissions are set independently. Otherwise, the *can\_send\_other\_messages* and *can\_add\_web\_page\_previews* permissions will imply the *can\_send\_messages*, *can\_send\_audios*, *can\_send\_documents*, *can\_send\_photos*, *can\_send\_videos*, *can\_send\_video\_notes*, and *can\_send\_voice\_notes* permissions; the *can\_send\_polls* permission will imply the *can\_send\_messages* permission." />

<ApiParam name="until_date" type="Integer" description="Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

Mute a user (prevent sending messages) for 1 hour:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.restrictChatMember({
  chat_id: "@mysupergroup",
  user_id: 123456789,
  permissions: {
    can_send_messages: false,
  },
  until_date: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
});
```

Restrict all messaging permissions permanently (no `until_date` = forever):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.restrictChatMember({
  chat_id: -1001234567890,
  user_id: 123456789,
  permissions: {
    can_send_messages: false,
    can_send_polls: false,
    can_send_other_messages: false,
    can_add_web_page_previews: false,
    can_invite_users: false,
    can_pin_messages: false,
  },
});
```

Lift all restrictions (restore default member permissions):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.restrictChatMember({
  chat_id: -1001234567890,
  user_id: 123456789,
  permissions: {
    can_send_messages: true,
    can_send_audios: true,
    can_send_documents: true,
    can_send_photos: true,
    can_send_videos: true,
    can_send_video_notes: true,
    can_send_voice_notes: true,
    can_send_polls: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
    can_invite_users: true,
  },
});
```

Admin command to mute a replied-to user for 10 minutes:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("mute", async (ctx) => {
  const target = ctx.replyMessage?.from;
  if (!target) return ctx.reply("Reply to a message to mute that user.");

  await bot.api.restrictChatMember({
    chat_id: ctx.chat.id,
    user_id: target.id,
    permissions: { can_send_messages: false },
    until_date: Math.floor(Date.now() / 1000) + 600, // 10 minutes
  });

  return ctx.reply(`Muted ${target.first_name} for 10 minutes.`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: user not found` | `user_id` is invalid — user must have interacted with Telegram at some point |
| 400 | `Bad Request: user is an administrator of the chat` | Cannot restrict a chat administrator — demote them first with [`promoteChatMember`](/telegram/methods/promoteChatMember) |
| 400 | `Bad Request: can't demote chat creator` | Cannot restrict the group creator under any circumstances |
| 400 | `Bad Request: method is available only for supergroups` | The target chat is a basic group — upgrade it to a supergroup first |
| 403 | `Forbidden: not enough rights to restrict/kick chat member` | Bot lacks the `can_restrict_members` administrator right |
| 403 | `Forbidden: bot is not a member of the supergroup chat` | Bot was removed from the group |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only works in supergroups.** Basic groups must be converted to supergroups before restrictions can be applied. Channels do not support this method.
- **`until_date` edge cases create permanent restrictions.** If `until_date` is 0, omitted, less than 30 seconds in the future, or more than 366 days away, the restriction is permanent (indefinite). Always use a value at least 30 seconds from now for temporary restrictions.
- **Omitting a permission field is not the same as `false`.** Unset fields are treated as `false` by Telegram. If you only want to mute (disable messages), you still need to explicitly set the permissions you want to *keep*.
- **Pass `True` for all permissions to lift restrictions.** There is no dedicated "unmute" method — call `restrictChatMember` again with all desired permissions set to `true`.
- **`use_independent_chat_permissions` changes how permissions cascade.** By default, setting `can_send_messages: false` also disables all media sending. Set `use_independent_chat_permissions: true` to control each permission independently, e.g., allow sending stickers but not text.
- **Bot must have `can_restrict_members`.** Check that your bot's admin rights include this before calling the method, otherwise you'll get a `403 Forbidden`.

## See Also

- [`banChatMember`](/telegram/methods/banChatMember) — Completely ban a user from the chat (stronger than restrict)
- [`unbanChatMember`](/telegram/methods/unbanChatMember) — Remove a ban from a user
- [`promoteChatMember`](/telegram/methods/promoteChatMember) — Grant or revoke administrator rights
- [`ChatPermissions`](/telegram/types/ChatPermissions) — Full list of permission fields
