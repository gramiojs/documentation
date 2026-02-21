---
title: editChatInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit Telegram chat invite links using GramIO with TypeScript. Update name, expiry date, member limit, and join-request settings on bot-created invite links.
  - - meta
    - name: keywords
      content: editChatInviteLink, telegram bot api, telegram bot invite link, edit invite link telegram bot, gramio editChatInviteLink, editChatInviteLink typescript, editChatInviteLink example, chat_id, invite_link, expire_date, member_limit, creates_join_request, how to edit invite link telegram bot, ChatInviteLink, can_invite_users
---

# editChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editchatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="invite_link" type="String" required description="The invite link to edit" />

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
// Rename a link and set a new expiry date
const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

const updated = await bot.api.editChatInviteLink({
  chat_id: "@mychannel",
  invite_link: "https://t.me/+abc123",
  name: "Summer Campaign",
  expire_date: expiresAt,
  member_limit: 100,
});
console.log(updated.invite_link); // same URL, updated settings
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Switch a link to require admin approval (drop the member_limit)
const updated = await bot.api.editChatInviteLink({
  chat_id: -1001234567890,
  invite_link: "https://t.me/+abc123",
  creates_join_request: true,
});
console.log(updated.creates_join_request); // true
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Just rename an existing link without touching other settings
const updated = await bot.api.editChatInviteLink({
  chat_id: -1001234567890,
  invite_link: "https://t.me/+abc123",
  name: "Open Enrollment",
});
console.log(updated.name); // "Open Enrollment"
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is still a member of the chat |
| 400 | `Bad Request: INVITE_HASH_EXPIRED` | The invite link is revoked or has already expired — use [`createChatInviteLink`](/telegram/methods/createChatInviteLink) to issue a fresh one |
| 400 | `Bad Request: can't combine member limit with join request approval` | `member_limit` and `creates_join_request: true` are mutually exclusive — pick one |
| 400 | `Bad Request: INVITE_LINK_NAME_INVALID` | `name` exceeds 32 characters |
| 400 | `Bad Request: EXPIRE_DATE_INVALID` | `expire_date` is in the past or otherwise invalid |
| 400 | `Bad Request: MEMBER_LIMIT_INVALID` | `member_limit` is outside the 1–99999 range |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_invite_users` administrator right |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only bot-created, non-primary links can be edited.** The chat's primary invite link (managed by the owner) cannot be modified this way — use [`exportChatInviteLink`](/telegram/methods/exportChatInviteLink) to reset it.
- **`member_limit` and `creates_join_request` are mutually exclusive.** Passing both in the same call raises a 400 error. When switching a link to `creates_join_request: true`, omit `member_limit` — any existing limit will be cleared.
- **`expire_date` is a Unix timestamp in seconds, not milliseconds.** Compute future times with `Math.floor(Date.now() / 1000) + seconds`.
- **Omitting optional fields keeps the current value.** You can update just `name` without touching `expire_date` or `member_limit`.
- **`chat_id` accepts `@username` strings** for public channels and groups. Private chats require the numeric ID.
- **Editing does not change the link URL.** The same link string continues to work with its updated constraints — existing users who saved the link are unaffected.

## See Also

- [`createChatInviteLink`](/telegram/methods/createChatInviteLink) — Create a new additional invite link
- [`revokeChatInviteLink`](/telegram/methods/revokeChatInviteLink) — Revoke a bot-created invite link
- [`exportChatInviteLink`](/telegram/methods/exportChatInviteLink) — Reset and retrieve the primary invite link
- [`createChatSubscriptionInviteLink`](/telegram/methods/createChatSubscriptionInviteLink) — Create a subscription invite link
- [`editChatSubscriptionInviteLink`](/telegram/methods/editChatSubscriptionInviteLink) — Edit a subscription invite link
- [`approveChatJoinRequest`](/telegram/methods/approveChatJoinRequest) — Approve a pending join request when using `creates_join_request`
- [`ChatInviteLink`](/telegram/types/ChatInviteLink) — The return type of this method
