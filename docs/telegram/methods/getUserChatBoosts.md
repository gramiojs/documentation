---
title: getUserChatBoosts — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get all boosts a user has added to a chat using GramIO and TypeScript. Check boost count, gate features behind channel boosts, and inspect boost sources.
  - - meta
    - name: keywords
      content: getUserChatBoosts, telegram bot api, gramio getUserChatBoosts, getUserChatBoosts typescript, getUserChatBoosts example, telegram channel boosts, telegram user boosts, check user boosts, chat_id, user_id, UserChatBoosts, ChatBoost, how to check telegram boosts, telegram boost gating
---

# getUserChatBoosts

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/UserChatBoosts">UserChatBoosts</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getuserchatboosts" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a [UserChatBoosts](https://core.telegram.org/bots/api#userchatboosts) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the chat or username of the channel (in the format `@channelusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

## Returns

On success, the [UserChatBoosts](/telegram/types/UserChatBoosts) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get all boosts a user has added to a channel:
const result = await bot.api.getUserChatBoosts({
  chat_id: "@mychannel",
  user_id: 12345678,
});

console.log(`User has ${result.boosts.length} active boosts`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Gate a feature behind at least one channel boost:
bot.command("exclusive", async (ctx) => {
  if (!ctx.from) return;

  const result = await bot.api.getUserChatBoosts({
    chat_id: ctx.chat.id,
    user_id: ctx.from.id,
  });

  if (result.boosts.length === 0) {
    return ctx.send("Boost our channel to unlock this feature!");
  }

  await ctx.send(`Welcome, booster! You have ${result.boosts.length} active boost(s).`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Require a minimum number of boosts for premium access:
bot.command("premium", async (ctx) => {
  if (!ctx.from) return;

  const result = await bot.api.getUserChatBoosts({
    chat_id: ctx.chat.id,
    user_id: ctx.from.id,
  });

  const boostCount = result.boosts.length;
  const required = 3;

  if (boostCount < required) {
    return ctx.send(`You need ${required - boostCount} more boost(s) to access premium content.`);
  }

  await ctx.send("Premium access granted!");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is a member of the chat |
| 400 | `Bad Request: user not found` | The `user_id` doesn't correspond to a known user |
| 400 | `Bad Request: not enough rights` | Bot is not an administrator in the specified chat |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the channel |

## Tips & Gotchas

- **Bot must be an administrator.** The bot needs admin rights in the target chat — this method fails with a 400 error for non-admin bots.
- **Works for channels and supergroups.** You can pass either a numeric `chat_id` or a `@username` for public channels. For supergroups, use the numeric ID.
- **Empty `boosts` array means no active boosts.** The method succeeds even if the user has never boosted — check `result.boosts.length === 0` rather than expecting an error.
- **Boost source inspection.** Each `ChatBoost` in `result.boosts` includes an `expiration_date` and a `source` field (`ChatBoostSource`) indicating whether it came from Telegram Premium, a giveaway, or a gift code.
- **No caching.** Boosts can expire at any time — always fetch fresh data when making access decisions rather than caching the result.

## See Also

- [UserChatBoosts](/telegram/types/UserChatBoosts) — return type with the boosts array
- [ChatBoost](/telegram/types/ChatBoost) — individual boost entry structure
- [ChatBoostSource](/telegram/types/ChatBoostSource) — union type for boost origin (Premium, giveaway, gift code)
- [getMe](/telegram/methods/getMe) — confirm the bot identity before admin checks
