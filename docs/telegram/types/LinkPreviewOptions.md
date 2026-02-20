---
title: LinkPreviewOptions — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: LinkPreviewOptions Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: LinkPreviewOptions, telegram bot api types, gramio LinkPreviewOptions, LinkPreviewOptions object, LinkPreviewOptions typescript
---

# LinkPreviewOptions

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#linkpreviewoptions" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes the options used for link preview generation.

## Fields

<ApiParam name="is_disabled" type="Boolean" description="*Optional*. *True*, if the link preview is disabled" />

<ApiParam name="url" type="String" description="*Optional*. URL to use for the link preview. If empty, then the first URL found in the message text will be used" />

<ApiParam name="prefer_small_media" type="Boolean" description="*Optional*. *True*, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview" />

<ApiParam name="prefer_large_media" type="Boolean" description="*Optional*. *True*, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview" />

<ApiParam name="show_above_text" type="Boolean" description="*Optional*. *True*, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
