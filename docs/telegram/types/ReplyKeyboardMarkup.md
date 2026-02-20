---
title: ReplyKeyboardMarkup — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ReplyKeyboardMarkup Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ReplyKeyboardMarkup, telegram bot api types, gramio ReplyKeyboardMarkup, ReplyKeyboardMarkup object, ReplyKeyboardMarkup typescript
---

# ReplyKeyboardMarkup

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#replykeyboardmarkup" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a [custom keyboard](https://core.telegram.org/bots/features#keyboards) with reply options (see [Introduction to bots](https://core.telegram.org/bots/features#keyboards) for details and examples). Not supported in channels and for messages sent on behalf of a Telegram Business account.

## Fields

<ApiParam name="keyboard" type="KeyboardButton[][]" required description="Array of button rows, each represented by an Array of [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton) objects" />

<ApiParam name="is_persistent" type="Boolean" description="*Optional*. Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to *false*, in which case the custom keyboard can be hidden and opened with a keyboard icon." />

<ApiParam name="resize_keyboard" type="Boolean" description="*Optional*. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to *false*, in which case the custom keyboard is always of the same height as the app's standard keyboard." />

<ApiParam name="one_time_keyboard" type="Boolean" description="*Optional*. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to *false*." />

<ApiParam name="input_field_placeholder" type="String" description="*Optional*. The placeholder to be shown in the input field when the keyboard is active; 1-64 characters" :minLen="1" :maxLen="64" />

<ApiParam name="selective" type="Boolean" description="*Optional*. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the *text* of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.      *Example:* A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
