---
title: RichBlockListItem — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: RichBlockListItem Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: RichBlockListItem, telegram bot api types, gramio RichBlockListItem, RichBlockListItem object, RichBlockListItem typescript
---

# RichBlockListItem

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#richblocklistitem" target="_blank" rel="noopener">Official docs ↗</a>
</div>

An item of a list.

## Fields

<ApiParam name="label" type="String" required description="Label of the item" />

<ApiParam name="blocks" type="RichBlock[]" required description="The content of the item" />

<ApiParam name="has_checkbox" type="True" description="*Optional*. *True*, if the item has a checkbox" />

<ApiParam name="is_checked" type="True" description="*Optional*. *True*, if the item has a checked checkbox" />

<ApiParam name="value" type="Integer" description="*Optional*. For ordered lists, the numeric value of the item label" />

<ApiParam name="type" type="String" description="*Optional*. For ordered lists, the type of the item label; must be one of &quot;a&quot; for lowercase letters, &quot;A&quot; for uppercase letters, &quot;i&quot; for lowercase Roman numerals, &quot;I&quot; for uppercase Roman numerals, or &quot;1&quot; for decimal numbers" :enumValues='["a","A","i","I","1"]' />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
