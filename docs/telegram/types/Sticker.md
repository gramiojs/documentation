---
title: Sticker — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Sticker Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Sticker, telegram bot api types, gramio Sticker, Sticker object, Sticker typescript
---

# Sticker

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sticker" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a sticker.

## Fields

<ApiParam name="file_id" type="String" required description="Identifier for this file, which can be used to download or reuse the file" />

<ApiParam name="file_unique_id" type="String" required description="Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file." />

<ApiParam name="type" type="String" required description="Type of the sticker, currently one of &quot;regular&quot;, &quot;mask&quot;, &quot;custom\_emoji&quot;. The type of the sticker is independent from its format, which is determined by the fields *is\_animated* and *is\_video*." :enumValues='["regular","mask","custom_emoji"]' />

<ApiParam name="width" type="Integer" required description="Sticker width" />

<ApiParam name="height" type="Integer" required description="Sticker height" />

<ApiParam name="is_animated" type="Boolean" required description="*True*, if the sticker is [animated](https://telegram.org/blog/animated-stickers)" />

<ApiParam name="is_video" type="Boolean" required description="*True*, if the sticker is a [video sticker](https://telegram.org/blog/video-stickers-better-reactions)" />

<ApiParam name="thumbnail" type="PhotoSize" description="*Optional*. Sticker thumbnail in the .WEBP or .JPG format" />

<ApiParam name="emoji" type="String" description="*Optional*. Emoji associated with the sticker" />

<ApiParam name="set_name" type="String" description="*Optional*. Name of the sticker set to which the sticker belongs" />

<ApiParam name="premium_animation" type="File" description="*Optional*. For premium regular stickers, premium animation for the sticker" />

<ApiParam name="mask_position" type="MaskPosition" description="*Optional*. For mask stickers, the position where the mask should be placed" />

<ApiParam name="custom_emoji_id" type="String" description="*Optional*. For custom emoji stickers, unique identifier of the custom emoji" />

<ApiParam name="needs_repainting" type="True" description="*Optional*. *True*, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places" />

<ApiParam name="file_size" type="Integer" description="*Optional*. File size in bytes" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
