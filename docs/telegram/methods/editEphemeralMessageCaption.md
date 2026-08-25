---
title: editEphemeralMessageCaption — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editEphemeralMessageCaption Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editEphemeralMessageCaption, telegram bot api, gramio editEphemeralMessageCaption, editEphemeralMessageCaption typescript, editEphemeralMessageCaption example
---

# editEphemeralMessageCaption

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editephemeralmessagecaption" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, *True* is returned.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup in the format `@username`" />

<ApiParam name="receiver_user_id" type="Integer" required description="Identifier of the user who received the message" />

<ApiParam name="ephemeral_message_id" type="Integer" required description="Identifier of the ephemeral message to edit" />

<ApiParam name="caption" type="String" description="New caption of the message, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="show_caption_above_media" type="Boolean" description="Pass *True* if the caption must be shown above the message media. Supported only for animation, photo and video messages." />

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
