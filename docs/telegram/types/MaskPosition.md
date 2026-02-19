---
title: MaskPosition — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: MaskPosition Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: MaskPosition, telegram bot api types, gramio MaskPosition, MaskPosition object, MaskPosition typescript
---

# MaskPosition

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#maskposition" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object describes the position on faces where a mask should be placed by default.

## Fields

<ApiParam name="point" type="String" required description="The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”." />

<ApiParam name="x_shift" type="Float" required description="Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position." />

<ApiParam name="y_shift" type="Float" required description="Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position." />

<ApiParam name="scale" type="Float" required description="Mask scaling coefficient. For example, 2.0 means double size." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
