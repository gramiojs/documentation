---
title: setChatTitle — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change a Telegram group, supergroup, or channel title using GramIO. TypeScript examples, required admin rights, 128-character limit, and error handling.
  - - meta
    - name: keywords
      content: setChatTitle, telegram bot api, telegram bot change chat title, gramio setChatTitle, setChatTitle typescript, setChatTitle example, change group title telegram bot, telegram rename chat, chat_id, title, can_change_info, how to rename telegram group bot
---

# setChatTitle

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchattitle" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="title" type="String" required description="New chat title, 1-128 characters" :minLen="1" :maxLen="128" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename the current chat from inside a command handler
bot.command("rename", (ctx) =>
  ctx.setChatTitle("New Group Name")
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename via direct API call — useful from outside a handler
await bot.api.setChatTitle({
  chat_id: -1001234567890,
  title: "My Awesome Channel",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename a public channel by username
await bot.api.setChatTitle({
  chat_id: "@mychannel",
  title: "Updated Channel Name",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is a member |
| 400 | `Bad Request: not enough rights to change chat title` | Bot lacks the `can_change_info` administrator permission |
| 400 | `Bad Request: title is too long` | `title` exceeds 128 characters — trim before sending |
| 400 | `Bad Request: title can't be empty` | Empty string passed as `title` — minimum 1 character |
| 400 | `Bad Request: can't change title of private chats` | Attempted to rename a private (DM) chat — not allowed |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot is not in the channel — add it first |
| 403 | `Forbidden: not enough rights` | Bot was removed from admin or rights were revoked |

## Tips & Gotchas

- **Private chats cannot be renamed.** This method only works for groups, supergroups, and channels. Calling it with a private chat `chat_id` always returns an error.
- **`can_change_info` right is required.** Even if the bot is an admin, it must have this specific right. Check with [`getChatAdministrators`](/telegram/methods/getChatAdministrators) if unsure.
- **`chat_id` accepts `@username` strings** for public channels and supergroups. For private groups you must use the numeric ID.
- **Title length is 1–128 characters.** Telegram strips leading/trailing whitespace on the client side, but the API enforces the byte length limit — multi-byte characters count as multiple bytes.
- **Rate limiting applies.** Rapidly renaming a chat (e.g., in a loop) will trigger `429 Too Many Requests`. Throttle rename operations or use the [auto-retry plugin](/plugins/official/auto-retry).

## See Also

- [`setChatDescription`](/telegram/methods/setChatDescription) — change the chat bio/description
- [`setChatPhoto`](/telegram/methods/setChatPhoto) — change the chat profile photo
- [`setChatPermissions`](/telegram/methods/setChatPermissions) — set default member permissions
- [`getChatAdministrators`](/telegram/methods/getChatAdministrators) — verify the bot's admin rights
