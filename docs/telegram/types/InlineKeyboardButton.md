---
title: InlineKeyboardButton — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineKeyboardButton Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineKeyboardButton, telegram bot api types, gramio InlineKeyboardButton, InlineKeyboardButton object, InlineKeyboardButton typescript
---

# InlineKeyboardButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinekeyboardbutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents one button of an inline keyboard. Exactly one of the fields other than *text*, *icon\_custom\_emoji\_id*, and *style* must be used to specify the type of the button.

## Fields

<ApiParam name="text" type="String" required description="Label text on the button" />

<ApiParam name="icon_custom_emoji_id" type="String" description="*Optional*. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com) or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription." />

<ApiParam name="style" type="String" description="*Optional*. Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used." :enumValues='["danger","success","primary"]' />

<ApiParam name="url" type="String" description="*Optional*. HTTP or tg:// URL to be opened when the button is pressed. Links `tg://user?id=&lt;user_id&gt;` can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings." />

<ApiParam name="callback_data" type="String" description="*Optional*. Data to be sent in a [callback query](https://core.telegram.org/bots/api#callbackquery) to the bot when the button is pressed, 1-64 bytes" />

<ApiParam name="web_app" type="WebAppInfo" description="*Optional*. Description of the [Web App](https://core.telegram.org/bots/webapps) that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery). Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a Telegram Business account." />

<ApiParam name="login_url" type="LoginUrl" description="*Optional*. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login)." />

<ApiParam name="switch_inline_query" type="String" description="*Optional*. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a Telegram Business account." />

<ApiParam name="switch_inline_query_current_chat" type="String" description="*Optional*. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted.      This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a Telegram Business account." />

<ApiParam name="switch_inline_query_chosen_chat" type="SwitchInlineQueryChosenChat" description="*Optional*. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a Telegram Business account." />

<ApiParam name="copy_text" type="CopyTextButton" description="*Optional*. Description of the button that copies the specified text to the clipboard." />

<ApiParam name="callback_game" type="CallbackGame" description="*Optional*. Description of the game that will be launched when the user presses the button.      **NOTE:** This type of button **must** always be the first button in the first row." />

<ApiParam name="pay" type="Boolean" description="*Optional*. Specify *True*, to send a [Pay button](https://core.telegram.org/bots/api#payments). Substrings “![⭐](//telegram.org/img/emoji/40/E2AD90.png)” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.      **NOTE:** This type of button **must** always be the first button in the first row and can only be used in invoice messages." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
