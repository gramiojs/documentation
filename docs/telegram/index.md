---
title: Telegram Bot API Reference | GramIO
head:
  - - meta
    - name: description
      content: Complete Telegram Bot API reference with GramIO TypeScript examples. All methods, types, and parameters — better than the official docs.
  - - meta
    - name: keywords
      content: telegram bot api, telegram api reference, telegram methods, gramio, typescript, bot api docs
---

# Telegram Bot API Reference

A developer-friendly reference for the [Telegram Bot API](https://core.telegram.org/bots/api), with GramIO TypeScript examples for every method.

::: tip Why not just use the official docs?
The official Telegram docs are complete but dense. This reference adds:
- **TypeScript types** for every parameter and return value
- **GramIO-specific examples** showing real usage patterns
- **Searchable** from Google — find what you need faster
:::

## Methods

Methods are the actions your bot can perform — sending messages, answering queries, managing chats, and more.

### Sending Messages

| Method | Description |
|--------|-------------|
| [sendMessage](/telegram/methods/sendMessage) | Send text messages |
| [sendPhoto](/telegram/methods/sendPhoto) | Send photos |
| [sendDocument](/telegram/methods/sendDocument) | Send files |
| [sendVideo](/telegram/methods/sendVideo) | Send videos |
| [sendAudio](/telegram/methods/sendAudio) | Send audio files |
| [sendVoice](/telegram/methods/sendVoice) | Send voice messages |
| [sendAnimation](/telegram/methods/sendAnimation) | Send GIF animations |
| [sendSticker](/telegram/methods/sendSticker) | Send stickers |
| [sendMediaGroup](/telegram/methods/sendMediaGroup) | Send a group of media |
| [sendLocation](/telegram/methods/sendLocation) | Send location |
| [sendVenue](/telegram/methods/sendVenue) | Send a venue |
| [sendContact](/telegram/methods/sendContact) | Send a phone contact |
| [sendPoll](/telegram/methods/sendPoll) | Send a poll |
| [sendDice](/telegram/methods/sendDice) | Send an animated emoji |

### Getting Updates

| Method | Description |
|--------|-------------|
| [getUpdates](/telegram/methods/getUpdates) | Receive incoming updates via long polling |
| [setWebhook](/telegram/methods/setWebhook) | Specify a URL to receive incoming updates |
| [deleteWebhook](/telegram/methods/deleteWebhook) | Remove webhook integration |
| [getWebhookInfo](/telegram/methods/getWebhookInfo) | Get current webhook status |

### Bot Information

| Method | Description |
|--------|-------------|
| [getMe](/telegram/methods/getMe) | Get basic info about the bot |
| [logOut](/telegram/methods/logOut) | Log out from the cloud Bot API server |
| [close](/telegram/methods/close) | Close the bot instance |

### Editing Messages

| Method | Description |
|--------|-------------|
| [editMessageText](/telegram/methods/editMessageText) | Edit text of a sent message |
| [editMessageCaption](/telegram/methods/editMessageCaption) | Edit caption of a media message |
| [editMessageMedia](/telegram/methods/editMessageMedia) | Edit animation, audio, document, photo, or video |
| [editMessageReplyMarkup](/telegram/methods/editMessageReplyMarkup) | Edit reply markup of a message |
| [deleteMessage](/telegram/methods/deleteMessage) | Delete a message |
| [deleteMessages](/telegram/methods/deleteMessages) | Delete multiple messages |
| [copyMessage](/telegram/methods/copyMessage) | Copy a message |
| [forwardMessage](/telegram/methods/forwardMessage) | Forward a message |

### Chat Management

| Method | Description |
|--------|-------------|
| [getChat](/telegram/methods/getChat) | Get info about a chat |
| [getChatMember](/telegram/methods/getChatMember) | Get info about a chat member |
| [getChatMemberCount](/telegram/methods/getChatMemberCount) | Get the number of members in a chat |
| [banChatMember](/telegram/methods/banChatMember) | Ban a user in a chat |
| [unbanChatMember](/telegram/methods/unbanChatMember) | Unban a previously banned user |
| [restrictChatMember](/telegram/methods/restrictChatMember) | Restrict a user in a chat |
| [promoteChatMember](/telegram/methods/promoteChatMember) | Promote or demote a user in a chat |
| [leaveChat](/telegram/methods/leaveChat) | Bot leaves a group, supergroup, or channel |
| [pinChatMessage](/telegram/methods/pinChatMessage) | Pin a message in a chat |
| [unpinChatMessage](/telegram/methods/unpinChatMessage) | Unpin a message in a chat |

### Inline & Callback Queries

| Method | Description |
|--------|-------------|
| [answerCallbackQuery](/telegram/methods/answerCallbackQuery) | Send a response to a callback query |
| [answerInlineQuery](/telegram/methods/answerInlineQuery) | Send results for an inline query |
| [answerWebAppQuery](/telegram/methods/answerWebAppQuery) | Set result of an interaction with a Web App |

### Commands & Menu

| Method | Description |
|--------|-------------|
| [setMyCommands](/telegram/methods/setMyCommands) | Set the list of bot commands |
| [getMyCommands](/telegram/methods/getMyCommands) | Get the current list of bot commands |
| [deleteMyCommands](/telegram/methods/deleteMyCommands) | Delete bot commands |
| [setChatMenuButton](/telegram/methods/setChatMenuButton) | Change the bot's menu button |

## Types

Types describe the shape of data returned by the API and used as parameters.

### Core Objects

| Type | Description |
|------|-------------|
| [Message](/telegram/types/Message) | Represents a message |
| [User](/telegram/types/User) | Represents a Telegram user or bot |
| [Chat](/telegram/types/Chat) | Represents a chat |
| [Update](/telegram/types/Update) | Represents an incoming update |
| [MessageEntity](/telegram/types/MessageEntity) | Special entity in a text message |

### Media Types

| Type | Description |
|------|-------------|
| [PhotoSize](/telegram/types/PhotoSize) | Represents a photo or thumbnail |
| [Document](/telegram/types/Document) | Represents a general file |
| [Video](/telegram/types/Video) | Represents a video file |
| [Audio](/telegram/types/Audio) | Represents an audio file |
| [Voice](/telegram/types/Voice) | Represents a voice note |
| [Sticker](/telegram/types/Sticker) | Represents a sticker |
| [Animation](/telegram/types/Animation) | Represents an animation file |

### Keyboards

| Type | Description |
|------|-------------|
| [InlineKeyboardMarkup](/telegram/types/InlineKeyboardMarkup) | Inline keyboard |
| [InlineKeyboardButton](/telegram/types/InlineKeyboardButton) | Button on an inline keyboard |
| [ReplyKeyboardMarkup](/telegram/types/ReplyKeyboardMarkup) | Custom keyboard with reply options |
| [KeyboardButton](/telegram/types/KeyboardButton) | Button on a reply keyboard |
| [ReplyKeyboardRemove](/telegram/types/ReplyKeyboardRemove) | Remove the reply keyboard |
| [ForceReply](/telegram/types/ForceReply) | Force a reply from the user |

---

::: info Auto-generated
This reference is generated from the [Telegram Bot API schema](https://core.telegram.org/bots/api) (v9.0, April 2025).
GramIO usage examples are maintained manually.
:::
