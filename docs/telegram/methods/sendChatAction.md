---
title: sendChatAction — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendChatAction Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendChatAction, telegram bot api, gramio sendChatAction, sendChatAction typescript, sendChatAction example
---

# sendChatAction

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendchataction" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the action will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported." />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="action" type="String" required description="Type of action to broadcast. Choose one, depending on what the user is about to receive: *typing* for [text messages](https://core.telegram.org/bots/api#sendmessage), *upload\_photo* for [photos](https://core.telegram.org/bots/api#sendphoto), *record\_video* or *upload\_video* for [videos](https://core.telegram.org/bots/api#sendvideo), *record\_voice* or *upload\_voice* for [voice notes](https://core.telegram.org/bots/api#sendvoice), *upload\_document* for [general files](https://core.telegram.org/bots/api#senddocument), *choose\_sticker* for [stickers](https://core.telegram.org/bots/api#sendsticker), *find\_location* for [location data](https://core.telegram.org/bots/api#sendlocation), *record\_video\_note* or *upload\_video\_note* for [video notes](https://core.telegram.org/bots/api#sendvideonote)." :enumValues='["typing","upload_photo","record_video","upload_video","record_voice","upload_voice","upload_document","choose_sticker","find_location","record_video_note","upload_video_note"]' />

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
