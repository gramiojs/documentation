---
title: deleteMyCommands — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: deleteMyCommands Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: deleteMyCommands, telegram bot api, gramio deleteMyCommands, deleteMyCommands typescript, deleteMyCommands example
---

# deleteMyCommands

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletemycommands" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, [higher level commands](https://core.telegram.org/bots/api#determining-list-of-commands) will be shown to affected users. Returns _True_ on success.

## Parameters

<ApiParam name="scope" type="BotCommandScope" required description="A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault)." />

<ApiParam name="language_code" type="String" required description="A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands" />

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
