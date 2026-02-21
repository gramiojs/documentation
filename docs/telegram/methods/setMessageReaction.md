---
title: setMessageReaction — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Add or remove reactions on a Telegram message using GramIO. TypeScript examples with emoji reactions, custom emoji, is_big animation, and clearing all reactions.
  - - meta
    - name: keywords
      content: setMessageReaction, telegram bot api, telegram bot add reaction, gramio setMessageReaction, setMessageReaction typescript, setMessageReaction example, telegram message reaction emoji, ReactionType, react to message telegram bot, is_big animation, custom emoji reaction, clear reactions, how to react to message telegram bot
---


# setMessageReaction

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmessagereaction" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead." />

<ApiParam name="reaction" type="ReactionType[]" description="A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots." />

<ApiParam name="is_big" type="Boolean" description="Pass *True* to set the reaction with a big animation" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// React to the incoming message with a single emoji
bot.on("message", (ctx) => ctx.react("👍"));
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set multiple reactions (requires bot to have elevated rights or pre-existing reactions)
bot.on("message", (ctx) =>
  ctx.setReactions(["🔥", "❤️"])
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// React with big animation for emphasis
bot.on("message", (ctx) =>
  ctx.setReaction("🎉", { is_big: true })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove all reactions from the message
bot.on("message", (ctx) => ctx.clearReactions());
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — react to a specific message
await bot.api.setMessageReaction({
  chat_id: -1001234567890,
  message_id: 42,
  reaction: [{ type: "emoji", emoji: "👍" }],
  is_big: false,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` does not exist or was deleted |
| 400 | `Bad Request: can't react to this message type` | Service messages (pin, join, etc.) of certain types don't allow reactions |
| 400 | `Bad Request: REACTION_INVALID` | Emoji string is not a valid Telegram reaction emoji — use only supported emoji strings |
| 400 | `Bad Request: CUSTOM_EMOJI_NOT_ALLOWED` | Custom emoji reaction not permitted — admin must explicitly allow it, or it must already be on the message |
| 400 | `Bad Request: TOO_MANY_REACTIONS` | Bots are limited to 1 reaction per message (non-premium) — pass a single-item array |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **GramIO provides four context shorthands.** Use `ctx.react(emoji)` for a single reaction, `ctx.setReactions([...])` for multiple, `ctx.setReaction(emoji)` for an explicit single-item call, and `ctx.clearReactions()` to remove all reactions.
- **Bots are limited to 1 reaction per message.** Passing more than one item in the `reaction` array will return a `TOO_MANY_REACTIONS` error unless the bot has premium capabilities. Use `ctx.react()` to stay within limits.
- **To remove all reactions, pass an empty array (or call `ctx.clearReactions()`).** Passing `reaction: []` explicitly clears the bot's reactions from the message.
- **Custom emoji reactions require explicit admin permission.** A custom emoji can only be set if it is already present on the message or a chat administrator has allowed it via chat settings.
- **Paid reactions (`ReactionTypePaid`) cannot be used by bots.** Only regular emoji and permitted custom emoji reactions are supported.
- **Service messages cannot be reacted to.** Join/leave notices, pin notifications, and some other service messages are excluded.
- **Media group reactions apply to the first non-deleted message.** If `message_id` points to a media group, the reaction is set on the first remaining message in the group.

## See Also

- [`ReactionType`](/telegram/types/ReactionType) — union type for emoji, custom emoji, and paid reactions
- [`ReactionTypeEmoji`](/telegram/types/ReactionTypeEmoji) — standard emoji reaction object
- [`ReactionTypeCustomEmoji`](/telegram/types/ReactionTypeCustomEmoji) — custom emoji reaction object
- [`Message`](/telegram/types/Message) — message object (contains `reactions` field)
