---
title: User — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: User Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: User, telegram bot api types, gramio User, User object, User typescript
---

# User

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#user" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a Telegram user or bot.

## Fields

<ApiParam name="id" type="Integer" required description="Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier." />

<ApiParam name="is_bot" type="Boolean" required description="*True*, if this user is a bot" />

<ApiParam name="first_name" type="String" required description="User's or bot's first name" />

<ApiParam name="last_name" type="String" description="*Optional*. User's or bot's last name" />

<ApiParam name="username" type="String" description="*Optional*. User's or bot's username" />

<ApiParam name="language_code" type="String" description="*Optional*. [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the user's language" />

<ApiParam name="is_premium" type="True" description="*Optional*. *True*, if this user is a Telegram Premium user" />

<ApiParam name="added_to_attachment_menu" type="True" description="*Optional*. *True*, if this user added the bot to the attachment menu" />

<ApiParam name="can_join_groups" type="Boolean" description="*Optional*. *True*, if the bot can be invited to groups. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<ApiParam name="can_read_all_group_messages" type="Boolean" description="*Optional*. *True*, if [privacy mode](https://core.telegram.org/bots/features#privacy-mode) is disabled for the bot. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<ApiParam name="supports_inline_queries" type="Boolean" description="*Optional*. *True*, if the bot supports inline queries. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<ApiParam name="can_connect_to_business" type="Boolean" description="*Optional*. *True*, if the bot can be connected to a Telegram Business account to receive its messages. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<ApiParam name="has_main_web_app" type="Boolean" description="*Optional*. *True*, if the bot has a main Web App. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<ApiParam name="has_topics_enabled" type="Boolean" description="*Optional*. *True*, if the bot has forum topic mode enabled in private chats. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<ApiParam name="allows_users_to_create_topics" type="Boolean" description="*Optional*. *True*, if the bot allows users to create and delete topics in private chats. Returned only in [getMe](https://core.telegram.org/bots/api#getme)." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
