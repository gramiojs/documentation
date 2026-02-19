---
title: declineSuggestedPost — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: declineSuggestedPost Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: declineSuggestedPost, telegram bot api, gramio declineSuggestedPost, declineSuggestedPost typescript, declineSuggestedPost example
---

# declineSuggestedPost

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#declinesuggestedpost" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can\_manage\_direct\_messages' administrator right in the corresponding channel chat. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target direct messages chat" />

<ApiParam name="message_id" type="Integer" required description="Identifier of a suggested post message to decline" />

<ApiParam name="comment" type="String" required description="Comment for the creator of the suggested post; 0-128 characters" />

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
