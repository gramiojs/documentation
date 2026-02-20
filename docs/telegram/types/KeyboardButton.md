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

This object represents one button of the reply keyboard. At most one of the fields other than *text*, *icon\_custom\_emoji\_id*, and *style* must be used to specify the type of the button. For simple text buttons, *String* can be used instead of this object to specify the button text.

## Fields

<ApiParam name="text" type="String" required description="Text of the button. If none of the fields other than *text*, *icon\_custom\_emoji\_id*, and *style* are used, it will be sent as a message when the button is pressed" />

<ApiParam name="icon_custom_emoji_id" type="String" description="*Optional*. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com) or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription." />

<ApiParam name="style" type="String" description="*Optional*. Style of the button. Must be one of &quot;danger&quot; (red), &quot;success&quot; (green) or &quot;primary&quot; (blue). If omitted, then an app-specific style is used." :enumValues='["danger","success","primary"]' />

<ApiParam name="request_users" type="KeyboardButtonRequestUsers" description="*Optional*. If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a &quot;users\_shared&quot; service message. Available in private chats only." />

<ApiParam name="request_chat" type="KeyboardButtonRequestChat" description="*Optional*. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a &quot;chat\_shared&quot; service message. Available in private chats only." />

<ApiParam name="request_contact" type="Boolean" description="*Optional*. If *True*, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only." />

<ApiParam name="request_location" type="Boolean" description="*Optional*. If *True*, the user's current location will be sent when the button is pressed. Available in private chats only." />

<ApiParam name="request_poll" type="KeyboardButtonPollType" description="*Optional*. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only." />

<ApiParam name="web_app" type="WebAppInfo" description="*Optional*. If specified, the described [Web App](https://core.telegram.org/bots/webapps) will be launched when the button is pressed. The Web App will be able to send a &quot;web\_app\_data&quot; service message. Available in private chats only." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
