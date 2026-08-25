---
title: RichMessageButton — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: RichMessageButton Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: RichMessageButton, telegram bot api types, gramio RichMessageButton, RichMessageButton object, RichMessageButton typescript
---

# RichMessageButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#richmessagebutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a button in a [RichMessage](https://core.telegram.org/bots/api#richmessage). Exactly one of the fields other than *text* and *style* must be used to specify the type of the button.

## Fields

<ApiParam name="text" type="RichText" required description="Text of the button. May contain only plain text, [RichTextCustomEmoji](https://core.telegram.org/bots/api#richtextcustomemoji) and [RichTextDateTime](https://core.telegram.org/bots/api#richtextdatetime) entities." />

<ApiParam name="style" type="String" description="*Optional*. Style of the button. Must be one of &quot;danger&quot; (red), &quot;success&quot; (green), &quot;primary&quot; (blue) or &quot;link&quot; (the button is shown as a regular link without borders). If omitted, then an app-specific style is used. The style &quot;link&quot; is allowed only for callback buttons." :enumValues='["danger","success","primary","link"]' />

<ApiParam name="url" type="String" description="*Optional*. HTTP or tg:// URL to be opened when the button is pressed. Links `tg://user?id=&lt;user_id&gt;` can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings." />

<ApiParam name="callback_data" type="String" description="*Optional*. Data to be sent in a [callback query](https://core.telegram.org/bots/api#callbackquery) to the bot when the button is pressed, 1-64 bytes" />

<ApiParam name="web_app" type="WebAppInfo" description="*Optional*. Description of the [Web App](https://core.telegram.org/bots/webapps) that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery). Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account." />

<ApiParam name="login_url" type="LoginUrl" description="*Optional*. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login). Not supported for ephemeral messages." />

<ApiParam name="switch_inline_query" type="String" description="*Optional*. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account." />

<ApiParam name="switch_inline_query_current_chat" type="String" description="*Optional*. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account." />

<ApiParam name="switch_inline_query_chosen_chat" type="SwitchInlineQueryChosenChat" description="*Optional*. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account." />

<ApiParam name="copy_text" type="CopyTextButton" description="*Optional*. A button that copies the specified text to the clipboard" />

<ApiParam name="disabled" type="DisabledButton" description="*Optional*. If set, then the button is disabled and does nothing" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
