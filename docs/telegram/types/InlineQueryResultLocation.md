---
title: InlineQueryResultLocation — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultLocation Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultLocation, telegram bot api types, gramio InlineQueryResultLocation, InlineQueryResultLocation object, InlineQueryResultLocation typescript
---

# InlineQueryResultLocation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultlocation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the location.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _location_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 Bytes" />

<ApiParam name="latitude" type="Float" required description="Location latitude in degrees" />

<ApiParam name="longitude" type="Float" required description="Location longitude in degrees" />

<ApiParam name="title" type="String" required description="Location title" />

<ApiParam name="horizontal_accuracy" type="Float" description="_Optional_. The radius of uncertainty for the location, measured in meters; 0-1500" />

<ApiParam name="live_period" type="Integer" description="_Optional_. Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely." />

<ApiParam name="heading" type="Integer" description="_Optional_. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified." />

<ApiParam name="proximity_alert_radius" type="Integer" description="_Optional_. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified." :max="1" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the location" />

<ApiParam name="thumbnail_url" type="String" description="_Optional_. Url of the thumbnail for the result" />

<ApiParam name="thumbnail_width" type="Integer" description="_Optional_. Thumbnail width" />

<ApiParam name="thumbnail_height" type="Integer" description="_Optional_. Thumbnail height" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
