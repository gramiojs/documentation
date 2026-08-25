---
title: editEphemeralMessageText — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editEphemeralMessageText Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editEphemeralMessageText, telegram bot api, gramio editEphemeralMessageText, editEphemeralMessageText typescript, editEphemeralMessageText example
---

# editEphemeralMessageText

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editephemeralmessagetext" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, *True* is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup in the format `@username`" />

<ApiParam name="receiver_user_id" type="Integer" required description="Identifier of the user who received the message" />

<ApiParam name="ephemeral_message_id" type="Integer" required description="Identifier of the ephemeral message to edit" />

<ApiParam name="text" type="String" description="New text of the message, 1-4096 characters after entity parsing; required if *rich\_message* isn't specified" :minLen="1" :maxLen="4096" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in message text, which can be specified instead of *parse\_mode*" />

<ApiParam name="rich_message" type="InputRichMessage" description="New rich content of the message; required if *text* isn't specified" />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="Link preview generation options for the message" />

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
