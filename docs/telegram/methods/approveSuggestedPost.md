---
title: approveSuggestedPost — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: approveSuggestedPost Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: approveSuggestedPost, telegram bot api, gramio approveSuggestedPost, approveSuggestedPost typescript, approveSuggestedPost example
---

# approveSuggestedPost

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#approvesuggestedpost" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can\_post\_messages' administrator right in the corresponding channel chat. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target direct messages chat" />

<ApiParam name="message_id" type="Integer" required description="Identifier of a suggested post message to approve" />

<ApiParam name="send_date" type="Integer" required description="Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
