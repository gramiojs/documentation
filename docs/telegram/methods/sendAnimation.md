---
title: sendAnimation — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendAnimation Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendAnimation, telegram bot api, gramio sendAnimation, sendAnimation typescript, sendAnimation example
---

# sendAnimation

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendanimation" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" required description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="animation" type="InputFile | String" required description="Animation to send. Pass a file\_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="duration" type="Integer" required description="Duration of sent animation in seconds" />

<ApiParam name="width" type="Integer" required description="Animation width" />

<ApiParam name="height" type="Integer" required description="Animation height" />

<ApiParam name="thumbnail" type="InputFile | String" required description="Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files)" />

<ApiParam name="caption" type="String" required description="Animation caption (may also be used when resending animation by _file\_id_), 0-1024 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" required description="Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" required description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="show_caption_above_media" type="Boolean" required description="Pass _True_, if the caption must be shown above the message media" />

<ApiParam name="has_spoiler" type="Boolean" required description="Pass _True_ if the animation needs to be covered with a spoiler animation" />

<ApiParam name="disable_notification" type="Boolean" required description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" required description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" required description="Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" required description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" required description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" required description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" required description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" />

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
