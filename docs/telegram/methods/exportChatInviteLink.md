---
title: exportChatInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Generate or reset a Telegram chat's primary invite link using GramIO. Complete exportChatInviteLink reference with admin rights, link revocation behavior, and when to use createChatInviteLink instead.
  - - meta
    - name: keywords
      content: exportChatInviteLink, telegram bot api, telegram primary invite link, export invite link telegram bot, gramio exportChatInviteLink, exportChatInviteLink typescript, exportChatInviteLink example, chat_id, can_invite_users, reset invite link, revoke primary invite link, how to get invite link telegram bot, telegram group invite link
---

# exportChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#exportchatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as _String_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reset and retrieve the primary invite link for a chat
const newLink = await bot.api.exportChatInviteLink({
  chat_id: -1001234567890,
});
console.log(newLink); // "https://t.me/joinchat/..."
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Admin command: refresh the invite link and share it
bot.command("refreshlink", async (ctx) => {
  const link = await bot.api.exportChatInviteLink({
    chat_id: -1001234567890,
  });
  await ctx.send(`New invite link: ${link}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rotate the primary link by username (public channels/groups)
const link = await bot.api.exportChatInviteLink({
  chat_id: "@mypublicchannel",
});
console.log(`Primary link rotated: ${link}`);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — ensure the bot is a member of the target chat |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_invite_users` administrator right — grant it in the group's admin settings |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the chat — add it as an admin first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Calling this revokes the existing primary link.** Any users who had the old primary link can no longer use it to join. Use this only when intentional rotation is needed (e.g., after a leak).
- **Returns a plain `String`, not a `ChatInviteLink` object.** If you need a link with metadata (name, expiry, member limit, join request approval), use [`createChatInviteLink`](/telegram/methods/createChatInviteLink) instead.
- **Bot must have the `can_invite_users` admin right.** This is separate from other admin permissions and must be explicitly assigned.
- **`@username` strings work for public channels and groups.** Private chats always require the numeric chat ID.
- **The primary link is the single "default" link for a chat.** Each chat has exactly one primary link at a time — this method replaces it. Extra tracked links (with limits, names, expiry) are managed separately via `createChatInviteLink` and `revokeChatInviteLink`.
- **Avoid calling this unnecessarily.** Rotating the primary link impacts all members who may have shared it; prefer creating secondary links for trackable campaigns instead.

## See Also

- [createChatInviteLink](/telegram/methods/createChatInviteLink) — create additional named/limited/expiring links without revoking the primary
- [editChatInviteLink](/telegram/methods/editChatInviteLink) — modify an existing bot-created invite link
- [revokeChatInviteLink](/telegram/methods/revokeChatInviteLink) — revoke a specific bot-created link
- [approveChatJoinRequest](/telegram/methods/approveChatJoinRequest) — approve a pending join request
- [declineChatJoinRequest](/telegram/methods/declineChatJoinRequest) — decline a pending join request
- [ChatInviteLink](/telegram/types/ChatInviteLink) — the richer invite link object returned by createChatInviteLink
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
