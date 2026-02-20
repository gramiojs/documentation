---
title: ChatFullInfo — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatFullInfo Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatFullInfo, telegram bot api types, gramio ChatFullInfo, ChatFullInfo object, ChatFullInfo typescript
---

# ChatFullInfo

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatfullinfo" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object contains full information about a chat.

## Fields

<ApiParam name="id" type="Integer" required description="Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="type" type="String" required description="Type of the chat, can be either “private”, “group”, “supergroup” or “channel”" :enumValues='["private","group","supergroup","channel"]' />

<ApiParam name="title" type="String" description="*Optional*. Title, for supergroups, channels and group chats" />

<ApiParam name="username" type="String" description="*Optional*. Username, for private chats, supergroups and channels if available" />

<ApiParam name="first_name" type="String" description="*Optional*. First name of the other party in a private chat" />

<ApiParam name="last_name" type="String" description="*Optional*. Last name of the other party in a private chat" />

<ApiParam name="is_forum" type="True" description="*Optional*. *True*, if the supergroup chat is a forum (has [topics](https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups) enabled)" />

<ApiParam name="is_direct_messages" type="True" description="*Optional*. *True*, if the chat is the direct messages chat of a channel" />

<ApiParam name="accent_color_id" type="Integer" required description="Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See [accent colors](https://core.telegram.org/bots/api#accent-colors) for more details." />

<ApiParam name="max_reaction_count" type="Integer" required description="The maximum number of reactions that can be set on a message in the chat" />

<ApiParam name="photo" type="ChatPhoto" description="*Optional*. Chat photo" />

<ApiParam name="active_usernames" type="String[]" description="*Optional*. If non-empty, the list of all [active chat usernames](https://telegram.org/blog/topics-in-groups-collectible-usernames#collectible-usernames); for private chats, supergroups and channels" />

<ApiParam name="birthdate" type="Birthdate" description="*Optional*. For private chats, the date of birth of the user" />

<ApiParam name="business_intro" type="BusinessIntro" description="*Optional*. For private chats with business accounts, the intro of the business" />

<ApiParam name="business_location" type="BusinessLocation" description="*Optional*. For private chats with business accounts, the location of the business" />

<ApiParam name="business_opening_hours" type="BusinessOpeningHours" description="*Optional*. For private chats with business accounts, the opening hours of the business" />

<ApiParam name="personal_chat" type="Chat" description="*Optional*. For private chats, the personal channel of the user" />

<ApiParam name="parent_chat" type="Chat" description="*Optional*. Information about the corresponding channel chat; for direct messages chats only" />

<ApiParam name="available_reactions" type="ReactionType[]" description="*Optional*. List of available reactions allowed in the chat. If omitted, then all [emoji reactions](https://core.telegram.org/bots/api#reactiontypeemoji) are allowed." />

<ApiParam name="background_custom_emoji_id" type="String" description="*Optional*. Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background" />

<ApiParam name="profile_accent_color_id" type="Integer" description="*Optional*. Identifier of the accent color for the chat's profile background. See [profile accent colors](https://core.telegram.org/bots/api#profile-accent-colors) for more details." />

<ApiParam name="profile_background_custom_emoji_id" type="String" description="*Optional*. Custom emoji identifier of the emoji chosen by the chat for its profile background" />

<ApiParam name="emoji_status_custom_emoji_id" type="String" description="*Optional*. Custom emoji identifier of the emoji status of the chat or the other party in a private chat" />

<ApiParam name="emoji_status_expiration_date" type="Integer" description="*Optional*. Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any" />

<ApiParam name="bio" type="String" description="*Optional*. Bio of the other party in a private chat" />

<ApiParam name="has_private_forwards" type="True" description="*Optional*. *True*, if privacy settings of the other party in the private chat allows to use `tg://user?id=&lt;user_id&gt;` links only in chats with the user" />

<ApiParam name="has_restricted_voice_and_video_messages" type="True" description="*Optional*. *True*, if the privacy settings of the other party restrict sending voice and video note messages in the private chat" />

<ApiParam name="join_to_send_messages" type="True" description="*Optional*. *True*, if users need to join the supergroup before they can send messages" />

<ApiParam name="join_by_request" type="True" description="*Optional*. *True*, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators" />

<ApiParam name="description" type="String" description="*Optional*. Description, for groups, supergroups and channel chats" />

<ApiParam name="invite_link" type="String" description="*Optional*. Primary invite link, for groups, supergroups and channel chats" />

<ApiParam name="pinned_message" type="Message" description="*Optional*. The most recent pinned message (by sending date)" />

<ApiParam name="permissions" type="ChatPermissions" description="*Optional*. Default chat member permissions, for groups and supergroups" />

<ApiParam name="accepted_gift_types" type="AcceptedGiftTypes" required description="Information about types of gifts that are accepted by the chat or by the corresponding user for private chats" />

<ApiParam name="can_send_paid_media" type="True" description="*Optional*. *True*, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats." />

<ApiParam name="slow_mode_delay" type="Integer" description="*Optional*. For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds" />

<ApiParam name="unrestrict_boost_count" type="Integer" description="*Optional*. For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions" />

<ApiParam name="message_auto_delete_time" type="Integer" description="*Optional*. The time after which all messages sent to the chat will be automatically deleted; in seconds" />

<ApiParam name="has_aggressive_anti_spam_enabled" type="True" description="*Optional*. *True*, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators." />

<ApiParam name="has_hidden_members" type="True" description="*Optional*. *True*, if non-administrators can only get the list of bots and administrators in the chat" />

<ApiParam name="has_protected_content" type="True" description="*Optional*. *True*, if messages from the chat can't be forwarded to other chats" />

<ApiParam name="has_visible_history" type="True" description="*Optional*. *True*, if new chat members will have access to old messages; available only to chat administrators" />

<ApiParam name="sticker_set_name" type="String" description="*Optional*. For supergroups, name of the group sticker set" />

<ApiParam name="can_set_sticker_set" type="True" description="*Optional*. *True*, if the bot can change the group sticker set" />

<ApiParam name="custom_emoji_sticker_set_name" type="String" description="*Optional*. For supergroups, the name of the group's custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group." />

<ApiParam name="linked_chat_id" type="Integer" description="*Optional*. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="location" type="ChatLocation" description="*Optional*. For supergroups, the location to which the supergroup is connected" />

<ApiParam name="rating" type="UserRating" description="*Optional*. For private chats, the rating of the user if any" />

<ApiParam name="first_profile_audio" type="Audio" description="*Optional*. For private chats, the first audio added to the profile of the user" />

<ApiParam name="unique_gift_colors" type="UniqueGiftColors" description="*Optional*. The color scheme based on a unique gift that must be used for the chat's name, message replies and link previews" />

<ApiParam name="paid_message_star_count" type="Integer" description="*Optional*. The number of Telegram Stars a general user have to pay to send a message to the chat" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
