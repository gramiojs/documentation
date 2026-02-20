---
title: revokeChatInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Revoke a chat invite link using GramIO and TypeScript. Invalidate join links, auto-generate primary link replacement, and manage invite link lifecycle.
  - - meta
    - name: keywords
      content: revokeChatInviteLink, telegram bot api, revoke invite link telegram bot, gramio revokeChatInviteLink, revokeChatInviteLink typescript, revokeChatInviteLink example, invalidate invite link, ChatInviteLink, can_invite_users, chat_id, invite_link, how to revoke telegram invite link
---

# revokeChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#revokechatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier of the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="invite_link" type="String" required description="The invite link to revoke" />

## Returns

On success, the [ChatInviteLink](/telegram/types/ChatInviteLink) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

Revoke a specific invite link:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const revoked = await bot.api.revokeChatInviteLink({
  chat_id: "@mychannel",
  invite_link: "https://t.me/+abc123def456",
});

console.log(revoked.is_revoked); // true
console.log(revoked.invite_link); // the now-inactive link
```

Create a limited invite link and revoke it after use:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a 10-use invite link for a campaign
const link = await bot.api.createChatInviteLink({
  chat_id: -1001234567890,
  member_limit: 10,
  name: "Campaign link",
});

// ... users join via link.invite_link ...

// When done, revoke it to prevent further joins
const revoked = await bot.api.revokeChatInviteLink({
  chat_id: -1001234567890,
  invite_link: link.invite_link,
});

console.log(`Link revoked: ${revoked.invite_link}`);
```

Revoke the primary link (a new one is auto-generated):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the primary link first
const chat = await bot.api.getChat({ chat_id: -1001234567890 });
const primaryLink = chat.invite_link;

if (primaryLink) {
  // Revoking the primary link auto-creates a fresh one
  await bot.api.revokeChatInviteLink({
    chat_id: -1001234567890,
    invite_link: primaryLink,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: INVITE_HASH_INVALID` | `invite_link` has an invalid format — must be a `t.me/+...` or `t.me/joinchat/...` URL |
| 400 | `Bad Request: INVITE_HASH_EXPIRED` | Link was already revoked — check `is_revoked` on the `ChatInviteLink` before calling again |
| 400 | `Bad Request: not enough rights to create invite link` | Bot lacks the `can_invite_users` administrator right |
| 403 | `Forbidden: not enough rights` | Bot is not an administrator in the chat |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Only links created by your bot can be revoked.** You cannot revoke invite links created by other admins. Use [`exportChatInviteLink`](/telegram/methods/exportChatInviteLink) to manage the primary link.
- **Revoking the primary link auto-generates a replacement.** The new primary link is returned as `chat.invite_link` on subsequent `getChat` calls — you do not need to call `exportChatInviteLink` separately.
- **The returned `ChatInviteLink` has `is_revoked: true`.** Use this field to verify the operation succeeded, and to confirm the link is no longer usable before attempting to revoke it.
- **Users who already joined via the link are not affected.** Revoking a link only prevents new users from joining — it does not remove anyone from the chat.
- **Subscription links cannot be revoked this way.** If the link has `subscription_period`, use the appropriate subscription management methods.
- **Check expiry before revoking.** Links with `expire_date` in the past or `member_limit` reached are already inactive — revoking them again is a no-op that may throw `INVITE_HASH_EXPIRED`.

## See Also

- [`createChatInviteLink`](/telegram/methods/createChatInviteLink) — Create a new invite link (with optional limits, expiry, or approval)
- [`editChatInviteLink`](/telegram/methods/editChatInviteLink) — Edit an existing invite link's settings
- [`exportChatInviteLink`](/telegram/methods/exportChatInviteLink) — Generate or refresh the primary invite link
- [`ChatInviteLink`](/telegram/types/ChatInviteLink) — The full invite link object structure
