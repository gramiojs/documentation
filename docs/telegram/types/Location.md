---
title: Location — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Location Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Location, telegram bot api types, gramio Location, Location object, Location typescript
---

# Location

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#location" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a point on the map.

## Fields

<ApiParam name="latitude" type="Float" required description="Latitude as defined by the sender" />

<ApiParam name="longitude" type="Float" required description="Longitude as defined by the sender" />

<ApiParam name="horizontal_accuracy" type="Float" description="*Optional*. The radius of uncertainty for the location, measured in meters; 0-1500" />

<ApiParam name="live_period" type="Integer" description="*Optional*. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only." />

<ApiParam name="heading" type="Integer" description="*Optional*. The direction in which user is moving, in degrees; 1-360. For active live locations only." />

<ApiParam name="proximity_alert_radius" type="Integer" description="*Optional*. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
