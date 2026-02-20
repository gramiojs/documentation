---
title: sendPoll — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send native polls and quizzes with GramIO in TypeScript. Complete sendPoll reference covering quiz mode, correct answers, open period, explanation, and error handling.
  - - meta
    - name: keywords
      content: sendPoll, telegram bot api, gramio sendPoll, sendPoll typescript, sendPoll example, telegram poll bot, telegram quiz bot, poll question, poll options, InputPollOption, quiz mode, correct_option_id, explanation, open_period, close_date, is_anonymous, allows_multiple_answers, stopPoll, regular poll, quiz poll, send poll telegram, gramio poll
---

# sendPoll

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendpoll" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send a native poll. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can't be sent to channel direct messages chats." />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="question" type="String" required description="Poll question, 1-300 characters" :minLen="1" :maxLen="300" />

<ApiParam name="question_parse_mode" type="String" description="Mode for parsing entities in the question. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Currently, only custom emoji entities are allowed" />

<ApiParam name="question_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of *question\_parse\_mode*" />

<ApiParam name="options" type="InputPollOption[]" required description="A JSON-serialized list of 2-12 answer options" />

<ApiParam name="is_anonymous" type="Boolean" description="*True*, if the poll needs to be anonymous, defaults to *True*" />

<ApiParam name="type" type="String" description="Poll type, &quot;quiz&quot; or &quot;regular&quot;, defaults to &quot;regular&quot;" :enumValues='["quiz","regular"]' />

<ApiParam name="allows_multiple_answers" type="Boolean" description="*True*, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to *False*" />

<ApiParam name="correct_option_id" type="Integer" description="0-based identifier of the correct answer option, required for polls in quiz mode" />

<ApiParam name="explanation" type="String" description="Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing" :minLen="0" :maxLen="200" />

<ApiParam name="explanation_parse_mode" type="String" description="Mode for parsing entities in the explanation. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="explanation_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of *explanation\_parse\_mode*" />

<ApiParam name="open_period" type="Integer" description="Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with *close\_date*." />

<ApiParam name="close_date" type="Integer" description="Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with *open\_period*." />

<ApiParam name="is_closed" type="Boolean" description="Pass *True* if the poll needs to be immediately closed. This can be useful for poll preview." />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Simple anonymous regular poll with 30-second timer
bot.command("poll", (ctx) =>
  ctx.sendPoll({
    question: "What is your favorite runtime?",
    options: [
      { text: "Bun" },
      { text: "Node.js" },
      { text: "Deno" },
    ],
    is_anonymous: false,
    open_period: 30,
  })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Quiz mode with correct answer and explanation
bot.command("quiz", (ctx) =>
  ctx.sendPoll({
    question: "Which HTTP status code means 'Too Many Requests'?",
    options: [
      { text: "400" },
      { text: "404" },
      { text: "429" },
      { text: "500" },
    ],
    type: "quiz",
    correct_option_id: 2,
    explanation: "429 is the standard rate-limit code defined in RFC 6585.",
    is_anonymous: true,
  })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Multiple-choice poll that closes at a specific Unix timestamp
bot.command("multivote", (ctx) =>
  ctx.sendPoll({
    question: "Which features do you use? (pick all that apply)",
    options: [
      { text: "Inline keyboards" },
      { text: "Scenes" },
      { text: "Sessions" },
      { text: "i18n" },
    ],
    allows_multiple_answers: true,
    close_date: Math.floor(Date.now() / 1000) + 300, // closes in 5 min
  })
);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reply to a message with a poll and immediately stop it (useful for previews)
bot.command("preview", async (ctx) => {
  const msg = await ctx.replyWithPoll({
    question: "Draft poll — closed for preview",
    options: [{ text: "Option A" }, { text: "Option B" }],
    is_closed: true,
  });
  // msg.messageId is available on the returned MessageContext
  return msg;
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat exists and the bot is a member |
| 400 | `Bad Request: POLL_OPTION_INVALID` | Fewer than 2 or more than 12 options provided, or an option text is empty |
| 400 | `Bad Request: POLL_ANSWERS_TOO_MUCH` | More than 12 options in the `options` array |
| 400 | `Bad Request: POLL_QUESTION_INVALID` | `question` is empty or exceeds 300 characters |
| 400 | `Bad Request: poll can't be sent to channel direct messages chats` | Polls are not supported in channel direct message threads |
| 400 | `Bad Request: POLL_OPTION_CORRECT_ID_INVALID` | `correct_option_id` is out of range or used without `type: "quiz"` |
| 400 | `Bad Request: can't use both open_period and close_date` | `open_period` and `close_date` are mutually exclusive |
| 403 | `Forbidden: bot was blocked by the user` | The target user has blocked the bot |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_send_polls` permission in the group/channel |
| 429 | `Too Many Requests: retry after N` | Flood control triggered — use the auto-retry plugin to handle this automatically |

::: tip Auto-retry for 429 errors
Install the [@gramio/auto-retry](/plugins/official/auto-retry) plugin to transparently handle flood-wait errors without manual retry logic.
:::

## Tips & Gotchas

- **2–12 options are required.** Sending fewer than 2 or more than 12 `InputPollOption` objects throws a `POLL_OPTION_INVALID` error. Each option's `text` must be 1–100 characters.
- **Quiz mode requires `correct_option_id`.** Omitting it when `type: "quiz"` is set causes a 400 error. The ID is 0-based (first option = `0`).
- **`open_period` and `close_date` are mutually exclusive.** Use one or the other. Both valid ranges map to 5–600 seconds from the time of sending.
- **Polls are anonymous by default.** Set `is_anonymous: false` to make votes public. This cannot be changed after the poll is created.
- **Multiple answers are not allowed in quiz mode.** `allows_multiple_answers: true` is silently ignored when `type: "quiz"` is set.
- **Stop a poll later with `stopPoll`.** Use `ctx.stopPoll(messageId)` to close a poll early and receive the final [Poll](/telegram/types/Poll) object with vote counts.

## See Also

- [stopPoll](/telegram/methods/stopPoll) — Close an active poll and retrieve final results
- [Poll](/telegram/types/Poll) — The Poll type returned inside the Message
- [PollAnswer](/telegram/types/PollAnswer) — Update received when a user votes
- [InputPollOption](/telegram/types/InputPollOption) — Structure of each answer option
- [sendMessage](/telegram/methods/sendMessage) — Send a plain text message
- [sendLocation](/telegram/methods/sendLocation) — Send a location pin
- [sendContact](/telegram/methods/sendContact) — Send a contact card
- [Formatting guide](/formatting) — Format text using GramIO's `format` tagged template
