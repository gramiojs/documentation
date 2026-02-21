---
title: getUpdates — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Receive incoming Telegram updates using long polling with GramIO and TypeScript. Learn offset confirmation, allowed_updates filtering, and when to use getUpdates vs. webhooks.
  - - meta
    - name: keywords
      content: getUpdates, telegram bot api, gramio getUpdates, getUpdates typescript, getUpdates example, telegram long polling, telegram polling bot, allowed_updates, update offset, how to receive telegram updates, telegram bot polling vs webhook, getUpdates offset confirmation
---

# getUpdates

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Update">Update[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getupdates" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to receive incoming updates using long polling ([wiki](https://en.wikipedia.org/wiki/Push_technology#Long_polling)). Returns an Array of [Update](https://core.telegram.org/bots/api#update) objects.

## Parameters

<ApiParam name="offset" type="Integer" description="Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as [getUpdates](https://core.telegram.org/bots/api#getupdates) is called with an *offset* higher than its *update\_id*. The negative offset can be specified to retrieve updates starting from *\-offset* update from the end of the updates queue. All previous updates will be forgotten." />

<ApiParam name="limit" type="Integer" description="Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100." :min="1" :max="100" :defaultValue="100" />

<ApiParam name="timeout" type="Integer" description="Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only." :defaultValue="0" />

<ApiParam name="allowed_updates" type="String[]" description="A JSON-serialized list of the update types you want your bot to receive. For example, specify `[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except *chat\_member*, *message\_reaction*, and *message\_reaction\_count* (default). If not specified, the previous setting will be used.      Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time." semanticType="updateType" />

## Returns

On success, an array of [Update](/telegram/types/Update) objects is returned.

<!-- GENERATED:END -->

## GramIO Usage

GramIO handles long polling automatically when you call `bot.start()`. Direct `bot.api.getUpdates()` calls are useful for manual polling loops, debugging, or consuming a specific offset.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// GramIO uses long polling automatically — just start the bot:
bot.command("start", (ctx) => ctx.send("Hello!"));

bot.start();
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Filter update types to reduce traffic — only receive messages and callbacks:
const updates = await bot.api.getUpdates({
  timeout: 30,
  allowed_updates: ["message", "callback_query"],
  limit: 100,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Acknowledge (confirm) all pending updates by sending a high offset:
// This discards any queued updates before the bot (re)starts.
await bot.api.getUpdates({ offset: -1 });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Manual polling loop with proper offset tracking:
let offset = 0;

while (true) {
  const updates = await bot.api.getUpdates({ offset, timeout: 30, limit: 100 });

  for (const update of updates) {
    console.log("Received update:", update.update_id);
    offset = update.update_id + 1; // Confirm each update
  }
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 409 | `Conflict: can't use getUpdates method while webhook is active` | A webhook is set — call [deleteWebhook](/telegram/methods/deleteWebhook) first, or switch to webhook mode |
| 429 | `Too Many Requests: retry after N` | Polling too fast — use a positive `timeout` value for long polling and check `retry_after` |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Cannot coexist with a webhook.** `getUpdates` returns a 409 error if a webhook is active. Run [deleteWebhook](/telegram/methods/deleteWebhook) before switching to polling, or [setWebhook](/telegram/methods/setWebhook) before switching to webhooks.
- **Set `timeout` > 0 for real long polling.** `timeout: 0` is short polling and hammers Telegram's servers — use 30–60 seconds in production. GramIO's `bot.start()` configures this automatically.
- **Offset confirmation is critical.** An update is only "consumed" once `getUpdates` is called with an `offset` strictly higher than its `update_id`. Failing to advance the offset will re-deliver the same updates indefinitely.
- **`allowed_updates` does not apply retroactively.** Updates created before the parameter change may still arrive briefly. Omitting `allowed_updates` preserves the previous setting — send an explicit list on first boot.
- **Empty `allowed_updates: []` excludes three types by default:** `chat_member`, `message_reaction`, and `message_reaction_count` are excluded when passing an empty array — opt in explicitly if you need them.
- **Negative offset tricks.** Passing `offset: -1` returns the single most recent update without consuming the others, useful for a quick "peek" or startup flush.

## See Also

- [Update](/telegram/types/Update) — full shape of every update object returned
- [setWebhook](/telegram/methods/setWebhook) — alternative update delivery via HTTPS push
- [deleteWebhook](/telegram/methods/deleteWebhook) — required before switching from webhook to polling
- [getWebhookInfo](/telegram/methods/getWebhookInfo) — check current webhook configuration
- [Updates overview](/updates/overview) — GramIO polling vs. webhook guide
