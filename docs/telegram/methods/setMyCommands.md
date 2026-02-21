---
title: setMyCommands — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setMyCommands Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setMyCommands, telegram bot api, gramio setMyCommands, setMyCommands typescript, setMyCommands example
---

# setMyCommands

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmycommands" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the list of the bot's commands. See [this manual](https://core.telegram.org/bots/features#commands) for more details about bot commands. Returns *True* on success.

## Parameters

<ApiParam name="commands" type="BotCommand[]" required description="A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified." />

<ApiParam name="scope" type="BotCommandScope" description="A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault)." />

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
