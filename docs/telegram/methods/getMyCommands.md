---
title: getMyCommands — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Read bot command lists by scope and language using GramIO. TypeScript examples for getMyCommands — scoped commands, language overrides, and command management workflows.
  - - meta
    - name: keywords
      content: getMyCommands, telegram bot api, gramio getMyCommands, getMyCommands typescript, telegram bot commands list, bot command scope, BotCommandScope, language_code, telegram bot command menu, setMyCommands, deleteMyCommands, BotCommand array, how to get bot commands telegram
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

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the bot's default commands (all users, all chats)
const commands = await bot.api.getMyCommands({});
console.log(commands); // [] if no default commands are set
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get commands scoped to private chats only
const privateCommands = await bot.api.getMyCommands({
  scope: { type: "all_private_chats" },
});

// Get commands for all group chat administrators
const adminCommands = await bot.api.getMyCommands({
  scope: { type: "all_chat_administrators" },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get localized commands for a specific language
const ruCommands = await bot.api.getMyCommands({
  scope: { type: "default" },
  language_code: "ru",
});

const enCommands = await bot.api.getMyCommands({
  scope: { type: "default" },
  language_code: "en",
});

console.log("RU:", ruCommands);
console.log("EN:", enCommands);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get commands for a specific user in a specific chat
const userCommands = await bot.api.getMyCommands({
  scope: {
    type: "chat_member",
    chat_id: -1001234567890,
    user_id: 987654321,
  },
  language_code: "en",
});

// Display the command list
for (const cmd of userCommands) {
  console.log(`/${cmd.command} — ${cmd.description}`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Audit all scopes by checking a few key ones
const [defaults, groups, privateChats] = await Promise.all([
  bot.api.getMyCommands({}),
  bot.api.getMyCommands({ scope: { type: "all_group_chats" } }),
  bot.api.getMyCommands({ scope: { type: "all_private_chats" } }),
]);

console.log("Default:", defaults.map((c) => c.command));
console.log("Groups: ", groups.map((c) => c.command));
console.log("Private:", privateChats.map((c) => c.command));
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: SCOPE_UNSUPPORTED` | `scope.type` is not a valid value — use one of the documented `BotCommandScope` types |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Both parameters are optional.** Omitting `scope` defaults to `{ type: "default" }`; omitting `language_code` defaults to an empty string (language-agnostic fallback commands).
- **Returns empty array if no commands are set.** This is not an error — it simply means `setMyCommands` has never been called for that scope/language combination.
- **Scope resolution is hierarchical.** Telegram shows the most specific command set that matches the user's context. If `chat_member` scope has commands, those override `all_group_chats`, which overrides `default`. `getMyCommands` reads one specific scope — it does not simulate the resolution chain.
- **Language overrides the base scope.** If you set English commands for the `default` scope, `getMyCommands({ language_code: "en" })` returns those. Users with a different language fall back to the language-agnostic version.
- **`language_code` must be ISO 639-1** (e.g., `"en"`, `"ru"`, `"de"`). An empty string `""` reads the commands without a language filter.
- **Up to 100 commands per scope+language.** Each command description is limited to 1–256 characters; command names must be lowercase and match `/[a-z0-9_]{1,32}/`.

## See Also

- [BotCommand](/telegram/types/BotCommand) — return type element
- [BotCommandScope](/telegram/types/BotCommandScope) — union type for all scope variants
- [setMyCommands](/telegram/methods/setMyCommands) — set commands for a scope
- [deleteMyCommands](/telegram/methods/deleteMyCommands) — remove commands for a scope
- [getMe](/telegram/methods/getMe) — get the bot's identity and capabilities
