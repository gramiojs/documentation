---
title: forwardMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: forwardMessage Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: forwardMessage, telegram bot api, gramio forwardMessage, forwardMessage typescript, forwardMessage example
---

# forwardMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#forwardmessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat" />

<ApiParam name="from_chat_id" type="Integer | String" required description="Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)" />

<ApiParam name="video_start_timestamp" type="Integer" required description="New start timestamp for the forwarded video in the message" />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the forwarded message from forwarding and saving" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message; only available when forwarding to private chats" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" required description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only" />

<ApiParam name="message_id" type="Integer" required description="Message identifier in the chat specified in _from\_chat\_id_" />

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
