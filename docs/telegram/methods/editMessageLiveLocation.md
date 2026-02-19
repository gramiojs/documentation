---
title: editMessageLiveLocation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editMessageLiveLocation Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editMessageLiveLocation, telegram bot api, gramio editMessageLiveLocation, editMessageLiveLocation typescript, editMessageLiveLocation example
---

# editMessageLiveLocation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagelivelocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit live location messages. A location can be edited until its _live\_period_ expires or editing is explicitly disabled by a call to [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation). On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Required if _inline\_message\_id_ is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" required description="Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message" />

<ApiParam name="latitude" type="Float" required description="Latitude of new location" />

<ApiParam name="longitude" type="Float" required description="Longitude of new location" />

<ApiParam name="live_period" type="Integer" required description="New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current _live\_period_ by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then _live\_period_ remains unchanged" />

<ApiParam name="horizontal_accuracy" type="Float" required description="The radius of uncertainty for the location, measured in meters; 0-1500" />

<ApiParam name="heading" type="Integer" required description="Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified." />

<ApiParam name="proximity_alert_radius" type="Integer" required description="The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified." :max="1" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" required description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

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
