---
title: removeChatVerification — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Remove third-party verification from a chat using GramIO. TypeScript examples, error table, and tips for managing Telegram third-party verification with your bot.
  - - meta
    - name: keywords
      content: removeChatVerification, telegram bot api, telegram remove chat verification, gramio removeChatVerification, removeChatVerification typescript, removeChatVerification example, third-party verification telegram, telegram bot unverify chat, chat_id, how to remove verification telegram bot
---

# removeChatVerification

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#removechatverification" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Removes verification from a chat that is currently verified [on behalf of the organization](https://telegram.org/verify#third-party-verification) represented by the bot. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove verification from a chat by numeric ID
await bot.api.removeChatVerification({ chat_id: -1001234567890 });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove verification from a public channel by username
await bot.api.removeChatVerification({ chat_id: "@mychannel" });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove verification in a command handler
bot.command("unverify", async (ctx) => {
  const chatId = ctx.args; // e.g. "@somechannel" passed as argument
  if (!chatId) return ctx.reply("Please provide a chat username.");

  await bot.api.removeChatVerification({ chat_id: chatId });
  await ctx.reply(`Verification removed from ${chatId}.`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid, the bot is not a member, or the chat doesn't exist |
| 400 | `Bad Request: CHAT_NOT_VERIFIED` | The target chat is not currently verified by this organization — check before calling |
| 403 | `Forbidden: not enough rights` | The bot's organization does not have third-party verification rights granted by Telegram |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Only for approved verification organizations.** This method is part of Telegram's [third-party verification](https://telegram.org/verify#third-party-verification) system. The bot must belong to an organization that Telegram has explicitly granted the ability to verify chats. Regular bots cannot use this.
- **Verification state is not observable via the API.** There is no dedicated method to check whether a chat is verified by your organization. Keep track of which chats you've verified in your own database before calling `removeChatVerification`.
- **`chat_id` accepts `@username` strings** for public chats and channels. Private supergroups always require the numeric ID.
- **Removing verification is permanent** until you re-verify with `verifyChat`. If re-verification is needed immediately, call `verifyChat` after this method.

## See Also

- [`verifyChat`](/telegram/methods/verifyChat) — verify a chat on behalf of your organization
- [`verifyUser`](/telegram/methods/verifyUser) — verify an individual user
- [`removeUserVerification`](/telegram/methods/removeUserVerification) — remove verification from a user
