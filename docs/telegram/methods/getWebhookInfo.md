---
title: getWebhookInfo — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get current webhook status using GramIO. Check URL, pending update count, last error, allowed_updates, and max_connections. TypeScript reference with examples.
  - - meta
    - name: keywords
      content: getWebhookInfo, telegram bot api, gramio getWebhookInfo, getWebhookInfo typescript, getWebhookInfo example, webhook status telegram, check webhook telegram bot, telegram webhook info, pending_update_count, last_error_message, WebhookInfo, telegram bot webhook monitoring
---

# getWebhookInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/WebhookInfo">WebhookInfo</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getwebhookinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get current webhook status. Requires no parameters. On success, returns a [WebhookInfo](https://core.telegram.org/bots/api#webhookinfo) object. If the bot is using [getUpdates](https://core.telegram.org/bots/api#getupdates), will return an object with the *url* field empty.

## Returns

On success, the [WebhookInfo](/telegram/types/WebhookInfo) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

Check whether a webhook is configured and inspect its current status:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const info = await bot.api.getWebhookInfo();

if (!info.url) {
  console.log("No webhook set — bot is using long polling");
} else {
  console.log("Webhook URL:", info.url);
  console.log("Pending updates:", info.pending_update_count);
}
```

Monitor webhook health by checking for recent delivery errors:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const info = await bot.api.getWebhookInfo();

if (info.last_error_date) {
  const errorTime = new Date(info.last_error_date * 1000);
  console.error(`Webhook error at ${errorTime.toISOString()}: ${info.last_error_message}`);
}
```

Inspect `allowed_updates` and connection settings for debugging:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const info = await bot.api.getWebhookInfo();

console.log("Max connections:", info.max_connections);
console.log("Allowed updates:", info.allowed_updates ?? "all types");
console.log("IP address:", info.ip_address ?? "not set");
```

## Errors

This method requires no parameters and is read-only, so errors are rare:

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized` | Invalid bot token — verify `BOT_TOKEN` is correct |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **`url` is empty when using long polling.** If `getUpdates` is active, the returned object has `url: ""`. This is normal — not an error.
- **`pending_update_count` reveals backlog.** A high value means your webhook endpoint is slow or unreachable. Always check `last_error_message` alongside it to diagnose the cause.
- **`last_error_date` is a Unix timestamp.** Multiply by 1000 for JavaScript `Date`: `new Date(info.last_error_date * 1000)`.
- **Use this for health checks.** Poll `getWebhookInfo` from your monitoring system to detect webhook delivery failures before users notice.
- **`allowed_updates` omitted means all updates.** If the field is absent in the response, Telegram delivers every update type to your webhook.

## See Also

- [setWebhook](/telegram/methods/setWebhook) — configure the webhook URL and settings
- [deleteWebhook](/telegram/methods/deleteWebhook) — remove the webhook and switch to long polling
- [getUpdates](/telegram/methods/getUpdates) — alternative update delivery via long polling
- [WebhookInfo](/telegram/types/WebhookInfo) — the returned object type
- [Webhook guide](/updates/webhook) — complete GramIO webhook setup guide
