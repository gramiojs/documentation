---
title: forwardMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: forwardMessages Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: forwardMessages, telegram bot api, gramio forwardMessages, forwardMessages typescript, forwardMessages example
---

# forwardMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#forwardmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of [MessageId](https://core.telegram.org/bots/api#messageid) of the sent messages is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`)" />

<ApiParam name="message_ids" type="Integer[]" required description="A JSON-serialized list of 1-100 identifiers of messages in the chat _from\_chat\_id_ to forward. The identifiers must be specified in a strictly increasing order." />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the forwarded messages from forwarding and saving" />

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
