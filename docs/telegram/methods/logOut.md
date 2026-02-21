---
title: logOut — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Log out from the Telegram cloud Bot API server using GramIO before running your bot locally. Required before using a local Bot API server. TypeScript examples included.
  - - meta
    - name: keywords
      content: logOut, telegram bot api, gramio logOut, logOut typescript, logOut example, telegram bot logout, local bot api server, telegram bot local server, log out telegram bot, cloud bot api logout, how to run telegram bot locally
---

# logOut

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#logout" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns *True* on success. Requires no parameters.

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Log out before switching to a local Bot API server:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Call once before migrating to local server — required step
const result = await bot.api.logOut();
console.log("Logged out from cloud API:", result); // true
```

One-time migration script — log out then connect to local server:

```ts twoslash
import { Bot } from "gramio";

// Step 1: Connect to cloud API and log out
const cloudBot = new Bot(process.env.BOT_TOKEN ?? "");
await cloudBot.api.logOut();
console.log("Successfully logged out from cloud Bot API.");
console.log("You can now start your local Bot API server.");
console.log("Note: cloud login won't be available for 10 minutes.");

// Step 2: In your next session, connect to local server:
// const localBot = new Bot(process.env.BOT_TOKEN ?? "", {
//   api: { baseURL: "http://localhost:8081" }
// });
```

Graceful shutdown with logout before going offline:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await bot.api.logOut();
  process.exit(0);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized` | Invalid bot token — verify the token is correct before logging out |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` before retrying |

## Tips & Gotchas

- **You must log out before running a local Bot API server.** If you skip this step, Telegram may deliver updates to the cloud server instead of your local one, causing missed messages.
- **10-minute cloud lockout after logout.** Once you call `logOut`, you cannot reconnect to `api.telegram.org` for 10 minutes. Plan migrations accordingly — do not call it in a test environment unless intentional.
- **This is a one-way operation in the short term.** After `logOut`, connect immediately to your local Bot API server. If you need to revert, wait the full 10 minutes before using the cloud API again.
- **No parameters needed.** Unlike most Bot API methods, `logOut` takes no arguments. Just call it and handle the result.
- **`close` is different from `logOut`.** The [close](/telegram/methods/close) method gracefully closes the bot instance without logging out — use that for restarts, and `logOut` only when migrating to local.

## See Also

- [close](/telegram/methods/close) — gracefully close the bot instance without logging out (use for restarts)
- [deleteWebhook](/telegram/methods/deleteWebhook) — remove webhook before switching to local polling mode
- [getWebhookInfo](/telegram/methods/getWebhookInfo) — check current webhook status before migrating
