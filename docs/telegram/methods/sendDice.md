---
title: sendDice — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send animated emoji dice, dartboard, basketball, football, bowling, or slot machine with GramIO in TypeScript. sendDice reference with value ranges and TypeScript examples.
  - - meta
    - name: keywords
      content: sendDice, telegram bot api, gramio sendDice, sendDice typescript, sendDice example, telegram dice bot, animated emoji telegram, slot machine bot, dice value range, basketball telegram, dartboard emoji, bowling telegram
---

# sendDice

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#senddice" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send an animated emoji that will display a random value. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target bot, supergroup or channel in the format `@username`" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="emoji" type="String" description="Emoji on which the dice throw animation is based. Currently, must be one of &quot;![🎲](https://telegram.org/img/emoji/40/F09F8EB2.png)&quot;, &quot;![🎯](https://telegram.org/img/emoji/40/F09F8EAF.png)&quot;, &quot;![🏀](https://telegram.org/img/emoji/40/F09F8F80.png)&quot;, &quot;![⚽](https://telegram.org/img/emoji/40/E29ABD.png)&quot;, &quot;![🎳](https://telegram.org/img/emoji/40/F09F8EB3.png)&quot;, or &quot;![🎰](https://telegram.org/img/emoji/40/F09F8EB0.png)&quot;. Dice can have values 1-6 for &quot;![🎲](https://telegram.org/img/emoji/40/F09F8EB2.png)&quot;, &quot;![🎯](https://telegram.org/img/emoji/40/F09F8EAF.png)&quot; and &quot;![🎳](https://telegram.org/img/emoji/40/F09F8EB3.png)&quot;, values 1-5 for &quot;![🏀](https://telegram.org/img/emoji/40/F09F8F80.png)&quot; and &quot;![⚽](https://telegram.org/img/emoji/40/E29ABD.png)&quot;, and values 1-64 for &quot;![🎰](https://telegram.org/img/emoji/40/F09F8EB0.png)&quot;. Defaults to &quot;![🎲](https://telegram.org/img/emoji/40/F09F8EB2.png)&quot;." defaultValue="🎲" :enumValues='["🎲","🎯","🏀","⚽","🎳","🎰"]' />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance." />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user." docsLink="/keyboards/overview" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

Send a default dice (🎲) and read its rolled value:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  const msg = await ctx.sendDice("🎲");
  const rolled = msg.dice?.value ?? 0;
  await ctx.send(`You rolled a ${rolled}!`);
});
```

Reply to the user's message with a dice throw:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  const msg = await ctx.replyWithDice("🎲");
  const rolled = msg.dice?.value ?? 0;
  await ctx.send(`You rolled: ${rolled}`);
});
```

Send a slot machine (🎰) and check for a jackpot (value 64):

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  const msg = await ctx.sendDice("🎰");
  const result = msg.dice?.value ?? 0;

  if (result === 64) {
    await ctx.send("Jackpot! You hit the maximum!");
  } else {
    await ctx.send(`Slot result: ${result} — better luck next time!`);
  }
});
```

Build a simple basketball mini-game (🏀, values 1–5):

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.command("shoot", async (ctx) => {
  const msg = await ctx.sendDice("🏀");
  const score = msg.dice?.value ?? 0;

  const verdict =
    score >= 4 ? "Slam dunk!" : score >= 2 ? "Nice shot!" : "Missed!";
  await ctx.send(verdict);
});
```

Direct API call with `bot.api.sendDice` (useful outside message handlers):

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const msg = await bot.api.sendDice({
  chat_id: 123456789,
  emoji: "🎯",
});
const value = msg.dice?.value ?? 0;
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the bot has never interacted with the user, or the chat does not exist. |
| 400 | `Bad Request: wrong dice emoji` | The `emoji` value is not one of the six supported emojis (🎲 🎯 🏀 ⚽ 🎳 🎰). |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot. Remove them from your active user list. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Back off for the specified number of seconds. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The value is truly random.** Telegram generates the random value server-side — you cannot control or predict the outcome. Read `message.dice.value` from the returned `Message` object.
- **Value ranges differ by emoji.** 🎲 🎯 🎳 → 1–6 · 🏀 ⚽ → 1–5 · 🎰 → 1–64. Design game logic around the correct range for your chosen emoji.
- **Omitting `emoji` defaults to 🎲.** If you want a specific animated emoji, always pass the `emoji` parameter explicitly.
- **The animation plays client-side.** The rolled value is embedded in the message immediately, but the visual animation takes a few seconds to complete. Do not read the value before the `Message` is returned — the value is already final when `sendDice` resolves.
- **Not suitable for real gambling.** The dice is entertainment-only. Telegram reserves the right to change value ranges or behavior in future API versions.
- **`protect_content` prevents forwarding.** Use this in fair-play scenarios where users should not forward a lucky roll to another chat.

## See Also

- [Dice type](/telegram/types/Dice) — structure of the dice object in the returned message
- [Message type](/telegram/types/Message) — full structure of the returned message
- [Keyboards overview](/keyboards/overview) — attaching inline keyboards for follow-up actions
- [sendMessage](/telegram/methods/sendMessage) — send a text response after reading the dice value
- [auto-retry plugin](/plugins/official/auto-retry) — handle rate limits automatically
