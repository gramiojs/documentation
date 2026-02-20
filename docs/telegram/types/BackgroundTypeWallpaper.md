---
title: BackgroundTypeWallpaper — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: BackgroundTypeWallpaper Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: BackgroundTypeWallpaper, telegram bot api types, gramio BackgroundTypeWallpaper, BackgroundTypeWallpaper object, BackgroundTypeWallpaper typescript
---

# BackgroundTypeWallpaper

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#backgroundtypewallpaper" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The background is a wallpaper in the JPEG format.

## Fields

<ApiParam name="type" type="String" description="Type of the background, always &quot;wallpaper&quot;" defaultValue="wallpaper" />

<ApiParam name="document" type="Document" required description="Document with the wallpaper" />

<ApiParam name="dark_theme_dimming" type="Integer" required description="Dimming of the background in dark themes, as a percentage; 0-100" />

<ApiParam name="is_blurred" type="True" description="*Optional*. *True*, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12" />

<ApiParam name="is_moving" type="True" description="*Optional*. *True*, if the background moves slightly when the device is tilted" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
