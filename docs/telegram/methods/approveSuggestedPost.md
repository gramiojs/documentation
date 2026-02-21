---
title: approveSuggestedPost — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Approve a suggested post in a Telegram direct messages chat using GramIO and TypeScript. Schedule publication with send_date. Full parameter reference and examples.
  - - meta
    - name: keywords
      content: approveSuggestedPost, telegram bot api, gramio approveSuggestedPost, approveSuggestedPost typescript, approveSuggestedPost example, suggested post telegram, approve post channel, send_date unix timestamp, can_post_messages, SuggestedPostInfo
---

# approveSuggestedPost

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#approvesuggestedpost" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can\_post\_messages' administrator right in the corresponding channel chat. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target direct messages chat" />

<ApiParam name="message_id" type="Integer" required description="Identifier of a suggested post message to approve" />

<ApiParam name="send_date" type="Integer" description="Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

// Approve a suggested post for immediate publication (send_date already set)
bot.on("message", async (ctx) => {
  const messageId = ctx.message.reply_to_message?.message_id;
  if (!messageId) return;

  await bot.api.approveSuggestedPost({
    chat_id: ctx.chat.id,
    message_id: messageId,
    send_date: 0, // 0 or omit if date was already specified when the post was suggested
  });

  await ctx.send("Post approved for publication!");
});

// Approve a suggested post and schedule it 1 hour from now
bot.on("message", async (ctx) => {
  const messageId = ctx.message.reply_to_message?.message_id;
  if (!messageId) return;

  const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600;

  await bot.api.approveSuggestedPost({
    chat_id: ctx.chat.id,
    message_id: messageId,
    send_date: oneHourFromNow,
  });

  await ctx.send(`Post scheduled for publication in 1 hour.`);
});

// Approve with a specific far-future date (up to 30 days)
async function approvePostForDate(
  bot: Bot,
  chatId: number,
  messageId: number,
  publishAt: Date
): Promise<void> {
  const sendDate = Math.floor(publishAt.getTime() / 1000);
  const maxDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600; // 30 days

  if (sendDate > maxDate) {
    throw new Error("send_date cannot be more than 30 days in the future");
  }

  await bot.api.approveSuggestedPost({
    chat_id: chatId,
    message_id: messageId,
    send_date: sendDate,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: message not found` | `message_id` does not refer to an existing suggested post in this chat — verify the message ID |
| 400 | `Bad Request: DATE_TOO_FAR` | `send_date` is more than 2678400 seconds (30 days) from now — use a closer date |
| 400 | `Bad Request: DATE_IN_PAST` | `send_date` is a timestamp in the past — use a current or future Unix timestamp |
| 400 | `Bad Request: SEND_DATE_INVALID` | The provided `send_date` conflicts with a date already set when the suggestion was created — omit `send_date` if the creator already specified it |
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to this direct messages chat |
| 403 | `Forbidden: bot is not an administrator` | The bot lacks admin status in the corresponding channel chat |
| 403 | `Forbidden: not enough rights to post messages` | The bot admin account is missing the `can_post_messages` right in the channel — grant it in admin settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **This works in direct messages (DM) chats, not channels directly.** The `chat_id` refers to the direct messages chat associated with the channel, not the channel itself. The bot must have `can_post_messages` in the linked channel.
- **`send_date` rules depend on how the post was created.** If the original suggestion already included a `send_date`, you must omit the parameter here (or the API returns an error). If no date was set during suggestion, you must supply one — or pass `0` to publish immediately.
- **Max scheduling horizon is 30 days.** `send_date` cannot exceed 2678400 seconds from the current time. For scheduling automation, calculate the timestamp server-side with `Math.floor(Date.now() / 1000) + secondsUntilPublish`.
- **Pair with `declineSuggestedPost` for a moderation workflow.** Build a bot that listens for suggested post updates and presents approve/decline buttons to channel admins.
- **A `SuggestedPostApproved` service message is generated.** After approval, Telegram sends a service message in the chat notifying that the post was approved and indicating the scheduled time.

## See Also

- [`declineSuggestedPost`](/telegram/methods/declineSuggestedPost) — Decline a suggested post instead of approving it
- [`SuggestedPostInfo`](/telegram/types/SuggestedPostInfo) — Metadata for a suggested post including price and status
- [`SuggestedPostParameters`](/telegram/types/SuggestedPostParameters) — Parameters used when creating a suggested post
