---
title: sendVenue — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendVenue Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendVenue, telegram bot api, gramio sendVenue, sendVenue typescript, sendVenue example
---

# sendVenue

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendvenue" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send information about a venue. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="latitude" type="Float" required description="Latitude of the venue" />

<ApiParam name="longitude" type="Float" required description="Longitude of the venue" />

<ApiParam name="title" type="String" required description="Name of the venue" />

<ApiParam name="address" type="String" required description="Address of the venue" />

<ApiParam name="foursquare_id" type="String" description="Foursquare identifier of the venue" />

<ApiParam name="foursquare_type" type="String" description="Foursquare type of the venue, if known. (For example, &quot;arts\_entertainment/default&quot;, &quot;arts\_entertainment/aquarium&quot; or &quot;food/icecream&quot;.)" />

<ApiParam name="google_place_id" type="String" description="Google Places identifier of the venue" />

<ApiParam name="google_place_type" type="String" description="Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).)" />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
