---
title: verifyUser — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Verify a Telegram user on behalf of your organization using GramIO with TypeScript. Add third-party verification badges to user accounts via bot API.
  - - meta
    - name: keywords
      content: verifyUser, telegram bot api, verify user telegram bot, gramio verifyUser, verifyUser typescript, verifyUser example, user_id, custom_description, third-party verification, telegram verification badge, removeUserVerification, how to verify user telegram bot
---

# verifyUser

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#verifyuser" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Verifies a user [on behalf of the organization](https://telegram.org/verify#third-party-verification) which is represented by the bot. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="custom_description" type="String" description="Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description." :minLen="0" :maxLen="70" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify a user by their numeric ID
await bot.api.verifyUser({
  user_id: 123456789,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify a user with a custom description
await bot.api.verifyUser({
  user_id: 123456789,
  custom_description: "Verified member",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify a user from a message context
bot.command("verify", async (ctx) => {
  const replyMsg = ctx.replyToMessage;
  if (!replyMsg?.from) return ctx.reply("Reply to a user's message.");

  await bot.api.verifyUser({
    user_id: replyMsg.from.id,
    custom_description: "Verified by admin",
  });

  await ctx.reply(`User ${replyMsg.from.id} has been verified.`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove user verification
await bot.api.removeUserVerification({
  user_id: 123456789,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: USER_NOT_FOUND` | `user_id` is invalid or the user has never interacted with the bot |
| 400 | `Bad Request: custom description not allowed` | Your organization isn't authorized to provide custom descriptions — omit the field or pass an empty string |
| 400 | `Bad Request: user can't be verified` | The target user cannot be verified in the current context (e.g. bots cannot be verified) |
| 403 | `Forbidden: not enough rights` | The bot hasn't been granted third-party verification permissions by Telegram |

## Tips & Gotchas

- **Only bots with explicit Telegram approval can use this method.** Third-party verification is not available to arbitrary bots — your organization must be approved at [telegram.org/verify](https://telegram.org/verify#third-party-verification).
- **`custom_description` is 0–70 characters.** If your organization is not permitted to set custom descriptions, pass an empty string or omit the field — otherwise the call returns an error.
- **The user must have started a conversation with the bot.** Telegram needs to resolve the `user_id`, so the user must have at least sent a message to the bot previously.
- **To update the description, call `verifyUser` again.** Re-calling with a new description replaces the existing one.
- **To remove the verification badge, call `removeUserVerification`.** Verification is not permanent and can be revoked at any time.

## See Also

- [removeUserVerification](/telegram/methods/removeUserVerification)
- [verifyChat](/telegram/methods/verifyChat)
- [removeChatVerification](/telegram/methods/removeChatVerification)
