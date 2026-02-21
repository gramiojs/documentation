---
title: setMyCommands — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Register bot commands in the Telegram menu using GramIO. TypeScript examples with scopes, language codes, per-user and per-chat overrides, and 100-command limit.
  - - meta
    - name: keywords
      content: setMyCommands, telegram bot api, telegram bot commands menu, gramio setMyCommands, setMyCommands typescript, setMyCommands example, BotCommand, BotCommandScope, language_code, telegram bot command list, register commands telegram bot, scope commands, how to set bot commands telegram, getMyCommands, deleteMyCommands
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

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Register global commands visible to all users
await bot.api.setMyCommands({
  commands: [
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help message" },
    { command: "settings", description: "Open settings" },
  ],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Register language-specific commands for Russian users
await bot.api.setMyCommands({
  commands: [
    { command: "start", description: "Запустить бота" },
    { command: "help", description: "Помощь" },
    { command: "settings", description: "Настройки" },
  ],
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Register admin-only commands visible only in a specific chat
await bot.api.setMyCommands({
  commands: [
    { command: "ban", description: "Ban a user" },
    { command: "kick", description: "Kick a user" },
    { command: "mute", description: "Mute a user" },
  ],
  scope: {
    type: "chat_administrators",
    chat_id: -1001234567890,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Register private-chat-only commands (hidden in groups)
await bot.api.setMyCommands({
  commands: [
    { command: "subscribe", description: "Subscribe to updates" },
    { command: "unsubscribe", description: "Unsubscribe" },
  ],
  scope: { type: "all_private_chats" },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Register commands on bot startup — call once during initialization
bot.onStart(async ({ info }) => {
  await bot.api.setMyCommands({
    commands: [
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Get help" },
    ],
  });
  console.log(`Bot @${info.username} commands registered`);
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: commands list must be non-empty` | Passing an empty `commands` array — use [`deleteMyCommands`](/telegram/methods/deleteMyCommands) instead |
| 400 | `Bad Request: Too many commands` | More than 100 commands specified — reduce to ≤ 100 |
| 400 | `Bad Request: command is too long` | A command name exceeds 32 characters or a description exceeds 256 characters |
| 400 | `Bad Request: command must start with a letter` | Command names must begin with a lowercase letter and contain only `a-z`, `0-9`, `_` |
| 400 | `Bad Request: language_code must be a 2-letter ISO 639-1 code` | Invalid `language_code` format — use exactly 2 lowercase letters (e.g. `"en"`, `"ru"`) |
| 400 | `Bad Request: chat not found` | The `scope.chat_id` in a chat-specific scope is invalid or the bot isn't in the chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` |

## Tips & Gotchas

- **Commands are scoped and layered.** Telegram uses the most specific scope for each user: `BotCommandScopeChatMember` overrides `BotCommandScopeChatAdministrators`, which overrides `BotCommandScopeChat`, which overrides language-specific defaults. Plan your scope hierarchy accordingly.
- **`language_code: ""` (or omitting it) is the fallback for all users.** Language-specific commands only show for users whose client language matches. Always register a fallback set without `language_code` first.
- **Max 100 commands per scope+language combination.** Each unique `{scope, language_code}` pair has its own 100-command limit — you can have 100 commands in default scope, plus another 100 for Russian, etc.
- **Command names are case-sensitive and restricted.** Names must be 1–32 characters, start with a letter, and contain only `a-z`, `0-9`, and `_`. Use [`deleteMyCommands`](/telegram/methods/deleteMyCommands) with the same scope+language to remove them.
- **Call `setMyCommands` during bot startup.** Register commands in the `onStart` hook so they are always up-to-date when the bot starts. Telegram clients cache the command list — updates appear quickly but may take a few seconds.
- **Verify with [`getMyCommands`](/telegram/methods/getMyCommands).** After setting commands you can retrieve them with the same `scope`+`language_code` to confirm the update was applied.

## See Also

- [`getMyCommands`](/telegram/methods/getMyCommands) — retrieve the current command list for a scope
- [`deleteMyCommands`](/telegram/methods/deleteMyCommands) — remove commands for a specific scope and language
- [`BotCommand`](/telegram/types/BotCommand) — command object with `command` and `description` fields
- [`BotCommandScope`](/telegram/types/BotCommandScope) — scope union type for targeting specific users/chats
