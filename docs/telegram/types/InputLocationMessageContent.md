---
title: InputLocationMessageContent — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputLocationMessageContent Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputLocationMessageContent, telegram bot api types, gramio InputLocationMessageContent, InputLocationMessageContent object, InputLocationMessageContent typescript
---

# InputLocationMessageContent

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputlocationmessagecontent" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a location message to be sent as the result of an inline query.

## Fields

<ApiParam name="latitude" type="Float" required description="Latitude of the location in degrees" />

<ApiParam name="longitude" type="Float" required description="Longitude of the location in degrees" />

<ApiParam name="horizontal_accuracy" type="Float" description="_Optional_. The radius of uncertainty for the location, measured in meters; 0-1500" />

<ApiParam name="live_period" type="Integer" description="_Optional_. Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely." />

<ApiParam name="heading" type="Integer" description="_Optional_. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified." />

<ApiParam name="proximity_alert_radius" type="Integer" description="_Optional_. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified." :max="1" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
