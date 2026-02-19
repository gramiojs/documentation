---
title: sendPoll — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendPoll Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendPoll, telegram bot api, gramio sendPoll, sendPoll typescript, sendPoll example
---

# sendPoll

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendpoll" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send a native poll. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can't be sent to channel direct messages chats." />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="question" type="String" required description="Poll question, 1-300 characters" />

<ApiParam name="question_parse_mode" type="String" required description="Mode for parsing entities in the question. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Currently, only custom emoji entities are allowed" />

<ApiParam name="question_entities" type="MessageEntity[]" required description="A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of _question\_parse\_mode_" />

<ApiParam name="options" type="InputPollOption[]" required description="A JSON-serialized list of 2-12 answer options" />

<ApiParam name="is_anonymous" type="Boolean" required description="_True_, if the poll needs to be anonymous, defaults to _True_" />

<ApiParam name="type" type="String" required description="Poll type, “quiz” or “regular”, defaults to “regular”" />

<ApiParam name="allows_multiple_answers" type="Boolean" required description="_True_, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to _False_" />

<ApiParam name="correct_option_id" type="Integer" required description="0-based identifier of the correct answer option, required for polls in quiz mode" />

<ApiParam name="explanation" type="String" required description="Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing" />

<ApiParam name="explanation_parse_mode" type="String" required description="Mode for parsing entities in the explanation. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="explanation_entities" type="MessageEntity[]" required description="A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of _explanation\_parse\_mode_" />

<ApiParam name="open_period" type="Integer" required description="Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with _close\_date_." :min="5" :max="600" />

<ApiParam name="close_date" type="Integer" required description="Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with _open\_period_." />

<ApiParam name="is_closed" type="Boolean" required description="Pass _True_ if the poll needs to be immediately closed. This can be useful for poll preview." />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" required description="Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="reply_parameters" type="ReplyParameters" required description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" required description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
