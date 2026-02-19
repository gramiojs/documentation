---
title: KeyboardButton — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: KeyboardButton Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: KeyboardButton, telegram bot api types, gramio KeyboardButton, KeyboardButton object, KeyboardButton typescript
---

# KeyboardButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#keyboardbutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents one button of the reply keyboard. At most one of the fields other than _text_, _icon\_custom\_emoji\_id_, and _style_ must be used to specify the type of the button. For simple text buttons, _String_ can be used instead of this object to specify the button text.

## Fields

<ApiParam name="text" type="String" required description="Text of the button. If none of the fields other than _text_, _icon\_custom\_emoji\_id_, and _style_ are used, it will be sent as a message when the button is pressed" />

<ApiParam name="icon_custom_emoji_id" type="String" description="_Optional_. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com) or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription." />

<ApiParam name="style" type="String" description="_Optional_. Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used." />

<ApiParam name="request_users" type="KeyboardButtonRequestUsers" description="_Optional_. If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a “users\_shared” service message. Available in private chats only." />

<ApiParam name="request_chat" type="KeyboardButtonRequestChat" description="_Optional_. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat\_shared” service message. Available in private chats only." />

<ApiParam name="request_contact" type="Boolean" description="_Optional_. If _True_, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only." />

<ApiParam name="request_location" type="Boolean" description="_Optional_. If _True_, the user's current location will be sent when the button is pressed. Available in private chats only." />

<ApiParam name="request_poll" type="KeyboardButtonPollType" description="_Optional_. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only." />

<ApiParam name="web_app" type="WebAppInfo" description="_Optional_. If specified, the described [Web App](https://core.telegram.org/bots/webapps) will be launched when the button is pressed. The Web App will be able to send a “web\_app\_data” service message. Available in private chats only." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
