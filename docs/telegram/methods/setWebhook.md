---
title: setWebhook — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setWebhook Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setWebhook, telegram bot api, gramio setWebhook, setWebhook typescript, setWebhook example
---

# setWebhook

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setwebhook" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized [Update](https://core.telegram.org/bots/api#update). In case of an unsuccessful request (a request with response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) different from `2XY`), we will repeat the request and give up after a reasonable amount of attempts. Returns _True_ on success.

If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter _secret\_token_. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.

## Parameters

<ApiParam name="url" type="String" required description="HTTPS URL to send updates to. Use an empty string to remove webhook integration" />

<ApiParam name="certificate" type="InputFile" required description="Upload your public key certificate so that the root certificate in use can be checked. See our [self-signed guide](https://core.telegram.org/bots/self-signed) for details." />

<ApiParam name="ip_address" type="String" required description="The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS" />

<ApiParam name="max_connections" type="Integer" required description="The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to _40_. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput." :max="1" />

<ApiParam name="allowed_updates" type="String[]" required description="A JSON-serialized list of the update types you want your bot to receive. For example, specify `[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except _chat\_member_, _message\_reaction_, and _message\_reaction\_count_ (default). If not specified, the previous setting will be used.   Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time." />

<ApiParam name="drop_pending_updates" type="Boolean" required description="Pass _True_ to drop all pending updates" />

<ApiParam name="secret_token" type="String" required description="A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. The header is useful to ensure that the request comes from a webhook set by you." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
