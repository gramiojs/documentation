---
title: InputProfilePhotoAnimated — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputProfilePhotoAnimated Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputProfilePhotoAnimated, telegram bot api types, gramio InputProfilePhotoAnimated, InputProfilePhotoAnimated object, InputProfilePhotoAnimated typescript
---

# InputProfilePhotoAnimated

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputprofilephotoanimated" target="_blank" rel="noopener">Official docs ↗</a>
</div>

An animated profile photo in the MPEG4 format.

## Fields

<ApiParam name="type" type="String" required description="Type of the profile photo, must be *animated*" constValue="animated" />

<ApiParam name="animation" type="InputFile | String" required description="The animated profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass &quot;attach://&lt;file\_attach\_name&gt;&quot; if the photo was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="main_frame_timestamp" type="Float" description="*Optional*. Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0." :defaultValue="0" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
