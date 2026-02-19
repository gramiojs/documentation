---
title: getMyCommands — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getMyCommands Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getMyCommands, telegram bot api, gramio getMyCommands, getMyCommands typescript, getMyCommands example
---

# getMyCommands

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/BotCommand">BotCommand[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getmycommands" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of [BotCommand](https://core.telegram.org/bots/api#botcommand) objects. If commands aren't set, an empty list is returned.

## Parameters

<ApiParam name="scope" type="BotCommandScope" required description="A JSON-serialized object, describing scope of users. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault)." />

<ApiParam name="language_code" type="String" required description="A two-letter ISO 639-1 language code or an empty string" />

## Returns

On success, an array of [BotCommand](/telegram/types/BotCommand) objects is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
