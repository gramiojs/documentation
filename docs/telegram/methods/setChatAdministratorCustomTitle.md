---
title: setChatAdministratorCustomTitle — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set a custom title for a supergroup administrator using GramIO. TypeScript examples, parameter reference, error table, and tips for 0-16 char emoji-free titles.
  - - meta
    - name: keywords
      content: setChatAdministratorCustomTitle, telegram bot api, set admin title telegram, custom title supergroup, gramio setChatAdministratorCustomTitle, setChatAdministratorCustomTitle typescript, setChatAdministratorCustomTitle example, user_id, custom_title, telegram admin rank, how to set custom title telegram bot
---

# setChatAdministratorCustomTitle

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatadministratorcustomtitle" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="custom_title" type="String" required description="New custom title for the administrator; 0-16 characters, emoji are not allowed" :minLen="0" :maxLen="16" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a custom title for a known admin
await bot.api.setChatAdministratorCustomTitle({
  chat_id: -1001234567890,
  user_id: 987654321,
  custom_title: "Head of Support",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Clear the custom title (pass an empty string)
await bot.api.setChatAdministratorCustomTitle({
  chat_id: "@mysupergroup",
  user_id: 987654321,
  custom_title: "",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// From a message context — sets a custom title for the message sender
// (the sender must already be an admin promoted by the bot)
bot.command("settitle", async (ctx) => {
  const title = ctx.text?.split(" ").slice(1).join(" ") ?? "";
  await ctx.setCustomTitle(title);
  await ctx.send("Title updated!");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: USER_NOT_PARTICIPANT` | The target user is not in the chat |
| 400 | `Bad Request: USER_ADMIN_INVALID` | The user was not promoted by this bot, or is not an admin |
| 400 | `Bad Request: ADMIN_RANK_EMOJI_NOT_ALLOWED` | `custom_title` contains one or more emoji characters |
| 400 | `Bad Request: ADMIN_RANK_INVALID` | `custom_title` exceeds 16 characters |
| 403 | `Forbidden: not enough rights` | Bot lacks the right to manage administrators |
| 403 | `Forbidden: bot is not a member of the supergroup chat` | Bot was removed from the supergroup |

## Tips & Gotchas

- **Bot must have promoted the user.** You can only set a custom title for an administrator your bot promoted via [`promoteChatMember`](/telegram/methods/promoteChatMember). If the user was promoted by another admin or by Telegram, this call will fail with `USER_ADMIN_INVALID`.
- **Emoji are strictly forbidden.** The 0–16 character limit also excludes all emoji — passing any emoji character returns `ADMIN_RANK_EMOJI_NOT_ALLOWED`. Plain ASCII and Unicode letters/punctuation are allowed.
- **Supergroups only.** This method works exclusively in supergroups. Calling it on a regular group, channel, or private chat will return an error.
- **Empty string clears the title.** Passing `custom_title: ""` removes any existing custom title and reverts to the default role badge.
- **Context shorthand is `ctx.setCustomTitle(title)`.** Available in `MessageContext` and other contexts that include `ChatControlMixin`; `chat_id` and `user_id` are inferred from the context.

## See Also

- [`promoteChatMember`](/telegram/methods/promoteChatMember) — promote a user to admin before setting a title
- [`restrictChatMember`](/telegram/methods/restrictChatMember) — restrict member permissions
- [`banChatMember`](/telegram/methods/banChatMember) — ban a member from the chat
- [`getChat`](/telegram/methods/getChat) — retrieve chat info including admin list
