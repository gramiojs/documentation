---
title: promoteChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Promote or demote a Telegram chat member using GramIO and TypeScript. Full admin rights reference, demotion pattern, and channel vs supergroup differences explained.
  - - meta
    - name: keywords
      content: promoteChatMember, telegram bot api, gramio promoteChatMember, promoteChatMember typescript, promoteChatMember example, promote admin, demote admin, can_pin_messages, can_manage_chat, can_post_messages, can_restrict_members, can_promote_members, supergroup admin, channel admin
---

# promoteChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#promotechatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass *False* for all boolean parameters to demote a user. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="is_anonymous" type="Boolean" description="Pass *True* if the administrator's presence in the chat is hidden" />

<ApiParam name="can_manage_chat" type="Boolean" description="Pass *True* if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege." />

<ApiParam name="can_delete_messages" type="Boolean" description="Pass *True* if the administrator can delete messages of other users" />

<ApiParam name="can_manage_video_chats" type="Boolean" description="Pass *True* if the administrator can manage video chats" />

<ApiParam name="can_restrict_members" type="Boolean" description="Pass *True* if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to *True* for promotions of channel administrators" />

<ApiParam name="can_promote_members" type="Boolean" description="Pass *True* if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)" />

<ApiParam name="can_change_info" type="Boolean" description="Pass *True* if the administrator can change chat title, photo and other settings" />

<ApiParam name="can_invite_users" type="Boolean" description="Pass *True* if the administrator can invite new users to the chat" />

<ApiParam name="can_post_stories" type="Boolean" description="Pass *True* if the administrator can post stories to the chat" />

<ApiParam name="can_edit_stories" type="Boolean" description="Pass *True* if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive" />

<ApiParam name="can_delete_stories" type="Boolean" description="Pass *True* if the administrator can delete stories posted by other users" />

<ApiParam name="can_post_messages" type="Boolean" description="Pass *True* if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only" />

<ApiParam name="can_edit_messages" type="Boolean" description="Pass *True* if the administrator can edit messages of other users and can pin messages; for channels only" />

<ApiParam name="can_pin_messages" type="Boolean" description="Pass *True* if the administrator can pin messages; for supergroups only" />

<ApiParam name="can_manage_topics" type="Boolean" description="Pass *True* if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only" />

<ApiParam name="can_manage_direct_messages" type="Boolean" description="Pass *True* if the administrator can manage direct messages within the channel and decline suggested posts; for channels only" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

Promote a user to a full supergroup admin (all common rights):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("promote", async (ctx) => {
  const targetId = ctx.update.message?.reply_to_message?.from?.id;
  if (!targetId) return ctx.send("Reply to a message to promote its author.");

  await bot.api.promoteChatMember({
    chat_id: ctx.chat.id,
    user_id: targetId,
    can_manage_chat: true,
    can_delete_messages: true,
    can_restrict_members: true,
    can_invite_users: true,
    can_pin_messages: true,
    can_change_info: true,
  });

  await ctx.send(`User ${targetId} has been promoted to admin.`);
});
```

Grant a moderator only the right to delete messages and restrict members:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function makeModerator(chatId: number, userId: number) {
  await bot.api.promoteChatMember({
    chat_id: chatId,
    user_id: userId,
    can_manage_chat: true,
    can_delete_messages: true,
    can_restrict_members: true,
  });
}
```

Demote a user (remove all admin rights) by passing `false` for every boolean:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function demoteUser(chatId: number, userId: number) {
  await bot.api.promoteChatMember({
    chat_id: chatId,
    user_id: userId,
    is_anonymous: false,
    can_manage_chat: false,
    can_delete_messages: false,
    can_manage_video_chats: false,
    can_restrict_members: false,
    can_promote_members: false,
    can_change_info: false,
    can_invite_users: false,
    can_pin_messages: false,
  });
}
```

Promote a channel admin with channel-specific rights:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function promoteChannelEditor(channelId: string, userId: number) {
  await bot.api.promoteChatMember({
    chat_id: channelId,
    user_id: userId,
    can_post_messages: true,
    can_edit_messages: true,  // also allows pinning in channels
    can_delete_messages: true,
    can_manage_direct_messages: true,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the chat does not exist, or the bot is not a member. |
| 400 | `Bad Request: user not found` | The `user_id` does not correspond to a known Telegram user. |
| 400 | `Bad Request: participant not found` | The target user is not a member of the specified chat. They must join first. |
| 400 | `Bad Request: can't promote self` | A bot cannot promote itself — only other members. |
| 400 | `Bad Request: method is available for supergroup and channel chats only` | `promoteChatMember` works only in supergroups and channels, not basic groups or private chats. |
| 403 | `Forbidden: not enough rights` | The bot is not an administrator or lacks `can_promote_members`. A bot can only grant rights that it itself possesses. |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Wait `N` seconds before retrying. |

## Tips & Gotchas

- **Demoting = passing `false` for everything.** There is no separate "demote" method. To remove admin rights, call `promoteChatMember` with all boolean flags set to `false`. Omitting a flag does NOT reset it — only an explicit `false` removes that right.
- **A bot can only grant rights it already has.** If the bot's own `can_promote_members` right is missing or if you try to grant a right the bot itself does not hold, the call will fail with a 403 error.
- **`can_post_messages`, `can_edit_messages`, `can_manage_direct_messages` are channels-only.** Passing them for a supergroup is silently ignored. Conversely, `can_pin_messages` and `can_manage_topics` are supergroup-only.
- **`can_manage_chat` is implied by every other right.** You don't need to set it explicitly when granting any other privilege, but setting it alone grants basic management access without full admin powers.
- **`can_restrict_members` defaults to `true` for channel promotions (backward compatibility).** If you promote someone in a channel without specifying `can_restrict_members`, it will be granted automatically.
- **Anonymous admins.** Setting `is_anonymous: true` hides the admin's identity from regular members. Only other admins can see who the anonymous admin is.

## See Also

- [restrictChatMember](/telegram/methods/restrictChatMember) — Restrict a user's permissions (not admin-level)
- [banChatMember](/telegram/methods/banChatMember) — Ban a user from the chat
- [getChatMember](/telegram/methods/getChatMember) — Inspect a user's current rights before promoting
- [setChatPhoto](/telegram/methods/setChatPhoto) — Change chat photo (requires `can_change_info`)
- [pinChatMessage](/telegram/methods/pinChatMessage) — Pin messages (requires `can_pin_messages` or `can_edit_messages`)
- [ChatAdministratorRights](/telegram/types/ChatAdministratorRights) — The type describing the full set of admin rights
