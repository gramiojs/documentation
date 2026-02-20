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

<ApiParam name="type" type="String" required description="Type of the entity. Currently, can be &quot;mention&quot; (`@username`), &quot;hashtag&quot; (`#hashtag` or `#hashtag@chatusername`), &quot;cashtag&quot; (`$USD` or `$USD@chatusername`), &quot;bot\_command&quot; (`/start@jobs_bot`), &quot;url&quot; (`https://telegram.org`), &quot;email&quot; (`do-not-reply@telegram.org`), &quot;phone\_number&quot; (`+1-212-555-0123`), &quot;bold&quot; (**bold text**), &quot;italic&quot; (*italic text*), &quot;underline&quot; (underlined text), &quot;strikethrough&quot; (strikethrough text), &quot;spoiler&quot; (spoiler message), &quot;blockquote&quot; (block quotation), &quot;expandable\_blockquote&quot; (collapsed-by-default block quotation), &quot;code&quot; (monowidth string), &quot;pre&quot; (monowidth block), &quot;text\_link&quot; (for clickable text URLs), &quot;text\_mention&quot; (for users [without usernames](https://telegram.org/blog/edit#new-mentions)), &quot;custom\_emoji&quot; (for inline custom emoji stickers)" :enumValues='["mention","hashtag","cashtag","bot_command","url","email","phone_number","bold","italic","underline","strikethrough","spoiler","blockquote","expandable_blockquote","code","pre","text_link","text_mention","custom_emoji"]' />

<ApiParam name="offset" type="Integer" required description="Offset in [UTF-16 code units](https://core.telegram.org/api/entities#entity-length) to the start of the entity" />

<ApiParam name="length" type="Integer" required description="Length of the entity in [UTF-16 code units](https://core.telegram.org/api/entities#entity-length)" />

<ApiParam name="url" type="String" description="*Optional*. For &quot;text\_link&quot; only, URL that will be opened after user taps on the text" />

<ApiParam name="user" type="User" description="*Optional*. For &quot;text\_mention&quot; only, the mentioned user" />

<ApiParam name="language" type="String" description="*Optional*. For &quot;pre&quot; only, the programming language of the entity text" />

<ApiParam name="custom_emoji_id" type="String" description="*Optional*. For &quot;custom\_emoji&quot; only, unique identifier of the custom emoji. Use [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers) to get full information about the sticker" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
