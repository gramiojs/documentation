---
title: declineSuggestedPost — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Decline a suggested post in a Telegram channel DM chat using GramIO. TypeScript examples for channel moderation workflows requiring can_manage_direct_messages rights.
  - - meta
    - name: keywords
      content: declineSuggestedPost, telegram bot api, decline suggested post telegram, gramio declineSuggestedPost, telegram channel moderation bot, can_manage_direct_messages, suggested post management typescript, telegram bot channel admin, how to decline post telegram bot
---

# declineSuggestedPost

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#declinesuggestedpost" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can\_manage\_direct\_messages' administrator right in the corresponding channel chat. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target direct messages chat" />

<ApiParam name="message_id" type="Integer" required description="Identifier of a suggested post message to decline" />

<ApiParam name="comment" type="String" required description="Comment for the creator of the suggested post; 0-128 characters" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Decline a suggested post without a comment
await bot.api.declineSuggestedPost({
  chat_id: -1001234567890,
  message_id: 42,
  comment: "",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Decline with a reason for the post author
await bot.api.declineSuggestedPost({
  chat_id: -1001234567890,
  message_id: 42,
  comment: "This content doesn't match our channel guidelines.",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Moderate suggested posts via callback query from an admin panel
bot.on("callback_query", async (ctx) => {
  const data = ctx.queryPayload;
  if (typeof data === "string" && data.startsWith("decline:")) {
    const messageId = Number(data.split(":")[1]);
    await bot.api.declineSuggestedPost({
      chat_id: -1001234567890,
      message_id: messageId,
      comment: "Declined by moderator.",
    });
    await ctx.answerCallbackQuery({ text: "Post declined." });
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to this DM chat |
| 400 | `Bad Request: message not found` | The suggested post message doesn't exist or was already handled |
| 400 | `Bad Request: comment is too long` | `comment` exceeds 128 characters — shorten the message |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_manage_direct_messages` right in the corresponding channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **The `chat_id` is the DM chat, not the channel.** The bot must have `can_manage_direct_messages` in the **channel**, which grants it access to the associated direct messages chat. The `chat_id` you pass is the DM chat identifier, not the channel ID.
- **`comment` is required but can be empty.** Pass `""` to decline without leaving feedback for the post author. When declining with a reason, stay within the 128-character limit.
- **Pair with `approveSuggestedPost` for a moderation flow.** Both methods work symmetrically — use one or the other depending on the admin decision.
- **The suggested post message stays visible until handled.** Calling `declineSuggestedPost` resolves the pending post request; the original message is not automatically deleted.

## See Also

- [approveSuggestedPost](/telegram/methods/approveSuggestedPost) — approve the same suggested post instead
- [deleteMessage](/telegram/methods/deleteMessage) — delete a message entirely
