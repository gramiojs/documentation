---
title: setBusinessAccountGiftSettings — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Configure gift privacy settings for a managed Telegram business account using GramIO. TypeScript examples, AcceptedGiftTypes reference, error handling, and tips.
  - - meta
    - name: keywords
      content: setBusinessAccountGiftSettings, telegram bot api, telegram business account gift settings, gramio setBusinessAccountGiftSettings, set business gift settings typescript, business_connection_id, show_gift_button, accepted_gift_types, AcceptedGiftTypes, unlimited_gifts, limited_gifts, unique_gifts, premium_subscription, gifts_from_channels, can_change_gift_settings, how to set telegram business gift settings
---

# setBusinessAccountGiftSettings

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountgiftsettings" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the *can\_change\_gift\_settings* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="show_gift_button" type="Boolean" required description="Pass *True*, if a button for sending a gift to the user or by the business account must always be shown in the input field" />

<ApiParam name="accepted_gift_types" type="AcceptedGiftTypes" required description="Types of gifts accepted by the business account" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Accept all gift types and show the gift button
bot.on("business_connection", async (ctx) => {
  if (ctx.canChangeGiftSettings && ctx.isEnabled) {
    await bot.api.setBusinessAccountGiftSettings({
      business_connection_id: ctx.id,
      show_gift_button: true,
      accepted_gift_types: {
        unlimited_gifts: true,
        limited_gifts: true,
        unique_gifts: true,
        premium_subscription: true,
        gifts_from_channels: true,
      },
    });
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Accept only premium subscriptions and unique gifts, hide the gift button
await bot.api.setBusinessAccountGiftSettings({
  business_connection_id: "your_business_connection_id",
  show_gift_button: false,
  accepted_gift_types: {
    unlimited_gifts: false,
    limited_gifts: false,
    unique_gifts: true,
    premium_subscription: true,
    gifts_from_channels: false,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Disable all incoming gifts
await bot.api.setBusinessAccountGiftSettings({
  business_connection_id: "your_business_connection_id",
  show_gift_button: false,
  accepted_gift_types: {
    unlimited_gifts: false,
    limited_gifts: false,
    unique_gifts: false,
    premium_subscription: false,
    gifts_from_channels: false,
  },
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | The `business_connection_id` is invalid or the connection was revoked — re-fetch from the `business_connection` event |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_change_gift_settings` right — check `ctx.canChangeGiftSettings` before calling |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **All five `accepted_gift_types` fields must be provided.** `AcceptedGiftTypes` is not a partial — you must explicitly set `unlimited_gifts`, `limited_gifts`, `unique_gifts`, `premium_subscription`, and `gifts_from_channels` to `true` or `false`.
- **`show_gift_button` controls UI visibility, not acceptance.** Even if `show_gift_button` is `false`, users may still be able to send gifts if the accepted types allow it. The button just adds a shortcut in the chat input.
- **Check `canChangeGiftSettings` before calling.** The bot must have `can_change_gift_settings` right. Verify with `ctx.canChangeGiftSettings` when handling `business_connection` events.
- **`gifts_from_channels` covers unique gift transfers.** This field controls whether unique gifts transferred from channels are accepted — useful for businesses that want to accept transferred collectibles.
- **`business_connection_id` must be current.** Retrieve from `ctx.id` in `business_connection` handlers, or `ctx.businessConnectionId` in `business_message` handlers.

## See Also

- [getBusinessAccountGifts](/telegram/methods/getBusinessAccountGifts) — retrieve gifts owned by the business account
- [AcceptedGiftTypes](/telegram/types/AcceptedGiftTypes) — the gift types configuration object
- [setBusinessAccountBio](/telegram/methods/setBusinessAccountBio) — change the bio
- [setBusinessAccountName](/telegram/methods/setBusinessAccountName) — change the display name
- [BusinessConnection](/telegram/types/BusinessConnection) — business connection object with rights (`canChangeGiftSettings`, `isEnabled`, etc.)
