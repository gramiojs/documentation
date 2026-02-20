---
title: KeyboardButtonRequestUsers — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: KeyboardButtonRequestUsers Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: KeyboardButtonRequestUsers, telegram bot api types, gramio KeyboardButtonRequestUsers, KeyboardButtonRequestUsers object, KeyboardButtonRequestUsers typescript
---

# KeyboardButtonRequestUsers

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#keyboardbuttonrequestusers" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object defines the criteria used to request suitable users. Information about the selected users will be shared with the bot when the corresponding button is pressed. [More about requesting users »](https://core.telegram.org/bots/features#chat-and-user-selection)

## Fields

<ApiParam name="request_id" type="Integer" required description="Signed 32-bit identifier of the request that will be received back in the [UsersShared](https://core.telegram.org/bots/api#usersshared) object. Must be unique within the message" />

<ApiParam name="user_is_bot" type="Boolean" description="*Optional*. Pass *True* to request bots, pass *False* to request regular users. If not specified, no additional restrictions are applied." />

<ApiParam name="user_is_premium" type="Boolean" description="*Optional*. Pass *True* to request premium users, pass *False* to request non-premium users. If not specified, no additional restrictions are applied." />

<ApiParam name="max_quantity" type="Integer" description="*Optional*. The maximum number of users to be selected; 1-10. Defaults to 1." :defaultValue="1" />

<ApiParam name="request_name" type="Boolean" description="*Optional*. Pass *True* to request the users' first and last names" />

<ApiParam name="request_username" type="Boolean" description="*Optional*. Pass *True* to request the users' usernames" />

<ApiParam name="request_photo" type="Boolean" description="*Optional*. Pass *True* to request the users' photos" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
