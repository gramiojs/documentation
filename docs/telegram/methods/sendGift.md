---
title: sendGift — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send Telegram gifts to users or channels using GramIO with TypeScript. Complete sendGift reference with gift_id, pay_for_upgrade, text formatting, and getAvailableGifts integration.
  - - meta
    - name: keywords
      content: sendGift, telegram bot api, send gift telegram bot, gramio sendGift, sendGift typescript, sendGift example, telegram gift, gift_id, pay_for_upgrade, telegram stars gift, getAvailableGifts, how to send gift telegram bot
---

# sendGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendgift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" description="Required if *chat\_id* is not specified. Unique identifier of the target user who will receive the gift." />

<ApiParam name="chat_id" type="Integer | String" description="Required if *user\_id* is not specified. Unique identifier for the chat or username of the channel (in the format `@channelusername`) that will receive the gift." />

<ApiParam name="gift_id" type="String" required description="Identifier of the gift; limited gifts can't be sent to channel chats" />

<ApiParam name="pay_for_upgrade" type="Boolean" description="Pass *True* to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver" />

<ApiParam name="text" type="String" description="Text that will be shown along with the gift; 0-128 characters" :minLen="0" :maxLen="128" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="text_parse_mode" type="String" description="Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than &quot;bold&quot;, &quot;italic&quot;, &quot;underline&quot;, &quot;strikethrough&quot;, &quot;spoiler&quot;, and &quot;custom\_emoji&quot; are ignored." />

<ApiParam name="text_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of *text\_parse\_mode*. Entities other than &quot;bold&quot;, &quot;italic&quot;, &quot;underline&quot;, &quot;strikethrough&quot;, &quot;spoiler&quot;, and &quot;custom\_emoji&quot; are ignored." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a gift to a user by user_id
// First fetch available gifts via getAvailableGifts to get a valid gift_id
await bot.api.sendGift({
    user_id: 123456789,
    gift_id: "gift_abc123",
    text: "Happy birthday! 🎉",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a gift to a channel
await bot.api.sendGift({
    chat_id: "@mychannel",
    gift_id: "gift_abc123",
    text: "Thanks for following!",
});
```

```ts twoslash
import { Bot, format, bold, italic } from "gramio";

const bot = new Bot("");
// ---cut---
// Send a gift with formatted text using text_entities
// Only bold, italic, underline, strikethrough, spoiler, custom_emoji are supported
await bot.api.sendGift({
    user_id: 123456789,
    gift_id: "gift_abc123",
    text: format`${bold("Congratulations!")} You earned this gift ${italic("for your contribution")}`,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Pay for the gift upgrade from the bot's Star balance
await bot.api.sendGift({
    user_id: 123456789,
    gift_id: "gift_premium_xyz",
    pay_for_upgrade: true,
    text: "Enjoy the premium upgrade — on us!",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Retrieve available gifts first, then send the cheapest one
const gifts = await bot.api.getAvailableGifts();
const gift = gifts.gifts[0];

if (gift) {
    await bot.api.sendGift({
        user_id: 123456789,
        gift_id: gift.id,
    });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | `user_id` is invalid or the user has never started your bot |
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member |
| 400 | `Bad Request: GIFT_INVALID` | `gift_id` does not exist or has sold out — use `getAvailableGifts` to fetch current valid IDs |
| 400 | `Bad Request: limited gifts can't be sent to channel chats` | The `gift_id` is a limited-edition gift; these can only go to users, not channels |
| 400 | `Bad Request: not enough stars` | Bot doesn't have sufficient Telegram Stars balance to send this gift |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and skip |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Always fetch fresh `gift_id` values via `getAvailableGifts`.** Gift IDs are not static — limited gifts can sell out. Hardcoding an ID that has expired will cause `GIFT_INVALID`.
- **Either `user_id` or `chat_id` is required, not both.** Providing neither (or both) will result in a `400` error. `user_id` targets individual users; `chat_id` targets channels.
- **Limited gifts cannot be sent to channels.** Only regular (non-limited) gifts are allowed for `chat_id` targets.
- **`text` supports only a subset of formatting entities.** Even with `format` helper or `text_parse_mode`, only `bold`, `italic`, `underline`, `strikethrough`, `spoiler`, and `custom_emoji` are rendered. All others are silently stripped.
- **`pay_for_upgrade` deducts Stars from the bot's balance.** This makes the upgrade free for the receiver. Ensure the bot has enough Stars before setting this to `true`.
- **Receivers cannot convert these gifts to Stars.** Unlike user-sent gifts, gifts from bots cannot be converted by the recipient.

## See Also

- [getAvailableGifts](/telegram/methods/getAvailableGifts) — list all sendable gift IDs with star costs
- [Gift](/telegram/types/Gift) — the Gift type object
- [Gifts](/telegram/types/Gifts) — the Gifts collection type
- [Formatting](/formatting) — how to use `format` for `text_entities`
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` handling
