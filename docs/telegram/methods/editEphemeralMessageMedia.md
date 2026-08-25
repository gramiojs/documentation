---
title: editEphemeralMessageMedia — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editEphemeralMessageMedia Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editEphemeralMessageMedia, telegram bot api, gramio editEphemeralMessageMedia, editEphemeralMessageMedia typescript, editEphemeralMessageMedia example
---

# editEphemeralMessageMedia

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editephemeralmessagemedia" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, *True* is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup in the format `@username`" />

<ApiParam name="receiver_user_id" type="Integer" required description="Identifier of the user who received the message" />

<ApiParam name="ephemeral_message_id" type="Integer" required description="Identifier of the ephemeral message to edit" />

<ApiParam name="media" type="InputMedia" required description="A JSON-serialized object for the new media content of the message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)" docsLink="/keyboards/overview" />

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
