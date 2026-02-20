---
title: getBusinessConnection — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get information about a bot's connection with a Telegram business account using GramIO. Returns BusinessConnection with user, status, rights, and connection date.
  - - meta
    - name: keywords
      content: getBusinessConnection, telegram bot api, business connection, gramio getBusinessConnection, getBusinessConnection typescript, getBusinessConnection example, BusinessConnection, business_connection_id, telegram business bot, bot business account, business bot rights, is_enabled
---

# getBusinessConnection

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/BusinessConnection">BusinessConnection</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getbusinessconnection" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get information about the connection of the bot with a business account. Returns a [BusinessConnection](https://core.telegram.org/bots/api#businessconnection) object on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

## Returns

On success, the [BusinessConnection](/telegram/types/BusinessConnection) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get full details of a business connection
const connection = await bot.api.getBusinessConnection({
  business_connection_id: "bc_123",
});

console.log(`User: ${connection.user.first_name} (ID: ${connection.user.id})`);
console.log(`Connected: ${new Date(connection.date * 1000).toLocaleDateString()}`);
console.log(`Active: ${connection.is_enabled}`);

if (connection.rights) {
  console.log(`Can reply: ${connection.rights.can_reply}`);
  console.log(`Can delete all messages: ${connection.rights.can_delete_all_messages}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check if a stored connection is still active before acting on it
async function isConnectionActive(connectionId: string): Promise<boolean> {
  try {
    const connection = await bot.api.getBusinessConnection({
      business_connection_id: connectionId,
    });
    return connection.is_enabled;
  } catch {
    return false;
  }
}

if (await isConnectionActive("bc_123")) {
  console.log("Connection is active — safe to send");
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// React to connection/disconnection events and fetch full details
bot.on("business_connection", async (ctx) => {
  if (ctx.isEnabled) {
    // Re-fetch to get the latest rights configuration
    const connection = await bot.api.getBusinessConnection({
      business_connection_id: ctx.id,
    });
    console.log(`New connection from user ${connection.user.id}`);
    console.log(`Can view gifts: ${connection.rights?.can_view_gifts_and_stars}`);
  } else {
    console.log(`Connection ${ctx.id} was disabled`);
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` doesn't exist, was revoked, or belongs to a different bot — store IDs from updates only |
| 403 | `Forbidden: bot was blocked by the user` | The business account owner blocked the bot |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`business_connection_id` comes from Telegram updates, not invented values.** You receive this ID in `business_connection`, `business_message`, `edited_business_message`, and `deleted_business_messages` updates. Store it persistently if you need to query later.
- **Always check `is_enabled` before acting.** A connection can be disabled by the business account owner at any time without prior notice. Treat a disabled connection as read-only — don't attempt to send or manage messages through it.
- **`rights` can be `undefined`.** Not every business connection grants the same permissions. Guard every access: `connection.rights?.can_reply ?? false`. The `BusinessBotRights` object lists all granular permissions.
- **`user_chat_id` is the private chat ID with the account owner.** Useful if you want to reach the business user directly — as long as they haven't blocked the bot.
- **`date` is a Unix timestamp.** Convert with `new Date(connection.date * 1000)` for display.
- **IDs are stable.** A given connection always has the same `id` for its lifetime — cache it safely.

## See Also

- [`getBusinessAccountGifts`](/telegram/methods/getBusinessAccountGifts) — get gifts owned by this business account
- [`getBusinessAccountStarBalance`](/telegram/methods/getBusinessAccountStarBalance) — get the Star balance of this business account
- [`BusinessConnection`](/telegram/types/BusinessConnection) — the full return type
- [`BusinessBotRights`](/telegram/types/BusinessBotRights) — the rights object detailing what the bot can do
