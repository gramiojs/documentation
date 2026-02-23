---
title: stopPoll — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Stop an active Telegram poll using GramIO. Close voting and retrieve final results. Supports inline keyboard update on close. TypeScript examples and parameter reference.
  - - meta
    - name: keywords
      content: stopPoll, telegram bot api, telegram stop poll, gramio stopPoll, close telegram poll, end poll telegram bot, stopPoll typescript, stopPoll example, chat_id, message_id, reply_markup, Poll, how to stop poll telegram bot, telegram bot close poll
---

# stopPoll

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Poll">Poll</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#stoppoll" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stop a poll which was sent by the bot. On success, the stopped [Poll](https://core.telegram.org/bots/api#poll) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the original message with the poll" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for a new message [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." docsLink="/keyboards/overview" />

## Returns

On success, the [Poll](/telegram/types/Poll) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop a poll and read the final results
const closedPoll = await bot.api.stopPoll({
  chat_id: 123456789,
  message_id: 55,
});

console.log(`Poll closed. Total voters: ${closedPoll.total_voter_count}`);
for (const option of closedPoll.options) {
  console.log(`  "${option.text}": ${option.voter_count} votes`);
}
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop a poll and replace its inline keyboard in one call
const poll = await bot.api.stopPoll({
  chat_id: 123456789,
  message_id: 55,
  reply_markup: new InlineKeyboard().text("See results", "poll_results_55"),
});

console.log(`Winner: ${poll.options.sort((a, b) => b.voter_count - a.voter_count)[0]?.text}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stop a poll in a command handler
bot.command("endpoll", async (ctx) => {
  // Assumes the poll message ID is stored somewhere
  const pollMessageId = 55;
  const poll = await bot.api.stopPoll({
    chat_id: ctx.chat.id,
    message_id: pollMessageId,
  });
  await ctx.send(`Poll closed with ${poll.total_voter_count} total votes.`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | The `message_id` doesn't exist in the chat |
| 400 | `Bad Request: poll has already been closed` | The poll was already stopped — you can't stop it twice; catch this error if you may call stopPoll redundantly |
| 400 | `Bad Request: message is not a poll` | The referenced message is not a poll — verify the correct `message_id` |
| 403 | `Forbidden: not enough rights` | Bot lacks the rights to edit messages in this chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only the bot that sent the poll can stop it.** You cannot stop polls sent by other bots or users. Ensure the `message_id` corresponds to a poll created by your bot.
- **The returned `Poll` object has the final results.** `stopPoll` returns the complete `Poll` with all vote counts — use this as the authoritative final result without needing a separate `getUpdates` call.
- **Stopping a quiz reveals the correct answer.** For quiz-type polls, once closed the correct option becomes visible to all participants. Plan when to close quizzes carefully.
- **You can update `reply_markup` on close.** Passing a new keyboard atomically replaces the poll's inline buttons at the same time as closing — useful for adding a "See results" or "Play again" button.
- **Closed polls still receive `poll` updates.** Telegram may deliver a `poll` update when a poll closes naturally (by `close_date`). You don't need to manually call `stopPoll` to receive the final state in that case.

## See Also

- [sendPoll](/telegram/methods/sendPoll) — send a new poll
- [Poll](/telegram/types/Poll) — the Poll object with options and vote counts
- [InlineKeyboardMarkup](/telegram/types/InlineKeyboardMarkup) — keyboard structure for `reply_markup`
- [Keyboards guide](/keyboards/overview) — building inline keyboards with GramIO
