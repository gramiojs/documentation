---
title: WebhookInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: WebhookInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: WebhookInfo, telegram bot api types, gramio WebhookInfo, WebhookInfo object, WebhookInfo typescript
---

# WebhookInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#webhookinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes the current status of a webhook.

## Fields

<ApiParam name="url" type="String" required description="Webhook URL, may be empty if webhook is not set up" />

<ApiParam name="has_custom_certificate" type="Boolean" required description="_True_, if a custom certificate was provided for webhook certificate checks" />

<ApiParam name="pending_update_count" type="Integer" required description="Number of updates awaiting delivery" />

<ApiParam name="ip_address" type="String" description="_Optional_. Currently used webhook IP address" />

<ApiParam name="last_error_date" type="Integer" description="_Optional_. Unix time for the most recent error that happened when trying to deliver an update via webhook" />

<ApiParam name="last_error_message" type="String" description="_Optional_. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook" />

<ApiParam name="last_synchronization_error_date" type="Integer" description="_Optional_. Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters" />

<ApiParam name="max_connections" type="Integer" description="_Optional_. The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery" />

<ApiParam name="allowed_updates" type="String[]" description="_Optional_. A list of update types the bot is subscribed to. Defaults to all update types except _chat\_member_" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
