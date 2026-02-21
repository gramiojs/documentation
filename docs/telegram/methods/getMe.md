---
title: getMe — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Verify your Telegram bot token and get bot identity using GramIO. TypeScript examples for getMe — startup health checks, reading bot capabilities, and accessing bot-specific User fields.
  - - meta
    - name: keywords
      content: getMe, telegram bot api, gramio getMe, getMe typescript, telegram bot token verify, get bot info, telegram bot identity, TelegramUser bot, can_join_groups, supports_inline_queries, has_main_web_app, getMe example, how to get bot username telegram
---

# getMe

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/User">User</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getme" target="_blank" rel="noopener">Official docs ↗</a>
</div>

A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a [User](https://core.telegram.org/bots/api#user) object.

## Returns

On success, the [User](/telegram/types/User) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify the token and log the bot's identity
const me = await bot.api.getMe();
console.log(`Logged in as @${me.username} (ID: ${me.id})`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read bot-specific capability flags
const me = await bot.api.getMe();

console.log(`Username:              @${me.username}`);
console.log(`Can join groups:       ${me.can_join_groups}`);
console.log(`Privacy mode off:      ${me.can_read_all_group_messages}`);
console.log(`Supports inline:       ${me.supports_inline_queries}`);
console.log(`Business integration:  ${me.can_connect_to_business}`);
console.log(`Has main Web App:      ${me.has_main_web_app}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Use getMe for a startup health check before launching
async function start() {
  const me = await bot.api.getMe();
  console.log(`Bot @${me.username} is ready`);
  await bot.start();
}

start();
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Conditionally register inline query handler only if the bot supports it
const me = await bot.api.getMe();

if (me.supports_inline_queries) {
  bot.on("inline_query", (ctx) => ctx.answer([]));
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized: invalid token specified` | The bot token is wrong or has been revoked — check `BOT_TOKEN` env var |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Call it once at startup, not repeatedly.** `getMe` is useful for a one-time token validation and capability check. The returned data doesn't change at runtime — cache it rather than calling on every update.
- **Bot-specific fields are only present in `getMe` responses.** Fields like `can_join_groups`, `can_read_all_group_messages`, `supports_inline_queries`, `can_connect_to_business`, and `has_main_web_app` are only returned by `getMe` — they are absent from `User` objects you receive in updates.
- **`can_read_all_group_messages: true` means privacy mode is disabled.** By default bots only receive messages that mention them; disabling privacy mode lets the bot read all group messages. This is configured in [@BotFather](https://t.me/BotFather).
- **A failed `getMe` call is always a token problem.** If this call throws `401 Unauthorized`, the token is wrong or the bot was deleted. No other recovery is possible.
- **`is_bot` is always `true`.** For the object returned by `getMe`, `is_bot` will always be `true` — you can use it to distinguish bots from regular users in other contexts.

## See Also

- [User](/telegram/types/User) — return type (with bot-only optional fields)
- [getMyCommands](/telegram/methods/getMyCommands) — get commands registered for this bot
- [getMyDefaultAdministratorRights](/telegram/methods/getMyDefaultAdministratorRights) — get the bot's default admin rights
- [getMyName](/telegram/methods/getMyName) — get the bot's display name
- [getMyDescription](/telegram/methods/getMyDescription) — get the bot's description
