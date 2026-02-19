---
title: editMessageMedia — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editMessageMedia Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editMessageMedia, telegram bot api, gramio editMessageMedia, editMessageMedia typescript, editMessageMedia example
---

# editMessageMedia

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagemedia" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file\_id or specify a URL. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Required if _inline\_message\_id_ is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" required description="Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message" />

<ApiParam name="media" type="InputMedia" required description="A JSON-serialized object for a new media content of the message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" required description="A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
