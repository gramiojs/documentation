---
title: createChatInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Create additional invite links for Telegram chats using GramIO. Complete createChatInviteLink TypeScript reference with expiry, member limits, and join request approval flows.
  - - meta
    - name: keywords
      content: createChatInviteLink, telegram bot api, telegram bot invite link, create invite link telegram bot, gramio createChatInviteLink, createChatInviteLink typescript, createChatInviteLink example, chat_id, expire_date, member_limit, creates_join_request, how to create invite link telegram bot, revoke invite link, ChatInviteLink
---

# createChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createchatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="name" type="String" description="Invite link name; 0-32 characters" :minLen="0" :maxLen="32" />

<ApiParam name="expire_date" type="Integer" description="Point in time (Unix timestamp) when the link will expire" />

<ApiParam name="member_limit" type="Integer" description="The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999" />

<ApiParam name="creates_join_request" type="Boolean" description="*True*, if users joining the chat via the link need to be approved by chat administrators. If *True*, *member\_limit* can't be specified" />

## Returns

On success, the [ChatInviteLink](/telegram/types/ChatInviteLink) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a basic invite link with no restrictions
const link = await bot.api.createChatInviteLink({
  chat_id: "@mychannel",
  name: "General access",
});
console.log(link.invite_link);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a time-limited link expiring in 24 hours with a member cap
const expiresAt = Math.floor(Date.now() / 1000) + 86400;

const link = await bot.api.createChatInviteLink({
  chat_id: -1001234567890,
  name: "Event 2025",
  expire_date: expiresAt,
  member_limit: 50,
});
console.log(`Link: ${link.invite_link}, expires: ${link.expire_date}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create an approval-gated link — users must be accepted by admins
const link = await bot.api.createChatInviteLink({
  chat_id: -1001234567890,
  name: "Membership application",
  creates_join_request: true,
});
console.log(link.invite_link);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is a member of the target chat |
| 400 | `Bad Request: can't combine member limit with join request approval` | `member_limit` and `creates_join_request` are mutually exclusive — choose one |
| 400 | `Bad Request: INVITE_LINK_NAME_INVALID` | `name` exceeds 32 characters |
| 400 | `Bad Request: EXPIRE_DATE_INVALID` | `expire_date` is in the past or otherwise invalid |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_invite_users` administrator right |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`member_limit` and `creates_join_request` are mutually exclusive.** Setting both in a single call will fail — choose between capping membership or requiring admin approval for each joiner.
- **Bot must have the `can_invite_users` admin right.** Other admin permissions do not imply this right; it must be explicitly granted.
- **`expire_date` is a Unix timestamp in seconds, not milliseconds.** Use `Math.floor(Date.now() / 1000) + seconds` to compute future timestamps correctly.
- **Only bot-created links can be revoked with `revokeChatInviteLink`.** The primary invite link (managed by the group owner) cannot be revoked this way.
- **`name` is shown to users before joining.** Use descriptive names like "Event 2025" or "VIP tier" to track invite sources and manage links efficiently.
- **`@username` strings work for public channels and groups.** Private chats always require the numeric chat ID.

## See Also

- [`editChatInviteLink`](/telegram/methods/editChatInviteLink) — Modify an existing invite link's settings
- [`revokeChatInviteLink`](/telegram/methods/revokeChatInviteLink) — Revoke a bot-created invite link
- [`exportChatInviteLink`](/telegram/methods/exportChatInviteLink) — Reset and retrieve the primary invite link
- [`approveChatJoinRequest`](/telegram/methods/approveChatJoinRequest) — Approve a pending join request
- [`declineChatJoinRequest`](/telegram/methods/declineChatJoinRequest) — Decline a pending join request
- [`ChatInviteLink`](/telegram/types/ChatInviteLink) — The return type of this method
