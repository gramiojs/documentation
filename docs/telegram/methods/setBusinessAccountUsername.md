---
title: setBusinessAccountUsername — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the username of a managed Telegram business account using GramIO. TypeScript examples, parameter reference, error handling, and tips for setBusinessAccountUsername.
  - - meta
    - name: keywords
      content: setBusinessAccountUsername, telegram bot api, telegram business account username, gramio setBusinessAccountUsername, set business username typescript, business_connection_id, username, can_change_username, business bot right, how to change business account username telegram bot, setBusinessAccountUsername example
---

# setBusinessAccountUsername

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountusername" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the username of a managed business account. Requires the *can\_change\_username* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="username" type="String" description="The new value of the username for the business account; 0-32 characters" :minLen="0" :maxLen="32" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the username when a business connection is established
bot.on("business_connection", async (ctx) => {
  if (ctx.canEditUsername && ctx.isEnabled) {
    await bot.api.setBusinessAccountUsername({
      business_connection_id: ctx.id,
      username: "myshop_support",
    });
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Change username from a business message command
bot.on("business_message", async (ctx) => {
  if (ctx.text?.startsWith("/setusername") && ctx.businessConnectionId) {
    const newUsername = ctx.text.slice(13).trim();
    await bot.api.setBusinessAccountUsername({
      business_connection_id: ctx.businessConnectionId,
      username: newUsername || undefined, // pass undefined to clear
    });
    await ctx.send(newUsername ? `Username set to @${newUsername}` : "Username cleared.");
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the username (make the account accessible only by ID)
await bot.api.setBusinessAccountUsername({
  business_connection_id: "your_business_connection_id",
  // username omitted — removes the current username
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: USERNAME_INVALID` | `username` contains invalid characters — only letters, digits, and underscores (5–32 chars) are allowed; cannot start with a digit |
| 400 | `Bad Request: USERNAME_OCCUPIED` | The username is already taken by another account — choose a different one |
| 400 | `Bad Request: username is too long` | `username` exceeds 32 characters — shorten it |
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | The `business_connection_id` is invalid or revoked — re-fetch from the `business_connection` event |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_change_username` business right — check `ctx.canEditUsername` before calling |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Omitting `username` removes it.** To clear the current username, omit the field or pass `undefined`. After removal, the account is accessible only via its numeric ID or by sharing a direct link.
- **Username format rules.** Must be 5–32 characters, contain only letters (`a–z`, `A–Z`), digits (`0–9`), or underscores (`_`), and must not start with a digit.
- **Username availability.** There is no "check availability" method — if the username is taken, you'll get `USERNAME_OCCUPIED`. Build a retry UI or fallback in your bot.
- **Check `canEditUsername` before calling.** The bot must have `can_change_username` right. Verify with `ctx.canEditUsername` when handling `business_connection` events.
- **`business_connection_id` must be current.** Retrieve from `ctx.id` in `business_connection` handlers, or `ctx.businessConnectionId` in `business_message` handlers.

## See Also

- [setBusinessAccountName](/telegram/methods/setBusinessAccountName) — change the business account's display name
- [setBusinessAccountBio](/telegram/methods/setBusinessAccountBio) — change the bio
- [setBusinessAccountProfilePhoto](/telegram/methods/setBusinessAccountProfilePhoto) — change the profile photo
- [BusinessConnection](/telegram/types/BusinessConnection) — business connection object with rights (`canEditUsername`, `isEnabled`, etc.)
