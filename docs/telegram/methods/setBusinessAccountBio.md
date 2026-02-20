---
title: setBusinessAccountBio — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the bio of a managed Telegram business account using GramIO. TypeScript examples, parameter reference, error handling, and tips for setBusinessAccountBio.
  - - meta
    - name: keywords
      content: setBusinessAccountBio, telegram bot api, telegram business account bio, gramio setBusinessAccountBio, set business bio typescript, business_connection_id, bio, can_change_bio, business bot right, how to change business account bio telegram bot, setBusinessAccountBio example
---

# setBusinessAccountBio

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountbio" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the bio of a managed business account. Requires the *can\_change\_bio* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="bio" type="String" description="The new value of the bio for the business account; 0-140 characters" :minLen="0" :maxLen="140" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the bio when a business connection is established
bot.on("business_connection", async (ctx) => {
  if (ctx.canEditBio && ctx.isEnabled) {
    await bot.api.setBusinessAccountBio({
      business_connection_id: ctx.id,
      bio: "Your trusted assistant — available 24/7. Reply within minutes.",
    });
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update bio from within a business message handler
bot.on("business_message", async (ctx) => {
  if (ctx.text === "/setbio" && ctx.businessConnectionId) {
    await bot.api.setBusinessAccountBio({
      business_connection_id: ctx.businessConnectionId,
      bio: "Automated replies powered by GramIO.",
    });
    await ctx.send("Bio updated!");
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Clear the bio by omitting it (or passing an empty string)
await bot.api.setBusinessAccountBio({
  business_connection_id: "your_business_connection_id",
  // bio omitted — clears the current bio
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: bio is too long` | `bio` exceeds 140 characters — truncate before sending |
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | The `business_connection_id` is invalid or the connection was revoked — re-fetch from the `business_connection` event |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_change_bio` business right — check `ctx.canEditBio` before calling |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` field, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Bio limit is 140 characters.** Count carefully — Unicode characters like emoji count as multiple characters in some contexts; always validate on the bot side before calling.
- **Omitting `bio` clears it.** To remove the current bio, omit the `bio` field entirely or pass an empty string.
- **Check `canEditBio` before calling.** The bot must have the `can_change_bio` business right granted by the account owner. Calling without this right returns a 403 error.
- **`business_connection_id` must be current.** Store the connection ID when handling `business_connection` events (`ctx.id`). In `business_message` handlers, use `ctx.businessConnectionId`.
- **Connection can be revoked.** Business owners can revoke bot access at any time. Handle `BUSINESS_CONNECTION_INVALID` gracefully and stop operations for that connection.

## See Also

- [setBusinessAccountName](/telegram/methods/setBusinessAccountName) — change the business account's display name
- [setBusinessAccountUsername](/telegram/methods/setBusinessAccountUsername) — change the business account's username
- [setBusinessAccountProfilePhoto](/telegram/methods/setBusinessAccountProfilePhoto) — change the profile photo
- [BusinessConnection](/telegram/types/BusinessConnection) — business connection object with rights (`canEditBio`, `isEnabled`, etc.)
