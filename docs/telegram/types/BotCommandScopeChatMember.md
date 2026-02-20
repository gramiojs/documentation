---
title: BotCommandScopeChatMember — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: BotCommandScopeChatMember Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: BotCommandScopeChatMember, telegram bot api types, gramio BotCommandScopeChatMember, BotCommandScopeChatMember object, BotCommandScopeChatMember typescript
---

# BotCommandScopeChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#botcommandscopechatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering a specific member of a group or supergroup chat.

## Fields

<ApiParam name="type" type="String" description="Scope type, must be *chat\_member*" defaultValue="chat_member" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren't supported." />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
