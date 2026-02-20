---
title: declineChatJoinRequest — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Decline Telegram chat join requests using GramIO. Complete declineChatJoinRequest TypeScript reference with ChatJoinRequestContext, ctx.decline() shorthand, and admin permission guide.
  - - meta
    - name: keywords
      content: declineChatJoinRequest, telegram bot api, telegram join request decline, gramio declineChatJoinRequest, declineChatJoinRequest typescript, declineChatJoinRequest example, ChatJoinRequest, can_invite_users, ctx.decline, how to decline join request telegram bot, chat_join_request handler
---

# declineChatJoinRequest

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#declinechatjoinrequest" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can\_invite\_users_ administrator right. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Use ctx.decline() shorthand inside a chat_join_request handler
bot.on("chat_join_request", async (ctx) => {
  // Decline all join requests (e.g., during maintenance)
  await ctx.decline();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Conditionally approve or decline based on custom logic
bot.on("chat_join_request", async (ctx) => {
  const userId = ctx.from.id;

  // Example: decline users not in an allowlist
  const allowlist = [111111111, 222222222];
  if (allowlist.includes(userId)) {
    await ctx.approve();
  } else {
    await ctx.decline();
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call to decline a specific user's join request
await bot.api.declineChatJoinRequest({
  chat_id: -1001234567890,
  user_id: 987654321,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Decline and notify the user via DM
bot.on("chat_join_request", async (ctx) => {
  await ctx.decline();

  // Optionally send a message to the declined user
  await bot.api.sendMessage({
    chat_id: ctx.from.id,
    text: "Your request to join was declined. Contact @admin for more info.",
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is in the target chat |
| 400 | `Bad Request: USER_ALREADY_PARTICIPANT` | The user is already a member — no pending join request exists |
| 400 | `Bad Request: HIDE_REQUESTER_MISSING` | No pending join request from `user_id` — the request may have expired or been handled already |
| 400 | `Bad Request: user not found` | `user_id` does not correspond to a known Telegram user |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_invite_users` administrator right |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the target chat — add the bot as admin first |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Use `ctx.decline()` inside `chat_join_request` handlers** instead of the raw API call — it reads `chat_id` and `user_id` from context automatically.
- **Join requests only arrive when the invite link has `creates_join_request: true`.** If your link doesn't use this flag, there will be no requests to decline.
- **Each request can only be acted on once.** Calling `declineChatJoinRequest` on an already-handled request returns `HIDE_REQUESTER_MISSING`.
- **Declining does not ban the user.** They can still request again via the same invite link. To prevent repeat requests, follow up with `banChatMember` if needed.
- **Bot must have `can_invite_users` right.** This is the same right required for creating invite links — granting it covers both operations.
- **Join requests do not expire automatically in a short window.** Unanswered requests persist until the bot or another admin acts on them.

## See Also

- [`approveChatJoinRequest`](/telegram/methods/approveChatJoinRequest) — Approve a pending join request
- [`createChatInviteLink`](/telegram/methods/createChatInviteLink) — Create the invite link that triggers join requests
- [`banChatMember`](/telegram/methods/banChatMember) — Ban a user after declining to prevent re-requesting
