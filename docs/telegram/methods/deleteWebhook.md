---
title: deleteWebhook — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Remove Telegram webhook and switch back to getUpdates using GramIO. TypeScript examples, drop_pending_updates flag, polling migration guide, and error reference.
  - - meta
    - name: keywords
      content: deleteWebhook, telegram bot api, remove webhook telegram bot, gramio deleteWebhook, deleteWebhook typescript, drop_pending_updates, switch to polling, telegram bot webhook to polling, getUpdates, deleteWebhook example
---

# deleteWebhook

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletewebhook" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to remove webhook integration if you decide to switch back to [getUpdates](https://core.telegram.org/bots/api#getupdates). Returns _True_ on success.

## Parameters

<ApiParam name="drop_pending_updates" type="Boolean" required description="Pass _True_ to drop all pending updates" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove webhook and preserve pending updates for processing
await bot.api.deleteWebhook({});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove webhook and discard all queued updates (clean start)
await bot.api.deleteWebhook({ drop_pending_updates: true });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check current webhook status, then remove if active
const info = await bot.api.getWebhookInfo({});

if (info.url) {
  console.log(`Removing webhook: ${info.url}`);
  await bot.api.deleteWebhook({ drop_pending_updates: true });
  console.log("Webhook removed. Switching to long polling.");
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove webhook as part of bot shutdown / maintenance script
async function disableWebhook() {
  await bot.api.deleteWebhook({ drop_pending_updates: false });
  console.log("Webhook removed. Pending updates preserved for next startup.");
}

await disableWebhook();
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized` | Invalid bot token — double-check the token passed to `Bot("")` |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`deleteWebhook` is idempotent.** Calling it when no webhook is set returns `True` without error — safe to call during any startup/reset sequence.
- **`drop_pending_updates: true` is a one-way operation.** All queued updates that arrived while the webhook was active are permanently discarded. Use this for a clean restart; omit it (or pass `false`) if you want to process accumulated messages.
- **You must delete the webhook before using `getUpdates`.** If an active webhook is registered, `getUpdates` returns an error. Always call `deleteWebhook` first when switching to long polling mode.
- **Webhook removal does not stop your HTTP server.** The Telegram API stops sending requests, but your HTTPS server continues running. You must handle the server lifecycle separately.
- **Use `getWebhookInfo` to inspect the current state.** Before deleting, you can call `getWebhookInfo` to confirm whether a webhook is active and how many pending updates exist.
- **GramIO handles webhook lifecycle in `bot.start()`.** When you call `bot.start()` for long polling mode, GramIO automatically removes any existing webhook. Manual `deleteWebhook` calls are mainly needed in scripts or migration utilities.

## See Also

- [setWebhook](/telegram/methods/setWebhook) — register a webhook URL
- [getWebhookInfo](/telegram/methods/getWebhookInfo) — inspect the current webhook configuration
- [getUpdates](/telegram/methods/getUpdates) — long polling alternative to webhooks
- [Webhook guide](/guides/webhook) — full guide for setting up webhooks with GramIO
