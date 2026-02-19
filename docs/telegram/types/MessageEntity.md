---
title: MessageEntity — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: MessageEntity Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: MessageEntity, telegram bot api types, gramio MessageEntity, MessageEntity object, MessageEntity typescript
---

# MessageEntity

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#messageentity" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.

## Fields

<ApiParam name="type" type="String" required description="Type of the entity. Currently, can be “mention” (`@username`), “hashtag” (`#hashtag` or `#hashtag@chatusername`), “cashtag” (`$USD` or `$USD@chatusername`), “bot\_command” (`/start@jobs_bot`), “url” (`https://telegram.org`), “email” (`do-not-reply@telegram.org`), “phone\_number” (`+1-212-555-0123`), “bold” (**bold text**), “italic” (_italic text_), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable\_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text\_link” (for clickable text URLs), “text\_mention” (for users [without usernames](https://telegram.org/blog/edit#new-mentions)), “custom\_emoji” (for inline custom emoji stickers)" />

<ApiParam name="offset" type="Integer" required description="Offset in [UTF-16 code units](https://core.telegram.org/api/entities#entity-length) to the start of the entity" />

<ApiParam name="length" type="Integer" required description="Length of the entity in [UTF-16 code units](https://core.telegram.org/api/entities#entity-length)" />

<ApiParam name="url" type="String" description="_Optional_. For “text\_link” only, URL that will be opened after user taps on the text" />

<ApiParam name="user" type="User" description="_Optional_. For “text\_mention” only, the mentioned user" />

<ApiParam name="language" type="String" description="_Optional_. For “pre” only, the programming language of the entity text" />

<ApiParam name="custom_emoji_id" type="String" description="_Optional_. For “custom\_emoji” only, unique identifier of the custom emoji. Use [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers) to get full information about the sticker" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
