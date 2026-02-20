---
title: createChatSubscriptionInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Create Telegram Stars subscription invite links for channels using GramIO. Complete createChatSubscriptionInviteLink TypeScript reference with pricing, period, and recurring subscription examples.
  - - meta
    - name: keywords
      content: createChatSubscriptionInviteLink, telegram bot api, telegram subscription invite link, telegram stars channel subscription, gramio createChatSubscriptionInviteLink, createChatSubscriptionInviteLink typescript, subscription_period, subscription_price, telegram stars subscription, how to create subscription link telegram bot, channel paid subscription, ChatInviteLink
---

# createChatSubscriptionInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createchatsubscriptioninvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a [subscription invite link](https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions) for a channel chat. The bot must have the *can\_invite\_users* administrator rights. The link can be edited using the method [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink) or revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="name" type="String" description="Invite link name; 0-32 characters" :minLen="0" :maxLen="32" />

<ApiParam name="subscription_period" type="Integer" required description="The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days)." />

<ApiParam name="subscription_price" type="Integer" required description="The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000" />

## Returns

On success, the [ChatInviteLink](/telegram/types/ChatInviteLink) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a 30-day subscription invite link for 100 Stars/month
const link = await bot.api.createChatSubscriptionInviteLink({
  chat_id: "@mypaidchannel",
  subscription_period: 2592000,
  subscription_price: 100,
});
console.log(link.invite_link);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Create a named subscription link for easier tracking
const link = await bot.api.createChatSubscriptionInviteLink({
  chat_id: -1001234567890,
  name: "VIP Access",
  subscription_period: 2592000,
  subscription_price: 500,
});
console.log(`VIP link: ${link.invite_link}`);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is in the channel |
| 400 | `Bad Request: SUBSCRIPTION_PERIOD_INVALID` | `subscription_period` is not exactly `2592000` — the only supported value |
| 400 | `Bad Request: STARS_SUBSCRIPTION_PRICE_INVALID` | `subscription_price` is outside the 1–10000 Stars range |
| 400 | `Bad Request: method not available for this chat type` | Target chat is not a channel — subscription invite links only work on channels, not groups |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_invite_users` administrator right |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only works for channels, not groups.** Subscription invite links are channel-only; use [`createChatInviteLink`](/telegram/methods/createChatInviteLink) for groups.
- **`subscription_period` must always be exactly `2592000` (30 days).** This is the only currently supported value; any other number will fail.
- **`subscription_price` is in Telegram Stars, not a fiat currency.** The range is 1–10000 Stars; Stars are integers with no fractional values.
- **Revoking stops new subscriptions but does not cancel active ones.** Existing subscribers keep access until their period ends after you revoke the link.
- **Multiple subscription links can coexist.** A channel can have several active subscription links at different price points simultaneously.
- **The `name` field helps distinguish links in admin analytics.** Use descriptive names like "Tier 1 — 100 Stars" to track conversion per link.

## See Also

- [`editChatSubscriptionInviteLink`](/telegram/methods/editChatSubscriptionInviteLink) — Edit an existing subscription invite link's name or price
- [`revokeChatInviteLink`](/telegram/methods/revokeChatInviteLink) — Revoke a subscription invite link
- [`createChatInviteLink`](/telegram/methods/createChatInviteLink) — Create a regular (non-subscription) invite link
- [`ChatInviteLink`](/telegram/types/ChatInviteLink) — Return type containing the generated link and subscription metadata
