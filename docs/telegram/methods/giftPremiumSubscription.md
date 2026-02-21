---
title: giftPremiumSubscription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Gift Telegram Premium subscriptions to users using GramIO and TypeScript. Complete parameter reference with star costs, month counts, message text formatting, and error handling.
  - - meta
    - name: keywords
      content: giftPremiumSubscription, telegram bot api, gramio giftPremiumSubscription, giftPremiumSubscription typescript, giftPremiumSubscription example, gift telegram premium bot, telegram premium subscription bot, user_id, month_count, star_count, telegram stars premium, how to gift premium telegram bot
---

# giftPremiumSubscription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#giftpremiumsubscription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Gifts a Telegram Premium subscription to the given user. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user who will receive a Telegram Premium subscription" />

<ApiParam name="month_count" type="Integer" required description="Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12" :enumValues='[3,6,12]' />

<ApiParam name="star_count" type="Integer" required description="Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months" />

<ApiParam name="text" type="String" description="Text that will be shown along with the service message about the subscription; 0-128 characters" :minLen="0" :maxLen="128" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="text_parse_mode" type="String" description="Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than &quot;bold&quot;, &quot;italic&quot;, &quot;underline&quot;, &quot;strikethrough&quot;, &quot;spoiler&quot;, and &quot;custom\_emoji&quot; are ignored." />

<ApiParam name="text_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of *text\_parse\_mode*. Entities other than &quot;bold&quot;, &quot;italic&quot;, &quot;underline&quot;, &quot;strikethrough&quot;, &quot;spoiler&quot;, and &quot;custom\_emoji&quot; are ignored." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Gift a 3-month Premium subscription with a personal message:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.giftPremiumSubscription({
  user_id: 123456789,
  month_count: 3,
  star_count: 1000,
  text: "Happy birthday! Enjoy Premium 🎉",
});
```

Gift a 12-month subscription using GramIO's `format` helper for rich text:

```ts twoslash
import { Bot, format, bold, italic } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.giftPremiumSubscription({
  user_id: 123456789,
  month_count: 12,
  star_count: 2500,
  // format produces text_entities — don't pass text_parse_mode alongside it
  text: format`${bold("Congratulations!")} ${italic("Enjoy a full year of Telegram Premium.")}`,
});
```

Gift Premium from a command handler, using the sender's ID:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("gift", async (ctx) => {
  if (!ctx.from) return;

  await bot.api.giftPremiumSubscription({
    user_id: ctx.from.id,
    month_count: 6,
    star_count: 1500,
    text: "Thanks for your support!",
  });

  await ctx.send("Premium subscription gifted!");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | `user_id` doesn't exist or has never started the bot — the user must have interacted with Telegram |
| 400 | `Bad Request: USER_BOT` | Target user is a bot — Premium cannot be gifted to bots |
| 400 | `Bad Request: PREMIUM_GIFT_USER_PRIVATE` | User's privacy settings block receiving Premium gifts from bots |
| 400 | `Bad Request: invalid star_count for month_count` | `star_count` doesn't match the required amount for the chosen `month_count` (1000/1500/2500) |
| 400 | `Bad Request: month_count is invalid` | `month_count` is not one of 3, 6, or 12 |
| 400 | `Bad Request: TEXT_TOO_LONG` | `text` exceeds 128 characters |
| 400 | `Bad Request: not enough stars` | Bot doesn't have sufficient Telegram Stars balance to cover `star_count` |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Star costs are fixed.** `star_count` must exactly match: 1000 for 3 months, 1500 for 6 months, 2500 for 12 months. Any other value causes an error.
- **`month_count` is a union type `3 | 6 | 12`.** GramIO's types enforce this at compile time — passing `1` or `24` will be a TypeScript error.
- **Gift text supports limited formatting.** Only `bold`, `italic`, `underline`, `strikethrough`, `spoiler`, and `custom_emoji` entities are allowed — other entity types are silently ignored.
- **`text_parse_mode` and `text_entities` are mutually exclusive.** Use GramIO's `format` tagged template which produces `text_entities` automatically — never pass `text_parse_mode` alongside it.
- **The bot must have a Stars balance.** Fund the bot's Star balance via [@BotFather](https://t.me/BotFather) before calling this method in production.
- **The recipient must have started the bot** or at least exist in Telegram. Users who have never interacted with Telegram at all may not be found.

## See Also

- [sendGift](/telegram/methods/sendGift) — send a physical gift item (not Premium subscription)
- [getMyStarBalance](/telegram/methods/getMyStarBalance) — check the bot's current Telegram Stars balance before gifting
- [MessageEntity](/telegram/types/MessageEntity) — entity type reference for `text_entities`
- [Formatting guide](/formatting) — how to use GramIO's `format` helper for rich text
