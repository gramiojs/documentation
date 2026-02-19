---
title: InlineQueryResultCachedPhoto — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultCachedPhoto Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultCachedPhoto, telegram bot api types, gramio InlineQueryResultCachedPhoto, InlineQueryResultCachedPhoto object, InlineQueryResultCachedPhoto typescript
---

# InlineQueryResultCachedPhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultcachedphoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the photo.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be _photo_" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 bytes" />

<ApiParam name="photo_file_id" type="String" required description="A valid file identifier of the photo" />

<ApiParam name="title" type="String" description="_Optional_. Title for the result" />

<ApiParam name="description" type="String" description="_Optional_. Short description of the result" />

<ApiParam name="caption" type="String" description="_Optional_. Caption of the photo to be sent, 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="show_caption_above_media" type="Boolean" description="_Optional_. Pass _True_, if the caption must be shown above the message media" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="_Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" />

<ApiParam name="input_message_content" type="InputMessageContent" description="_Optional_. Content of the message to be sent instead of the photo" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
