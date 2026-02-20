---
title: SuggestedPostInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SuggestedPostInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SuggestedPostInfo, telegram bot api types, gramio SuggestedPostInfo, SuggestedPostInfo object, SuggestedPostInfo typescript
---

# SuggestedPostInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#suggestedpostinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Contains information about a suggested post.

## Fields

<ApiParam name="state" type="String" required description="State of the suggested post. Currently, it can be one of “pending”, “approved”, “declined”." :enumValues='["pending","approved","declined"]' />

<ApiParam name="price" type="SuggestedPostPrice" description="*Optional*. Proposed price of the post. If the field is omitted, then the post is unpaid." />

<ApiParam name="send_date" type="Integer" description="*Optional*. Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
