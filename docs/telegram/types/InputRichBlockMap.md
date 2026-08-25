---
title: InputRichBlockMap — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputRichBlockMap Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputRichBlockMap, telegram bot api types, gramio InputRichBlockMap, InputRichBlockMap object, InputRichBlockMap typescript
---

# InputRichBlockMap

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputrichblockmap" target="_blank" rel="noopener">Official docs ↗</a>
</div>

A block with a map, corresponding to the custom HTML tag `<tg-map>`. The map's width and height must not exceed 10000 in total. The width and height ratio must be at most 20.

## Fields

<ApiParam name="type" type="String" required description="Type of the block, always &quot;map&quot;" constValue="map" />

<ApiParam name="location" type="Location" required description="Location of the center of the map" />

<ApiParam name="zoom" type="Integer" description="*Optional*. Map zoom level; 0-24" />

<ApiParam name="width" type="Integer" description="*Optional*. Map width; 0-10000" />

<ApiParam name="height" type="Integer" description="*Optional*. Map height; 0-10000" />

<ApiParam name="caption" type="RichBlockCaption" description="*Optional*. Caption of the block" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
