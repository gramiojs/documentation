---
title: InputMediaSticker — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputMediaSticker Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputMediaSticker, telegram bot api types, gramio InputMediaSticker, InputMediaSticker object, InputMediaSticker typescript
---

# InputMediaSticker

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputmediasticker" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a sticker file to be sent.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be *sticker*" constValue="sticker" />

<ApiParam name="media" type="InputFile | String" required description="File to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a .WEBP sticker from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="emoji" type="String" description="*Optional*. Emoji associated with the sticker; only for just uploaded stickers" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
