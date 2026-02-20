---
title: deleteMyCommands — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete bot commands for a scope or language using GramIO. TypeScript examples, scope types, language fallback behavior, and error reference.
  - - meta
    - name: keywords
      content: deleteMyCommands, telegram bot api, delete bot commands telegram, gramio deleteMyCommands, deleteMyCommands typescript, BotCommandScope, language_code, reset bot commands, how to delete telegram bot commands, deleteMyCommands example
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

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete all commands globally (all scopes, all languages)
await bot.api.deleteMyCommands({});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete commands only for private chats
await bot.api.deleteMyCommands({
  scope: { type: "all_private_chats" },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete Russian-language commands for all group chat admins
await bot.api.deleteMyCommands({
  scope: { type: "all_chat_administrators" },
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete commands set for a specific chat
await bot.api.deleteMyCommands({
  scope: { type: "chat", chat_id: -1001234567890 },
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: bad parameter scope` | The `scope` object has an invalid `type` or is missing required fields (e.g. `chat_id` for scope `chat`) |
| 400 | `Bad Request: language code is invalid` | `language_code` is not a valid ISO 639-1 two-letter code |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **All parameters are optional.** Calling `deleteMyCommands({})` with no arguments clears commands for the default scope (all users, no language filter). This is the most common "reset" use case.
- **Deletion reveals higher-level commands.** After deletion, Telegram falls back to commands registered at a higher scope level (e.g. deleting chat-specific commands reveals group-wide commands). It does not show an empty menu.
- **Language code acts as a filter, not a full reset.** Passing `language_code: "en"` only deletes commands specific to English users — commands with no language code (the "all users" fallback) are unaffected.
- **Scope must match exactly what was set.** You must pass the same scope type you used in `setMyCommands`. Deleting `all_group_chats` won't touch commands set for a specific `chat`.
- **Chat-specific scopes require `chat_id`.** Scopes like `chat`, `chat_administrators`, and `chat_member` need a valid `chat_id` (numeric or `@username`).

## See Also

- [setMyCommands](/telegram/methods/setMyCommands) — register commands for a scope/language
- [getMyCommands](/telegram/methods/getMyCommands) — retrieve current commands list
- [BotCommandScope](/telegram/types/BotCommandScope) — scope object reference
