---
title: getUpdates — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getUpdates Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getUpdates, telegram bot api, gramio getUpdates, getUpdates typescript, getUpdates example
---

# getUpdates

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Update">Update[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getupdates" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to receive incoming updates using long polling ([wiki](https://en.wikipedia.org/wiki/Push_technology#Long_polling)). Returns an Array of [Update](https://core.telegram.org/bots/api#update) objects.

## Parameters

<ApiParam name="offset" type="Integer" required description="Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as [getUpdates](https://core.telegram.org/bots/api#getupdates) is called with an _offset_ higher than its _update\_id_. The negative offset can be specified to retrieve updates starting from _\-offset_ update from the end of the updates queue. All previous updates will be forgotten." />

<ApiParam name="limit" type="Integer" required description="Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100." />

<ApiParam name="timeout" type="Integer" required description="Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only." />

<ApiParam name="allowed_updates" type="String[]" required description="A JSON-serialized list of the update types you want your bot to receive. For example, specify `[&quot;message&quot;, &quot;edited_channel_post&quot;, &quot;callback_query&quot;]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except _chat\_member_, _message\_reaction_, and _message\_reaction\_count_ (default). If not specified, the previous setting will be used.      Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time." />

## Returns

On success, an array of [Update](/telegram/types/Update) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
