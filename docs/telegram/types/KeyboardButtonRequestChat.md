---
title: KeyboardButtonRequestChat — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: KeyboardButtonRequestChat Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: KeyboardButtonRequestChat, telegram bot api types, gramio KeyboardButtonRequestChat, KeyboardButtonRequestChat object, KeyboardButtonRequestChat typescript
---

# KeyboardButtonRequestChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#keyboardbuttonrequestchat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object defines the criteria used to request a suitable chat. Information about the selected chat will be shared with the bot when the corresponding button is pressed. The bot will be granted requested rights in the chat if appropriate. [More about requesting chats »](https://core.telegram.org/bots/features#chat-and-user-selection).

## Fields

<ApiParam name="request_id" type="Integer" required description="Signed 32-bit identifier of the request, which will be received back in the [ChatShared](https://core.telegram.org/bots/api#chatshared) object. Must be unique within the message" />

<ApiParam name="chat_is_channel" type="Boolean" required description="Pass _True_ to request a channel chat, pass _False_ to request a group or a supergroup chat." />

<ApiParam name="chat_is_forum" type="Boolean" description="_Optional_. Pass _True_ to request a forum supergroup, pass _False_ to request a non-forum chat. If not specified, no additional restrictions are applied." />

<ApiParam name="chat_has_username" type="Boolean" description="_Optional_. Pass _True_ to request a supergroup or a channel with a username, pass _False_ to request a chat without a username. If not specified, no additional restrictions are applied." />

<ApiParam name="chat_is_created" type="Boolean" description="_Optional_. Pass _True_ to request a chat owned by the user. Otherwise, no additional restrictions are applied." />

<ApiParam name="user_administrator_rights" type="ChatAdministratorRights" description="_Optional_. A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of _bot\_administrator\_rights_. If not specified, no additional restrictions are applied." />

<ApiParam name="bot_administrator_rights" type="ChatAdministratorRights" description="_Optional_. A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of _user\_administrator\_rights_. If not specified, no additional restrictions are applied." />

<ApiParam name="bot_is_member" type="Boolean" description="_Optional_. Pass _True_ to request a chat with the bot as a member. Otherwise, no additional restrictions are applied." />

<ApiParam name="request_title" type="Boolean" description="_Optional_. Pass _True_ to request the chat's title" />

<ApiParam name="request_username" type="Boolean" description="_Optional_. Pass _True_ to request the chat's username" />

<ApiParam name="request_photo" type="Boolean" description="_Optional_. Pass _True_ to request the chat's photo" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
