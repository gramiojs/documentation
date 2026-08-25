---
title: InputRichMessageMedia — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputRichMessageMedia Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputRichMessageMedia, telegram bot api types, gramio InputRichMessageMedia, InputRichMessageMedia object, InputRichMessageMedia typescript
---

# InputRichMessageMedia

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputrichmessagemedia" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a media element embedded in an outgoing rich message.

## Fields

<ApiParam name="id" type="String" required description="Unique identifier of the media used in a `tg://photo?id=`, `tg://video?id=`, `tg://document?id=`, or `tg://audio?id=` link. 1-64 characters, only `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed." :minLen="1" :maxLen="64" />

<ApiParam name="media" type="InputMediaAnimation | InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo | InputMediaVoiceNote" required description="The media to be sent. Everything except the media itself and its properties is ignored." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
