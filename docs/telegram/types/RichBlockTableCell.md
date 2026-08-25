---
title: RichBlockTableCell — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: RichBlockTableCell Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: RichBlockTableCell, telegram bot api types, gramio RichBlockTableCell, RichBlockTableCell object, RichBlockTableCell typescript
---

# RichBlockTableCell

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#richblocktablecell" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Cell in a table.

## Fields

<ApiParam name="text" type="RichText" description="*Optional*. Text in the cell. If omitted, then the cell is invisible." />

<ApiParam name="is_header" type="True" description="*Optional*. *True*, if the cell is a header cell" />

<ApiParam name="colspan" type="Integer" description="*Optional*. The number of columns the cell spans if it is bigger than 1" />

<ApiParam name="rowspan" type="Integer" description="*Optional*. The number of rows the cell spans if it is bigger than 1" />

<ApiParam name="align" type="String" required description="Horizontal cell content alignment. Currently, must be one of &quot;left&quot;, &quot;center&quot;, or &quot;right&quot;." :enumValues='["left","center","right"]' />

<ApiParam name="valign" type="String" required description="Vertical cell content alignment. Currently, must be one of &quot;top&quot;, &quot;middle&quot;, or &quot;bottom&quot;." :enumValues='["top","middle","bottom"]' />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
