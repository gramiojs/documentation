---
title: InputMediaVoiceNote — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputMediaVoiceNote Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputMediaVoiceNote, telegram bot api types, gramio InputMediaVoiceNote, InputMediaVoiceNote object, InputMediaVoiceNote typescript
---

# InputMediaVoiceNote

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputmediavoicenote" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a voice message file to be sent.

## Fields

<ApiParam name="type" type="String" required description="Type of the media, must be *voice\_note*" constValue="voice_note" />

<ApiParam name="media" type="InputFile | String" required description="File to send. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass &quot;attach://&lt;file\_attach\_name&gt;&quot; to upload a new one using multipart/form-data under &lt;file\_attach\_name&gt; name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" docsLink="/files/media-upload" />

<ApiParam name="caption" type="String" description="*Optional*. Caption of the voice message to be sent, 0-1024 characters after entities parsing" :minLen="0" :maxLen="1024" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="duration" type="Integer" description="*Optional*. Duration of the voice message in seconds" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
