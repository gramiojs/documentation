---
title: close — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Close the bot instance before migrating to another local server using GramIO. Requires webhook deletion first. Returns True. Must wait 10 minutes after bot launch.
  - - meta
    - name: keywords
      content: close, telegram bot api, close bot instance, gramio close, telegram bot server migration, local bot api server, close bot typescript, stop bot instance, bot shutdown telegram
---

# close

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#close" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns _True_ on success. Requires no parameters.

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Gracefully shut down the bot before migrating to another local server
await bot.api.deleteWebhook();
await bot.api.close();
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Full shutdown sequence with error handling
async function migrateBotServer() {
  try {
    // Step 1: Stop receiving updates
    await bot.api.deleteWebhook({ drop_pending_updates: true });

    // Step 2: Close the bot instance on the current server
    await bot.api.close();

    console.log("Bot instance closed. Safe to restart on new server.");
  } catch (error) {
    console.error("Shutdown failed:", error);
  }
}

await migrateBotServer();
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 429 | `Too Many Requests: retry after N` | Called within the first 10 minutes of bot launch — wait until the cooldown expires before calling `close` |
| 401 | `Unauthorized` | Invalid bot token — the bot cannot authenticate with the API |

## Tips & Gotchas

- **Must delete the webhook first.** If a webhook is still active, Telegram may re-launch the bot after the server restarts. Always call [`deleteWebhook`](/telegram/methods/deleteWebhook) before `close`.
- **10-minute cooldown after launch.** Calling `close` within the first 10 minutes of the bot being launched returns a `429` error. Plan your migration window accordingly.
- **Only relevant for Local Bot API Server.** The `close` method is designed for self-hosted [Local Bot API Server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) deployments. Standard bots using Telegram's cloud servers do not need to call this.
- **Use [`logOut`](/telegram/methods/logOut) instead for cloud-to-local migration.** If you are migrating from Telegram's cloud servers to a local server, call `logOut` first, not `close`.

## See Also

- [`logOut`](/telegram/methods/logOut) — log out from Telegram's cloud servers before switching to a local server
- [`deleteWebhook`](/telegram/methods/deleteWebhook) — must be called before `close` to stop incoming updates
- [`setWebhook`](/telegram/methods/setWebhook) — register a new webhook after migration
