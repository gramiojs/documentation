---
title: setMyDescription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set your Telegram bot's description shown in empty chats using GramIO. Supports per-language descriptions with ISO 639-1 codes. TypeScript examples included.
  - - meta
    - name: keywords
      content: setMyDescription, telegram bot api, telegram bot description, gramio setMyDescription, set bot description, bot profile description, setMyDescription typescript, setMyDescription example, language_code, how to set telegram bot description, bot description localization
---

# setMyDescription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmydescription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns *True* on success.

## Parameters

<ApiParam name="description" type="String" description="New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language." :minLen="0" :maxLen="512" />

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the default description (shown to all users without a localized version)
await bot.api.setMyDescription({
  description:
    "I can help you manage tasks, set reminders, and answer questions. Send /help to get started.",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a localized description for Russian-speaking users
await bot.api.setMyDescription({
  description:
    "Я помогу вам управлять задачами и устанавливать напоминания. Отправьте /help для начала.",
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the localized description (falls back to the default)
await bot.api.setMyDescription({
  description: "",
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read back the description to confirm it was saved
const result = await bot.api.getMyDescription({ language_code: "ru" });
console.log(result.description);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: description is too long` | `description` exceeds 512 characters — trim content before sending |
| 400 | `Bad Request: LANGUAGE_CODE_INVALID` | `language_code` is not a valid ISO 639-1 two-letter code |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Description appears in empty chats only.** Users see this text before sending their first message — after that, it's no longer visible. Make it welcoming and action-oriented.
- **512 character limit.** Keep descriptions concise; for longer content, the description may be truncated in some Telegram clients.
- **Language fallback works hierarchically.** If a user's language has no dedicated description, they see the default (set without `language_code`). Always set a default before adding localizations.
- **Empty string removes the localized version.** Passing `description: ""` with a `language_code` deletes that translation; passing it without a code clears the default for all languages.
- **Changes are visible immediately** in new empty chats, but users already in a chat may not see the update until they clear the chat history.

## See Also

- [getMyDescription](/telegram/methods/getMyDescription) — read the current bot description
- [setMyName](/telegram/methods/setMyName) — change the bot's display name
- [setMyShortDescription](/telegram/methods/setMyShortDescription) — change the short description shown on the profile page
- [BotDescription](/telegram/types/BotDescription) — the return type of getMyDescription
