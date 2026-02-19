---
title: copyMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: copyMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: copyMessage, telegram bot api, gramio copyMessage, copyMessage typescript, copyMessage example
---

# copyMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/MessageId">MessageId</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#copymessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz [poll](https://core.telegram.org/bots/api#poll) can be copied only if the value of the field _correct\_option\_id_ is known to the bot. The method is analogous to the method [forwardMessage](https://core.telegram.org/bots/api#forwardmessage), but the copied message doesn't have a link to the original message. Returns the [MessageId](https://core.telegram.org/bots/api#messageid) of the sent message on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Message identifier in the chat specified in _from\_chat\_id_" />

<ApiParam name="video_start_timestamp" type="Integer" required description="New start timestamp for the copied video in the message" />

<ApiParam name="caption" type="String" required description="New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept" />

<ApiParam name="parse_mode" type="String" required description="Mode for parsing entities in the new caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" required description="A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="show_caption_above_media" type="Boolean" required description="Pass _True_, if the caption must be shown above the message media. Ignored if a new caption isn't specified." />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" required description="Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message; only available when copying to private chats" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" required description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" required description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" required description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, the [MessageId](/telegram/types/MessageId) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
