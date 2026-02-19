---
title: Update — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Update Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Update, telegram bot api types, gramio Update, Update object, Update typescript
---

# Update

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#update" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This [object](https://core.telegram.org/bots/api#available-types) represents an incoming update.  
At most **one** of the optional parameters can be present in any given update.

## Fields

<ApiParam name="update_id" type="Integer" required description="The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using [webhooks](https://core.telegram.org/bots/api#setwebhook), since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially." />

<ApiParam name="message" type="Message" description="_Optional_. New incoming message of any kind - text, photo, sticker, etc." />

<ApiParam name="edited_message" type="Message" description="_Optional_. New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot." />

<ApiParam name="channel_post" type="Message" description="_Optional_. New incoming channel post of any kind - text, photo, sticker, etc." />

<ApiParam name="edited_channel_post" type="Message" description="_Optional_. New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot." />

<ApiParam name="business_connection" type="BusinessConnection" description="_Optional_. The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot" />

<ApiParam name="business_message" type="Message" description="_Optional_. New message from a connected business account" />

<ApiParam name="edited_business_message" type="Message" description="_Optional_. New version of a message from a connected business account" />

<ApiParam name="deleted_business_messages" type="BusinessMessagesDeleted" description="_Optional_. Messages were deleted from a connected business account" />

<ApiParam name="message_reaction" type="MessageReactionUpdated" description="_Optional_. A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify `&quot;message_reaction&quot;` in the list of _allowed\_updates_ to receive these updates. The update isn't received for reactions set by bots." />

<ApiParam name="message_reaction_count" type="MessageReactionCountUpdated" description="_Optional_. Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify `&quot;message_reaction_count&quot;` in the list of _allowed\_updates_ to receive these updates. The updates are grouped and can be sent with delay up to a few minutes." />

<ApiParam name="inline_query" type="InlineQuery" description="_Optional_. New incoming [inline](https://core.telegram.org/bots/api#inline-mode) query" />

<ApiParam name="chosen_inline_result" type="ChosenInlineResult" description="_Optional_. The result of an [inline](https://core.telegram.org/bots/api#inline-mode) query that was chosen by a user and sent to their chat partner. Please see our documentation on the [feedback collecting](https://core.telegram.org/bots/inline#collecting-feedback) for details on how to enable these updates for your bot." />

<ApiParam name="callback_query" type="CallbackQuery" description="_Optional_. New incoming callback query" />

<ApiParam name="shipping_query" type="ShippingQuery" description="_Optional_. New incoming shipping query. Only for invoices with flexible price" />

<ApiParam name="pre_checkout_query" type="PreCheckoutQuery" description="_Optional_. New incoming pre-checkout query. Contains full information about checkout" />

<ApiParam name="purchased_paid_media" type="PaidMediaPurchased" description="_Optional_. A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat" />

<ApiParam name="poll" type="Poll" description="_Optional_. New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot" />

<ApiParam name="poll_answer" type="PollAnswer" description="_Optional_. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself." />

<ApiParam name="my_chat_member" type="ChatMemberUpdated" description="_Optional_. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user." />

<ApiParam name="chat_member" type="ChatMemberUpdated" description="_Optional_. A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify `&quot;chat_member&quot;` in the list of _allowed\_updates_ to receive these updates." />

<ApiParam name="chat_join_request" type="ChatJoinRequest" description="_Optional_. A request to join the chat has been sent. The bot must have the _can\_invite\_users_ administrator right in the chat to receive these updates." />

<ApiParam name="chat_boost" type="ChatBoostUpdated" description="_Optional_. A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates." />

<ApiParam name="removed_chat_boost" type="ChatBoostRemoved" description="_Optional_. A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
