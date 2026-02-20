---
title: ExternalReplyInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ExternalReplyInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ExternalReplyInfo, telegram bot api types, gramio ExternalReplyInfo, ExternalReplyInfo object, ExternalReplyInfo typescript
---

# ExternalReplyInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#externalreplyinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains information about a message that is being replied to, which may come from another chat or forum topic.

## Fields

<ApiParam name="origin" type="MessageOrigin" required description="Origin of the message replied to by the given message" />

<ApiParam name="chat" type="Chat" description="*Optional*. Chat the original message belongs to. Available only if the chat is a supergroup or a channel." />

<ApiParam name="message_id" type="Integer" description="*Optional*. Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel." />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="*Optional*. Options used for link preview generation for the original message, if it is a text message" />

<ApiParam name="animation" type="Animation" description="*Optional*. Message is an animation, information about the animation" />

<ApiParam name="audio" type="Audio" description="*Optional*. Message is an audio file, information about the file" />

<ApiParam name="document" type="Document" description="*Optional*. Message is a general file, information about the file" />

<ApiParam name="paid_media" type="PaidMediaInfo" description="*Optional*. Message contains paid media; information about the paid media" />

<ApiParam name="photo" type="PhotoSize[]" description="*Optional*. Message is a photo, available sizes of the photo" />

<ApiParam name="sticker" type="Sticker" description="*Optional*. Message is a sticker, information about the sticker" />

<ApiParam name="story" type="Story" description="*Optional*. Message is a forwarded story" />

<ApiParam name="video" type="Video" description="*Optional*. Message is a video, information about the video" />

<ApiParam name="video_note" type="VideoNote" description="*Optional*. Message is a [video note](https://telegram.org/blog/video-messages-and-telescope), information about the video message" />

<ApiParam name="voice" type="Voice" description="*Optional*. Message is a voice message, information about the file" />

<ApiParam name="has_media_spoiler" type="True" description="*Optional*. *True*, if the message media is covered by a spoiler animation" />

<ApiParam name="checklist" type="Checklist" description="*Optional*. Message is a checklist" />

<ApiParam name="contact" type="Contact" description="*Optional*. Message is a shared contact, information about the contact" />

<ApiParam name="dice" type="Dice" description="*Optional*. Message is a dice with random value" />

<ApiParam name="game" type="Game" description="*Optional*. Message is a game, information about the game. [More about games »](https://core.telegram.org/bots/api#games)" />

<ApiParam name="giveaway" type="Giveaway" description="*Optional*. Message is a scheduled giveaway, information about the giveaway" />

<ApiParam name="giveaway_winners" type="GiveawayWinners" description="*Optional*. A giveaway with public winners was completed" />

<ApiParam name="invoice" type="Invoice" description="*Optional*. Message is an invoice for a [payment](https://core.telegram.org/bots/api#payments), information about the invoice. [More about payments »](https://core.telegram.org/bots/api#payments)" />

<ApiParam name="location" type="Location" description="*Optional*. Message is a shared location, information about the location" />

<ApiParam name="poll" type="Poll" description="*Optional*. Message is a native poll, information about the poll" />

<ApiParam name="venue" type="Venue" description="*Optional*. Message is a venue, information about the venue" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
