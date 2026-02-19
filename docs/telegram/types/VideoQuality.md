---
title: VideoQuality — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: VideoQuality Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: VideoQuality, telegram bot api types, gramio VideoQuality, VideoQuality object, VideoQuality typescript
---

# VideoQuality

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#videoquality" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a video file of a specific quality.

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="width" type="Integer" required description="Video width" />

<ApiParam name="height" type="Integer" required description="Video height" />

<ApiParam name="codec" type="String" required description="Codec that was used to encode the video, for example, “h264”, “h265”, or “av01”" />

<ApiParam name="file_size" type="Integer" description="_Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
