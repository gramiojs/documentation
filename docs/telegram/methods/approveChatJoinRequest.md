---
title: approveChatJoinRequest — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Approve a Telegram chat join request with GramIO and TypeScript. Requires can_invite_users admin right. Full parameter reference and usage examples.
  - - meta
    - name: keywords
      content: approveChatJoinRequest, telegram bot api, gramio approveChatJoinRequest, approveChatJoinRequest typescript, approveChatJoinRequest example, approve join request telegram bot, chat join request handler, can_invite_users, ChatJoinRequest
---

# approveChatJoinRequest

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#approvechatjoinrequest" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the *can\_invite\_users* administrator right. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Approve every join request automatically
bot.on("chat_join_request", async (ctx) => {
  await bot.api.approveChatJoinRequest({
    chat_id: ctx.chatJoinRequest.chat.id,
    user_id: ctx.chatJoinRequest.from.id,
  });
});

// Conditional approval based on user bio or custom logic
bot.on("chat_join_request", async (ctx) => {
  const request = ctx.chatJoinRequest;
  const isAllowed = await checkUserEligibility(request.from.id);

  if (isAllowed) {
    await bot.api.approveChatJoinRequest({
      chat_id: request.chat.id,
      user_id: request.from.id,
    });
    // Optionally notify the user
    await bot.api.sendMessage({
      chat_id: request.from.id,
      text: "Your request to join the group has been approved!",
    });
  } else {
    await bot.api.declineChatJoinRequest({
      chat_id: request.chat.id,
      user_id: request.from.id,
    });
  }
});

// Approve requests for a specific channel by username
bot.on("chat_join_request", async (ctx) => {
  await bot.api.approveChatJoinRequest({
    chat_id: "@mychannelusername",
    user_id: ctx.chatJoinRequest.from.id,
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: USER_ALREADY_PARTICIPANT` | The user is already a member of the chat — check before calling, or handle idempotently |
| 400 | `Bad Request: HIDE_REQUESTER_MISSING` | No pending join request exists for this user — the request may have expired or already been handled |
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of that chat |
| 400 | `Bad Request: user not found` | `user_id` does not correspond to a known Telegram user |
| 403 | `Forbidden: bot is not an administrator` | The bot lacks administrator status in the target chat — promote the bot first |
| 403 | `Forbidden: not enough rights to invite users` | The bot is an admin but is missing the `can_invite_users` right — grant it in admin settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — use the [auto-retry plugin](/plugins/official/auto-retry) to handle retries automatically |

## Tips & Gotchas

- **Bot must have `can_invite_users` right.** This is the specific administrator permission required. Without it the call returns a 403 even if the bot is an admin.
- **`chat_join_request` updates must be enabled.** Telegram only sends `chat_join_request` updates when the chat has "Approve new members" enabled (i.e., join requests are required). Make sure your bot is subscribed to this update type in allowed updates.
- **Join requests expire.** Users can withdraw their request before the bot processes it. If a request is no longer pending, the API returns `HIDE_REQUESTER_MISSING`. Always handle this error gracefully.
- **One request per user at a time.** A user can only have one pending join request per chat. Calling `approveChatJoinRequest` twice for the same user/chat pair fails if the first call already accepted them.
- **Notify the user after approval.** The user receives a system notification from Telegram, but a personal message from your bot provides a better experience. Send a `sendMessage` to the user's private chat using their `from.id`.
- **Works for groups, supergroups, and channels.** The `chat_id` can be any of these types as long as the bot is an admin with the invite right.

## See Also

- [`declineChatJoinRequest`](/telegram/methods/declineChatJoinRequest) — Decline a pending join request instead of approving it
- [`ChatJoinRequest`](/telegram/types/ChatJoinRequest) — The update object received when a user asks to join
- [`ChatInviteLink`](/telegram/types/ChatInviteLink) — Invite link metadata, including approval-required links
- [Updates overview](/updates/overview) — How to subscribe to `chat_join_request` updates in GramIO
