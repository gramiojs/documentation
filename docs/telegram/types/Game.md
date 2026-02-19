---
title: Game — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Game Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Game, telegram bot api types, gramio Game, Game object, Game typescript
---

# Game

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#game" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.

## Fields

<ApiParam name="title" type="String" required description="Title of the game" />

<ApiParam name="description" type="String" required description="Description of the game" />

<ApiParam name="photo" type="PhotoSize[]" required description="Photo that will be displayed in the game message in chats." />

<ApiParam name="text" type="String" description="_Optional_. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls [setGameScore](https://core.telegram.org/bots/api#setgamescore), or manually edited using [editMessageText](https://core.telegram.org/bots/api#editmessagetext). 0-4096 characters." />

<ApiParam name="text_entities" type="MessageEntity[]" description="_Optional_. Special entities that appear in _text_, such as usernames, URLs, bot commands, etc." />

<ApiParam name="animation" type="Animation" description="_Optional_. Animation that will be displayed in the game message in chats. Upload via [BotFather](https://t.me/botfather)" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
