---
title: InputStoryContentVideo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputStoryContentVideo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputStoryContentVideo, telegram bot api types, gramio InputStoryContentVideo, InputStoryContentVideo object, InputStoryContentVideo typescript
---

# InputStoryContentVideo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputstorycontentvideo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a video to post as a story.

## Fields

<ApiParam name="type" type="String" description="Type of the content, must be *video*" defaultValue="video" />

<ApiParam name="video" type="String" required description="The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can't be reused and can only be uploaded as a new file, so you can pass “attach://&lt;file\_attach\_name&gt;” if the video was uploaded using multipart/form-data under &lt;file\_attach\_name&gt;. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="duration" type="Float" description="*Optional*. Precise duration of the video in seconds; 0-60" />

<ApiParam name="cover_frame_timestamp" type="Float" description="*Optional*. Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0." :defaultValue="0" />

<ApiParam name="is_animation" type="Boolean" description="*Optional*. Pass *True* if the video has no sound" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
