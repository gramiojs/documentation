---
title: Video — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Video Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Video, telegram bot api types, gramio Video, Video object, Video typescript
---

# Video

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#video" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a video file.

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="width" type="Integer" required description="Video width as defined by the sender" />

<ApiParam name="height" type="Integer" required description="Video height as defined by the sender" />

<ApiParam name="duration" type="Integer" required description="Duration of the video in seconds as defined by the sender" />

<ApiParam name="thumbnail" type="PhotoSize" description="*Optional*. Video thumbnail" />

<ApiParam name="cover" type="PhotoSize[]" description="*Optional*. Available sizes of the cover of the video in the message" />

<ApiParam name="start_timestamp" type="Integer" description="*Optional*. Timestamp in seconds from which the video will play in the message" />

<ApiParam name="qualities" type="VideoQuality[]" description="*Optional*. List of available qualities of the video" />

<ApiParam name="file_name" type="String" description="*Optional*. Original filename as defined by the sender" />

<ApiParam name="mime_type" type="String" description="*Optional*. MIME type of the file as defined by the sender" />

<ApiParam name="file_size" type="Integer" description="*Optional*. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
