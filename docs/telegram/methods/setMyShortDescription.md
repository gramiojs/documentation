---
title: setMyShortDescription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set your Telegram bot's short description shown on the profile page and in share links using GramIO. Supports per-language text. TypeScript examples included.
  - - meta
    - name: keywords
      content: setMyShortDescription, telegram bot api, telegram bot short description, gramio setMyShortDescription, set bot short description, bot profile page description, setMyShortDescription typescript, setMyShortDescription example, language_code, how to set telegram bot short description, bot share link description
---

# setMyShortDescription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmyshortdescription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns *True* on success.

## Parameters

<ApiParam name="short_description" type="String" description="New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language." :minLen="0" :maxLen="120" />

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the default short description (shown to all users without a localized version)
await bot.api.setMyShortDescription({
  short_description: "Task manager & reminder bot. Send /help to start.",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a localized short description for Russian-speaking users
await bot.api.setMyShortDescription({
  short_description: "Менеджер задач и напоминаний. Отправьте /help.",
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the localized short description (falls back to the default)
await bot.api.setMyShortDescription({
  short_description: "",
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read back the short description to confirm it was saved
const result = await bot.api.getMyShortDescription({ language_code: "ru" });
console.log(result.short_description);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: short description is too long` | `short_description` exceeds 120 characters — trim content |
| 400 | `Bad Request: LANGUAGE_CODE_INVALID` | `language_code` is not a valid ISO 639-1 two-letter code |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Short description appears on the profile page and in shared links.** Unlike the full description (shown in empty chats), the short description is visible on the bot's public profile and in forwarded bot links — it acts as your bot's tagline.
- **120 character limit is strict.** Write a concise, punchy tagline. Count carefully — this limit is tight and Telegram enforces it server-side.
- **Language fallback applies.** Users see the localized version matching their Telegram language setting. Always set a default (without `language_code`) before adding translations.
- **Empty string removes the localized version.** Passing `short_description: ""` with a `language_code` removes that translation; without `language_code` it clears the global default.
- **Different from the full description.** `setMyDescription` controls what users see in an empty chat; this method controls what appears on the profile page and share link previews.

## See Also

- [getMyShortDescription](/telegram/methods/getMyShortDescription) — read the current short description
- [setMyDescription](/telegram/methods/setMyDescription) — change the full description shown in empty chats
- [setMyName](/telegram/methods/setMyName) — change the bot's display name
- [BotShortDescription](/telegram/types/BotShortDescription) — the return type of getMyShortDescription
