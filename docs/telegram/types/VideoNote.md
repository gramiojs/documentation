---
title: VideoNote — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: VideoNote Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: VideoNote, telegram bot api types, gramio VideoNote, VideoNote object, VideoNote typescript
---

# VideoNote

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#videonote" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a [video message](https://telegram.org/blog/video-messages-and-telescope) (available in Telegram apps as of [v.4.0](https://telegram.org/blog/video-messages-and-telescope)).

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="length" type="Integer" required description="Video width and height (diameter of the video message) as defined by the sender" />

<ApiParam name="duration" type="Integer" required description="Duration of the video in seconds as defined by the sender" />

<ApiParam name="thumbnail" type="PhotoSize" description="_Optional_. Video thumbnail" />

<ApiParam name="file_size" type="Integer" description="_Optional_. File size in bytes" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
