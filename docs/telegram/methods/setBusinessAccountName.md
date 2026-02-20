---
title: setBusinessAccountName — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the first and last name of a managed Telegram business account using GramIO. TypeScript examples, parameter reference, error handling, and tips for setBusinessAccountName.
  - - meta
    - name: keywords
      content: setBusinessAccountName, telegram bot api, telegram business account name, gramio setBusinessAccountName, set business name typescript, business_connection_id, first_name, last_name, can_change_name, business bot right, how to change business account name telegram bot, setBusinessAccountName example
---

# setBusinessAccountName

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountname" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the first and last name of a managed business account. Requires the *can\_change\_name* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="first_name" type="String" required description="The new value of the first name for the business account; 1-64 characters" :minLen="1" :maxLen="64" />

<ApiParam name="last_name" type="String" description="The new value of the last name for the business account; 0-64 characters" :minLen="0" :maxLen="64" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the display name when a business connection is established
bot.on("business_connection", async (ctx) => {
  if (ctx.canEditName && ctx.isEnabled) {
    await bot.api.setBusinessAccountName({
      business_connection_id: ctx.id,
      first_name: "Acme",
      last_name: "Support",
    });
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update name from a business message handler
bot.on("business_message", async (ctx) => {
  if (ctx.text?.startsWith("/rename") && ctx.businessConnectionId) {
    const newName = ctx.text.slice(8).trim(); // e.g. "/rename NewShop"
    await bot.api.setBusinessAccountName({
      business_connection_id: ctx.businessConnectionId,
      first_name: newName,
      // last_name omitted — clears the last name
    });
    await ctx.send(`Name updated to: ${newName}`);
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set only a first name (no last name)
await bot.api.setBusinessAccountName({
  business_connection_id: "your_business_connection_id",
  first_name: "My Online Store",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: first_name is empty` | `first_name` is required and must be 1–64 characters — never send an empty string |
| 400 | `Bad Request: first_name is too long` | `first_name` exceeds 64 characters — truncate before calling |
| 400 | `Bad Request: last_name is too long` | `last_name` exceeds 64 characters — truncate before calling |
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | The `business_connection_id` is invalid or revoked — re-fetch from the `business_connection` event |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_change_name` business right — check `ctx.canEditName` before calling |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`first_name` is required and must be 1–64 characters.** Unlike the bio, you cannot omit or clear the first name — it always needs a non-empty value.
- **Omitting `last_name` clears it.** If the account currently has a last name and you don't pass `last_name`, it will be removed.
- **Check `canEditName` before calling.** The bot must have `can_change_name` right. Verify with `ctx.canEditName` when handling `business_connection` events.
- **Name changes are visible immediately** in Telegram. Be careful with automated renames — avoid changing the name too frequently or users may become confused.
- **`business_connection_id` must be current.** Retrieve from `ctx.id` in `business_connection` handlers, or `ctx.businessConnectionId` in `business_message` handlers.

## See Also

- [setBusinessAccountBio](/telegram/methods/setBusinessAccountBio) — change the business account's bio
- [setBusinessAccountUsername](/telegram/methods/setBusinessAccountUsername) — change the business account's username
- [setBusinessAccountProfilePhoto](/telegram/methods/setBusinessAccountProfilePhoto) — change the profile photo
- [BusinessConnection](/telegram/types/BusinessConnection) — business connection object with rights (`canEditName`, `isEnabled`, etc.)
