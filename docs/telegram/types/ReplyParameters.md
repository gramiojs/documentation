---
title: ReplyParameters — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ReplyParameters Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ReplyParameters, telegram bot api types, gramio ReplyParameters, ReplyParameters object, ReplyParameters typescript
---

# ReplyParameters

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#replyparameters" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes reply parameters for the message that is being sent.

## Fields

<ApiParam name="message_id" type="Integer" required description="Identifier of the message that will be replied to in the current chat, or in the chat _chat\_id_ if it is specified" />

<ApiParam name="chat_id" type="Integer | String" description="_Optional_. If the message to be replied to is from a different chat, unique identifier for the chat or username of the channel (in the format `@channelusername`). Not supported for messages sent on behalf of a business account and messages from channel direct messages chats." />

<ApiParam name="allow_sending_without_reply" type="Boolean" description="_Optional_. Pass _True_ if the message should be sent even if the specified message to be replied to is not found. Always _False_ for replies in another chat or forum topic. Always _True_ for messages sent on behalf of a business account." />

<ApiParam name="quote" type="String" description="_Optional_. Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom\_emoji_ entities. The message will fail to send if the quote isn't found in the original message." />

<ApiParam name="quote_parse_mode" type="String" description="_Optional_. Mode for parsing entities in the quote. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="quote_entities" type="MessageEntity[]" description="_Optional_. A JSON-serialized list of special entities that appear in the quote. It can be specified instead of _quote\_parse\_mode_." />

<ApiParam name="quote_position" type="Integer" description="_Optional_. Position of the quote in the original message in UTF-16 code units" />

<ApiParam name="checklist_task_id" type="Integer" description="_Optional_. Identifier of the specific checklist task to be replied to" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
