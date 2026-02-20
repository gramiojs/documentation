---
title: removeUserVerification — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Remove third-party verification from a user using GramIO. TypeScript examples, error table, and tips for managing Telegram third-party verification with your bot.
  - - meta
    - name: keywords
      content: removeUserVerification, telegram bot api, telegram remove user verification, gramio removeUserVerification, removeUserVerification typescript, removeUserVerification example, third-party verification telegram, telegram bot unverify user, user_id, how to remove user verification telegram bot
---

# removeUserVerification

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#removeuserverification" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Removes verification from a user who is currently verified [on behalf of the organization](https://telegram.org/verify#third-party-verification) represented by the bot. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove verification from a user by their numeric ID
await bot.api.removeUserVerification({ user_id: 123456789 });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove verification when a user triggers a command
bot.command("unverify", async (ctx) => {
  if (!ctx.from) return;
  await bot.api.removeUserVerification({ user_id: ctx.from.id });
  await ctx.reply("Your verification has been removed.");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove verification for a specific user passed as a command argument
bot.command("unverifyuser", async (ctx) => {
  const userId = Number(ctx.args);
  if (!userId || isNaN(userId)) return ctx.reply("Usage: /unverifyuser <user_id>");

  await bot.api.removeUserVerification({ user_id: userId });
  await ctx.reply(`Verification removed from user ${userId}.`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | `user_id` does not exist or the bot has never interacted with this user |
| 400 | `Bad Request: USER_NOT_VERIFIED` | The target user is not currently verified by this organization — check before calling |
| 403 | `Forbidden: not enough rights` | The bot's organization does not have third-party verification rights granted by Telegram |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Only for approved verification organizations.** This method is part of Telegram's [third-party verification](https://telegram.org/verify#third-party-verification) system. The bot must belong to an organization that Telegram has explicitly granted the ability to verify users. Regular bots cannot use this.
- **Track verified users yourself.** There is no API method to query which users your organization has verified. Maintain a list in your database to avoid calling `removeUserVerification` on users who aren't verified.
- **`user_id` must be numeric.** Unlike `chat_id`, user IDs cannot be specified as `@username` strings — always use the numeric integer ID.
- **Re-verification is possible.** After removing verification, you can call `verifyUser` again at any time to re-grant the checkmark.

## See Also

- [`verifyUser`](/telegram/methods/verifyUser) — verify a user on behalf of your organization
- [`verifyChat`](/telegram/methods/verifyChat) — verify a chat on behalf of your organization
- [`removeChatVerification`](/telegram/methods/removeChatVerification) — remove verification from a chat
