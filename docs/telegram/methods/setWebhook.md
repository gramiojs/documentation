---
title: setWebhook — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Configure a Telegram bot webhook using GramIO. Set HTTPS URL, secret token, allowed updates, and connection limits. Complete parameter reference and TypeScript examples.
  - - meta
    - name: keywords
      content: setWebhook, telegram bot api, telegram webhook, gramio setWebhook, configure telegram webhook, telegram bot webhook setup, setWebhook typescript, setWebhook example, url, secret_token, allowed_updates, max_connections, drop_pending_updates, HTTPS webhook, how to set telegram bot webhook
---

# setWebhook

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setwebhook" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized [Update](https://core.telegram.org/bots/api#update). In case of an unsuccessful request (a request with response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) different from `2XY`), we will repeat the request and give up after a reasonable amount of attempts. Returns *True* on success.

If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter *secret\_token*. If specified, the request will contain a header "X-Telegram-Bot-Api-Secret-Token" with the secret token as content.

## Parameters

<ApiParam name="url" type="String" required description="HTTPS URL to send updates to. Use an empty string to remove webhook integration" />

<ApiParam name="certificate" type="InputFile" description="Upload your public key certificate so that the root certificate in use can be checked. See our [self-signed guide](https://core.telegram.org/bots/self-signed) for details." docsLink="/files/media-upload" />

<ApiParam name="ip_address" type="String" description="The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS" />

<ApiParam name="max_connections" type="Integer" description="The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to *40*. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput." :defaultValue="40" />

<ApiParam name="allowed_updates" type="String[]" description="A JSON-serialized list of the update types you want your bot to receive. For example, specify `[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except *chat\_member*, *message\_reaction*, and *message\_reaction\_count* (default). If not specified, the previous setting will be used.   Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time." semanticType="updateType" />

<ApiParam name="drop_pending_updates" type="Boolean" description="Pass *True* to drop all pending updates" />

<ApiParam name="secret_token" type="String" description="A secret token to be sent in a header &quot;X-Telegram-Bot-Api-Secret-Token&quot; in every webhook request, 1-256 characters. Only characters `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. The header is useful to ensure that the request comes from a webhook set by you." :minLen="1" :maxLen="256" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

GramIO handles webhook setup automatically when you call `bot.start({ webhook: ... })`. Direct `setWebhook` calls are only needed for advanced configurations.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// GramIO recommended way — webhook is configured automatically
bot.start({
  webhook: {
    url: "https://example.com/bot",
    port: 3000,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — useful for manual setup or when bot.start() isn't used
await bot.api.setWebhook({
  url: "https://example.com/bot",
  secret_token: "my-secret-token-abc123",
  allowed_updates: ["message", "callback_query", "inline_query"],
  max_connections: 100,
  drop_pending_updates: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set webhook with a self-signed certificate
import { MediaUpload } from "gramio";

await bot.api.setWebhook({
  url: "https://my-server.com/bot",
  certificate: await MediaUpload.path("./public.pem"),
  drop_pending_updates: false,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove webhook (fall back to getUpdates / long polling)
await bot.api.setWebhook({ url: "" });
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: bad webhook: HTTPS URL must be provided for webhook` | The `url` is not HTTPS — Telegram requires a valid HTTPS URL (not HTTP) |
| 400 | `Bad Request: bad webhook: Failed to resolve host` | DNS lookup failed for the webhook host — verify the domain exists and resolves |
| 400 | `Bad Request: bad webhook: Wrong response from the webhook: N UNKNOWN` | Telegram received a non-2xx response from your server during the test probe at registration — ensure your endpoint is live and returns 200 |
| 400 | `Bad Request: bad webhook: IP address N is not allowed` | The resolved IP is in a reserved/private range — Telegram doesn't allow webhooks to internal IPs |
| 400 | `Bad Request: bad webhook: SSL certificate verification failed` | Certificate is self-signed without being uploaded, expired, or uses an untrusted CA — upload it via `certificate` or use a CA-signed cert |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **HTTPS is mandatory.** Telegram only sends webhook requests to HTTPS endpoints. Port 443, 80, 88, or 8443 are supported — other ports are blocked.
- **`allowed_updates` omission keeps the previous setting.** If you omit `allowed_updates`, Telegram continues using whatever was set before. Pass an explicit list to ensure your bot receives exactly what it needs, nothing more. Unneeded update types add overhead.
- **`drop_pending_updates: true` is useful on redeploy.** When restarting a bot that was down, there may be a backlog of updates. Set this to `true` to start fresh and avoid processing stale messages.
- **`secret_token` prevents spoofed requests.** Always set a `secret_token` in production and verify the `X-Telegram-Bot-Api-Secret-Token` header in your webhook handler — without it, anyone who knows your URL can send fake updates.
- **You cannot use long polling (getUpdates) while a webhook is active.** Call [deleteWebhook](/telegram/methods/deleteWebhook) first, or pass `url: ""` to switch back to polling mode.
- **`max_connections` affects concurrency, not throughput.** Higher values allow Telegram to send more parallel requests, but your server must be able to handle them. Start with the default 40 and increase if you're a high-traffic bot.

## See Also

- [deleteWebhook](/telegram/methods/deleteWebhook) — remove the webhook and switch to getUpdates polling
- [getWebhookInfo](/telegram/methods/getWebhookInfo) — check current webhook configuration and error info
- [WebhookInfo](/telegram/types/WebhookInfo) — the webhook info object returned by getWebhookInfo
- [Media Upload guide](/files/media-upload) — how to upload a self-signed certificate
