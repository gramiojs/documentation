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

Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the action will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported." />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="action" type="String" required description="Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for [text messages](https://core.telegram.org/bots/api#sendmessage), _upload\_photo_ for [photos](https://core.telegram.org/bots/api#sendphoto), _record\_video_ or _upload\_video_ for [videos](https://core.telegram.org/bots/api#sendvideo), _record\_voice_ or _upload\_voice_ for [voice notes](https://core.telegram.org/bots/api#sendvoice), _upload\_document_ for [general files](https://core.telegram.org/bots/api#senddocument), _choose\_sticker_ for [stickers](https://core.telegram.org/bots/api#sendsticker), _find\_location_ for [location data](https://core.telegram.org/bots/api#sendlocation), _record\_video\_note_ or _upload\_video\_note_ for [video notes](https://core.telegram.org/bots/api#sendvideonote)." />

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
