---
title: sendRichMessageDraft — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendRichMessageDraft Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendRichMessageDraft, telegram bot api, gramio sendRichMessageDraft, sendRichMessageDraft typescript, sendRichMessageDraft example
---

# sendRichMessageDraft

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendrichmessagedraft" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you **must** call [sendRichMessage](https://core.telegram.org/bots/api#sendrichmessage) with the complete message to persist it in the user's chat. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target private chat" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread" />

<ApiParam name="draft_id" type="Integer" required description="Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation." />

<ApiParam name="rich_message" type="InputRichMessage" required description="The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported." />

<ApiParam name="can_stop" type="Boolean" description="Pass *True* to show the user a button to stop further drafts. The bot will receive an [Update](https://core.telegram.org/bots/api#update) &quot;stopped\_message\_generation&quot; if the user presses the button." />

<ApiParam name="keep_on_stop" type="Boolean" description="Pass *True* to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message." />

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
