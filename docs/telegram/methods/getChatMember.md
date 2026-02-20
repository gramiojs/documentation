---
title: getChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get information about a specific member of a Telegram chat using GramIO. TypeScript examples for checking membership status, admin rights, and restrictions. Returns ChatMember.
  - - meta
    - name: keywords
      content: getChatMember, telegram bot api, get chat member, gramio getChatMember, telegram check membership, getChatMember typescript, getChatMember example, ChatMember, telegram user status, check user ban status, telegram bot membership check, user_id, chat_id, how to check telegram member status, getChatMember administrator restricted
---

# getChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatMember">ChatMember</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a [ChatMember](https://core.telegram.org/bots/api#chatmember) object on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

## Returns

On success, the [ChatMember](/telegram/types/ChatMember) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check the membership status of the message sender
bot.command("status", async (ctx) => {
    if (!ctx.from) return;
    const member = await bot.api.getChatMember({
        chat_id: ctx.chat.id,
        user_id: ctx.from.id,
    });
    await ctx.send(`Your status: ${member.status}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Utility: check if a user is an active (non-banned/non-left) member
async function isMember(chatId: number | string, userId: number) {
    const member = await bot.api.getChatMember({
        chat_id: chatId,
        user_id: userId,
    });
    return (["member", "administrator", "creator"] as const).includes(
        member.status as "member" | "administrator" | "creator",
    );
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Gate a command to admins only
bot.command("admin_only", async (ctx) => {
    if (!ctx.from) return;
    const member = await bot.api.getChatMember({
        chat_id: ctx.chat.id,
        user_id: ctx.from.id,
    });
    if (member.status !== "administrator" && member.status !== "creator") {
        return ctx.send("This command is for admins only.");
    }
    await ctx.send("Welcome, admin!");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify channel subscription before granting bot access
bot.command("verify", async (ctx) => {
    if (!ctx.from) return;
    const member = await bot.api.getChatMember({
        chat_id: "@myprivatechannel",
        user_id: ctx.from.id,
    });
    const isSubscribed = ["member", "administrator", "creator"].includes(
        member.status,
    );
    await ctx.send(isSubscribed ? "Access granted!" : "Please subscribe first.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — bot must be a member |
| 400 | `Bad Request: user not found` | Invalid `user_id` or user has never interacted with the bot |
| 400 | `Bad Request: USER_ID_INVALID` | Malformed user ID |
| 403 | `Forbidden: bot is not a member of the chat` | Bot was removed from the chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only guaranteed for other users if the bot is an admin.** For non-admin bots in groups, Telegram may return `left` for a user who is actually a member — always make the bot an admin for reliable membership checks.
- **`status` is a discriminant for the `ChatMember` union.** Possible values are `"creator"`, `"administrator"`, `"member"`, `"restricted"`, `"left"`, and `"kicked"`. Use it to narrow the type.
- **`restricted` members have custom permission overrides.** The `ChatMemberRestricted` subtype exposes individual permission flags like `can_send_messages`, `can_send_media_messages`, etc.
- **Useful for subscription-gating.** Combine with join request handling to verify a user is subscribed to a private channel before granting access to a bot feature.
- **`left` vs `kicked`.** A user who left voluntarily has `status: "left"`, while a banned user has `status: "kicked"`. Both mean the user is no longer in the chat.

## See Also

- [getChatAdministrators](/telegram/methods/getChatAdministrators) — list all admins at once
- [getChatMemberCount](/telegram/methods/getChatMemberCount) — total member count
- [banChatMember](/telegram/methods/banChatMember) — ban a member
- [restrictChatMember](/telegram/methods/restrictChatMember) — restrict a member's permissions
- [promoteChatMember](/telegram/methods/promoteChatMember) — grant admin rights
- [ChatMember](/telegram/types/ChatMember) — the returned union type
