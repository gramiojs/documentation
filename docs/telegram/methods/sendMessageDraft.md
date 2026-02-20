---
title: sendMessageDraft — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendMessageDraft Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendMessageDraft, telegram bot api, gramio sendMessageDraft, sendMessageDraft typescript, sendMessageDraft example
---

# sendMessageDraft

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendmessagedraft" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stream a partial message to a user while the message is being generated; supported only for bots with forum topic mode enabled. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target private chat" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread" />

<ApiParam name="draft_id" type="Integer" required description="Unique identifier of the message draft; must be non-zero. Changes of drafts with the same identifier are animated" />

<ApiParam name="text" type="String" required description="Text of the message to be sent, 1-4096 characters after entities parsing" :minLen="1" :maxLen="4096" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in message text, which can be specified instead of *parse\_mode*" />

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
