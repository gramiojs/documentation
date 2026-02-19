---
title: SuggestedPostApprovalFailed — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: SuggestedPostApprovalFailed Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: SuggestedPostApprovalFailed, telegram bot api types, gramio SuggestedPostApprovalFailed, SuggestedPostApprovalFailed object, SuggestedPostApprovalFailed typescript
---

# SuggestedPostApprovalFailed

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#suggestedpostapprovalfailed" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about the failed approval of a suggested post. Currently, only caused by insufficient user funds at the time of approval.

## Fields

<ApiParam name="suggested_post_message" type="Message" description="_Optional_. Message containing the suggested post whose approval has failed. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply." />

<ApiParam name="price" type="SuggestedPostPrice" required description="Expected price of the post" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
