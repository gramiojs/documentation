---
title: InlineQueryResultVenue — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultVenue Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultVenue, telegram bot api types, gramio InlineQueryResultVenue, InlineQueryResultVenue object, InlineQueryResultVenue typescript
---

# InlineQueryResultVenue

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultvenue" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use *input\_message\_content* to send a message with the specified content instead of the venue.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be *venue*" constValue="venue" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 Bytes" />

<ApiParam name="latitude" type="Float" required description="Latitude of the venue location in degrees" />

<ApiParam name="longitude" type="Float" required description="Longitude of the venue location in degrees" />

<ApiParam name="title" type="String" required description="Title of the venue" />

<ApiParam name="address" type="String" required description="Address of the venue" />

<ApiParam name="foursquare_id" type="String" description="*Optional*. Foursquare identifier of the venue if known" />

<ApiParam name="foursquare_type" type="String" description="*Optional*. Foursquare type of the venue, if known. (For example, &quot;arts\_entertainment/default&quot;, &quot;arts\_entertainment/aquarium&quot; or &quot;food/icecream&quot;.)" />

<ApiParam name="google_place_id" type="String" description="*Optional*. Google Places identifier of the venue" />

<ApiParam name="google_place_type" type="String" description="*Optional*. Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).)" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" docsLink="/keyboards/overview" />

<ApiParam name="input_message_content" type="InputMessageContent" description="*Optional*. Content of the message to be sent instead of the venue" />

<ApiParam name="thumbnail_url" type="String" description="*Optional*. Url of the thumbnail for the result" />

<ApiParam name="thumbnail_width" type="Integer" description="*Optional*. Thumbnail width" />

<ApiParam name="thumbnail_height" type="Integer" description="*Optional*. Thumbnail height" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
