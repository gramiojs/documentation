---
title: Message — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Complete reference for the Telegram Bot API Message object. All fields explained with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: telegram Message type, telegram message object, message fields, telegram bot api types, gramio Message, ctx.message
---

# Message

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#message" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a message.

## Fields

<ApiParam name="message_id" type="Integer" required description="Unique message identifier inside this chat. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent" />

<ApiParam name="message_thread_id" type="Integer" description="*Optional*. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only" />

<ApiParam name="direct_messages_topic" type="DirectMessagesTopic" description="*Optional*. Information about the direct messages chat topic that contains the message" />

<ApiParam name="from" type="User" description="*Optional*. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats" />

<ApiParam name="sender_chat" type="Chat" description="*Optional*. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field *from* contains a fake sender user in non-channel chats." />

<ApiParam name="sender_boost_count" type="Integer" description="*Optional*. If the sender of the message boosted the chat, the number of boosts added by the user" />

<ApiParam name="sender_business_bot" type="User" description="*Optional*. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account." />

<ApiParam name="date" type="Integer" required description="Date the message was sent in Unix time. It is always a positive number, representing a valid date." />

<ApiParam name="business_connection_id" type="String" description="*Optional*. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier." />

<ApiParam name="chat" type="Chat" required description="Chat the message belongs to" />

<ApiParam name="forward_origin" type="MessageOrigin" description="*Optional*. Information about the original message for forwarded messages" />

<ApiParam name="is_topic_message" type="True" description="*Optional*. *True*, if the message is sent to a topic in a forum supergroup or a private chat with the bot" />

<ApiParam name="is_automatic_forward" type="True" description="*Optional*. *True*, if the message is a channel post that was automatically forwarded to the connected discussion group" />

<ApiParam name="reply_to_message" type="Message" description="*Optional*. For replies in the same chat and message thread, the original message. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain further *reply\_to\_message* fields even if it itself is a reply." />

<ApiParam name="external_reply" type="ExternalReplyInfo" description="*Optional*. Information about the message that is being replied to, which may come from another chat or forum topic" />

<ApiParam name="quote" type="TextQuote" description="*Optional*. For replies that quote part of the original message, the quoted part of the message" />

<ApiParam name="reply_to_story" type="Story" description="*Optional*. For replies to a story, the original story" />

<ApiParam name="reply_to_checklist_task_id" type="Integer" description="*Optional*. Identifier of the specific checklist task that is being replied to" />

<ApiParam name="via_bot" type="User" description="*Optional*. Bot through which the message was sent" />

<ApiParam name="edit_date" type="Integer" description="*Optional*. Date the message was last edited in Unix time" />

<ApiParam name="has_protected_content" type="True" description="*Optional*. *True*, if the message can't be forwarded" />

<ApiParam name="is_from_offline" type="True" description="*Optional*. *True*, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message" />

<ApiParam name="is_paid_post" type="True" description="*Optional*. *True*, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited." />

<ApiParam name="media_group_id" type="String" description="*Optional*. The unique identifier of a media message group this message belongs to" />

<ApiParam name="author_signature" type="String" description="*Optional*. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator" />

<ApiParam name="paid_star_count" type="Integer" description="*Optional*. The number of Telegram Stars that were paid by the sender of the message to send it" />

<ApiParam name="text" type="String" description="*Optional*. For text messages, the actual UTF-8 text of the message" />

<ApiParam name="entities" type="MessageEntity[]" description="*Optional*. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text" />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="*Optional*. Options used for link preview generation for the message, if it is a text message and link preview options were changed" />

<ApiParam name="suggested_post_info" type="SuggestedPostInfo" description="*Optional*. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited." />

<ApiParam name="effect_id" type="String" description="*Optional*. Unique identifier of the message effect added to the message" />

<ApiParam name="animation" type="Animation" description="*Optional*. Message is an animation, information about the animation. For backward compatibility, when this field is set, the *document* field will also be set" />

<ApiParam name="audio" type="Audio" description="*Optional*. Message is an audio file, information about the file" />

<ApiParam name="document" type="Document" description="*Optional*. Message is a general file, information about the file" />

<ApiParam name="paid_media" type="PaidMediaInfo" description="*Optional*. Message contains paid media; information about the paid media" />

<ApiParam name="photo" type="PhotoSize[]" description="*Optional*. Message is a photo, available sizes of the photo" />

<ApiParam name="sticker" type="Sticker" description="*Optional*. Message is a sticker, information about the sticker" />

<ApiParam name="story" type="Story" description="*Optional*. Message is a forwarded story" />

<ApiParam name="video" type="Video" description="*Optional*. Message is a video, information about the video" />

<ApiParam name="video_note" type="VideoNote" description="*Optional*. Message is a [video note](https://telegram.org/blog/video-messages-and-telescope), information about the video message" />

<ApiParam name="voice" type="Voice" description="*Optional*. Message is a voice message, information about the file" />

<ApiParam name="caption" type="String" description="*Optional*. Caption for the animation, audio, document, paid media, photo, video or voice" />

<ApiParam name="caption_entities" type="MessageEntity[]" description="*Optional*. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption" />

<ApiParam name="show_caption_above_media" type="True" description="*Optional*. *True*, if the caption must be shown above the message media" />

<ApiParam name="has_media_spoiler" type="True" description="*Optional*. *True*, if the message media is covered by a spoiler animation" />

<ApiParam name="checklist" type="Checklist" description="*Optional*. Message is a checklist" />

<ApiParam name="contact" type="Contact" description="*Optional*. Message is a shared contact, information about the contact" />

<ApiParam name="dice" type="Dice" description="*Optional*. Message is a dice with random value" />

<ApiParam name="game" type="Game" description="*Optional*. Message is a game, information about the game. [More about games »](https://core.telegram.org/bots/api#games)" />

<ApiParam name="poll" type="Poll" description="*Optional*. Message is a native poll, information about the poll" />

<ApiParam name="venue" type="Venue" description="*Optional*. Message is a venue, information about the venue. For backward compatibility, when this field is set, the *location* field will also be set" />

<ApiParam name="location" type="Location" description="*Optional*. Message is a shared location, information about the location" />

<ApiParam name="new_chat_members" type="User[]" description="*Optional*. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)" />

<ApiParam name="left_chat_member" type="User" description="*Optional*. A member was removed from the group, information about them (this member may be the bot itself)" />

<ApiParam name="chat_owner_left" type="ChatOwnerLeft" description="*Optional*. Service message: chat owner has left" />

<ApiParam name="chat_owner_changed" type="ChatOwnerChanged" description="*Optional*. Service message: chat owner has changed" />

<ApiParam name="new_chat_title" type="String" description="*Optional*. A chat title was changed to this value" />

<ApiParam name="new_chat_photo" type="PhotoSize[]" description="*Optional*. A chat photo was change to this value" />

<ApiParam name="delete_chat_photo" type="True" description="*Optional*. Service message: the chat photo was deleted" />

<ApiParam name="group_chat_created" type="True" description="*Optional*. Service message: the group has been created" />

<ApiParam name="supergroup_chat_created" type="True" description="*Optional*. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply\_to\_message if someone replies to a very first message in a directly created supergroup." />

<ApiParam name="channel_chat_created" type="True" description="*Optional*. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply\_to\_message if someone replies to a very first message in a channel." />

<ApiParam name="message_auto_delete_timer_changed" type="MessageAutoDeleteTimerChanged" description="*Optional*. Service message: auto-delete timer settings changed in the chat" />

<ApiParam name="migrate_to_chat_id" type="Integer" description="*Optional*. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="migrate_from_chat_id" type="Integer" description="*Optional*. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="pinned_message" type="MaybeInaccessibleMessage" description="*Optional*. Specified message was pinned. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain further *reply\_to\_message* fields even if it itself is a reply." />

<ApiParam name="invoice" type="Invoice" description="*Optional*. Message is an invoice for a [payment](https://core.telegram.org/bots/api#payments), information about the invoice. [More about payments »](https://core.telegram.org/bots/api#payments)" />

<ApiParam name="successful_payment" type="SuccessfulPayment" description="*Optional*. Message is a service message about a successful payment, information about the payment. [More about payments »](https://core.telegram.org/bots/api#payments)" />

<ApiParam name="refunded_payment" type="RefundedPayment" description="*Optional*. Message is a service message about a refunded payment, information about the payment. [More about payments »](https://core.telegram.org/bots/api#payments)" />

<ApiParam name="users_shared" type="UsersShared" description="*Optional*. Service message: users were shared with the bot" />

<ApiParam name="chat_shared" type="ChatShared" description="*Optional*. Service message: a chat was shared with the bot" />

<ApiParam name="gift" type="GiftInfo" description="*Optional*. Service message: a regular gift was sent or received" />

<ApiParam name="unique_gift" type="UniqueGiftInfo" description="*Optional*. Service message: a unique gift was sent or received" />

<ApiParam name="gift_upgrade_sent" type="GiftInfo" description="*Optional*. Service message: upgrade of a gift was purchased after the gift was sent" />

<ApiParam name="connected_website" type="String" description="*Optional*. The domain name of the website on which the user has logged in. [More about Telegram Login »](https://core.telegram.org/widgets/login)" />

<ApiParam name="write_access_allowed" type="WriteAccessAllowed" description="*Optional*. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method [requestWriteAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps)" />

<ApiParam name="passport_data" type="PassportData" description="*Optional*. Telegram Passport data" />

<ApiParam name="proximity_alert_triggered" type="ProximityAlertTriggered" description="*Optional*. Service message. A user in the chat triggered another user's proximity alert while sharing Live Location." />

<ApiParam name="boost_added" type="ChatBoostAdded" description="*Optional*. Service message: user boosted the chat" />

<ApiParam name="chat_background_set" type="ChatBackground" description="*Optional*. Service message: chat background set" />

<ApiParam name="checklist_tasks_done" type="ChecklistTasksDone" description="*Optional*. Service message: some tasks in a checklist were marked as done or not done" />

<ApiParam name="checklist_tasks_added" type="ChecklistTasksAdded" description="*Optional*. Service message: tasks were added to a checklist" />

<ApiParam name="direct_message_price_changed" type="DirectMessagePriceChanged" description="*Optional*. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed" />

<ApiParam name="forum_topic_created" type="ForumTopicCreated" description="*Optional*. Service message: forum topic created" />

<ApiParam name="forum_topic_edited" type="ForumTopicEdited" description="*Optional*. Service message: forum topic edited" />

<ApiParam name="forum_topic_closed" type="ForumTopicClosed" description="*Optional*. Service message: forum topic closed" />

<ApiParam name="forum_topic_reopened" type="ForumTopicReopened" description="*Optional*. Service message: forum topic reopened" />

<ApiParam name="general_forum_topic_hidden" type="GeneralForumTopicHidden" description="*Optional*. Service message: the 'General' forum topic hidden" />

<ApiParam name="general_forum_topic_unhidden" type="GeneralForumTopicUnhidden" description="*Optional*. Service message: the 'General' forum topic unhidden" />

<ApiParam name="giveaway_created" type="GiveawayCreated" description="*Optional*. Service message: a scheduled giveaway was created" />

<ApiParam name="giveaway" type="Giveaway" description="*Optional*. The message is a scheduled giveaway message" />

<ApiParam name="giveaway_winners" type="GiveawayWinners" description="*Optional*. A giveaway with public winners was completed" />

<ApiParam name="giveaway_completed" type="GiveawayCompleted" description="*Optional*. Service message: a giveaway without public winners was completed" />

<ApiParam name="paid_message_price_changed" type="PaidMessagePriceChanged" description="*Optional*. Service message: the price for paid messages has changed in the chat" />

<ApiParam name="suggested_post_approved" type="SuggestedPostApproved" description="*Optional*. Service message: a suggested post was approved" />

<ApiParam name="suggested_post_approval_failed" type="SuggestedPostApprovalFailed" description="*Optional*. Service message: approval of a suggested post has failed" />

<ApiParam name="suggested_post_declined" type="SuggestedPostDeclined" description="*Optional*. Service message: a suggested post was declined" />

<ApiParam name="suggested_post_paid" type="SuggestedPostPaid" description="*Optional*. Service message: payment for a suggested post was received" />

<ApiParam name="suggested_post_refunded" type="SuggestedPostRefunded" description="*Optional*. Service message: payment for a suggested post was refunded" />

<ApiParam name="video_chat_scheduled" type="VideoChatScheduled" description="*Optional*. Service message: video chat scheduled" />

<ApiParam name="video_chat_started" type="VideoChatStarted" description="*Optional*. Service message: video chat started" />

<ApiParam name="video_chat_ended" type="VideoChatEnded" description="*Optional*. Service message: video chat ended" />

<ApiParam name="video_chat_participants_invited" type="VideoChatParticipantsInvited" description="*Optional*. Service message: new participants invited to a video chat" />

<ApiParam name="web_app_data" type="WebAppData" description="*Optional*. Service message: data sent by a Web App" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message. `login_url` buttons are represented as ordinary `url` buttons." />

<!-- GENERATED:END -->

## GramIO Usage

In GramIO, `Message` is accessible through context objects in update handlers:

```typescript
// message context has the message directly
bot.on("message", (ctx) => {
  const msg = ctx.message; // Message object

  console.log(msg.message_id);
  console.log(msg.text);       // undefined for non-text messages
  console.log(msg.from?.id);   // sender user ID
  console.log(msg.chat.id);    // chat ID
  console.log(msg.date);       // Unix timestamp
});

// Check message type by checking which field is present
bot.on("message", (ctx) => {
  if (ctx.message.photo) {
    console.log("Got a photo!");
  } else if (ctx.message.text) {
    console.log("Got text:", ctx.message.text);
  }
});

// Access reply
bot.on("message", (ctx) => {
  if (ctx.message.reply_to_message) {
    const originalText = ctx.message.reply_to_message.text;
    ctx.send(`You replied to: "${originalText}"`);
  }
});

// sendMessage returns a Message
const sentMsg = await bot.api.sendMessage({
  chat_id: 123,
  text: "Hello!",
});
console.log(sentMsg.message_id); // now you can edit/delete it
```

## Tips & Gotchas

- **Most fields are optional** — a `Message` represents _any_ type of message. Check for the specific field (`text`, `photo`, `video`, etc.) to determine the message type.
- **`from` can be absent** in channel posts where messages are sent on behalf of the channel.
- **`date` is a Unix timestamp** (seconds since epoch). Convert with `new Date(msg.date * 1000)`.
- **Forwarded messages** have `forward_origin` — the `from` field still reflects the forwarder (the user who forwarded it to your bot).
- **GramIO context** provides convenience getters — e.g. `ctx.from` is shorthand for `ctx.message.from`.

## Used By

Methods that return a `Message`:

- [sendMessage](/telegram/methods/sendMessage) — Send text
- [sendPhoto](/telegram/methods/sendPhoto) — Send photo
- [sendDocument](/telegram/methods/sendDocument) — Send file
- [sendVideo](/telegram/methods/sendVideo) — Send video
- [editMessageText](/telegram/methods/editMessageText) — Edit message text
- [copyMessage](/telegram/methods/copyMessage) — Copy a message

## See Also

- [Update](/telegram/types/Update) — The wrapper object that contains `Message` in polling/webhook updates
- [User](/telegram/types/User) — Represents `msg.from`
- [Chat](/telegram/types/Chat) — Represents `msg.chat`
- [MessageEntity](/telegram/types/MessageEntity) — Represents formatting entities in `msg.entities`
